import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { runDecisionEngine } from '../utils/decisionEngine.js';
import { Redis } from '@upstash/redis';

// Only initialize Prisma if a database URL is actually provided
const hasDatabase = !!process.env.DATABASE_URL;
let prisma = null;

if (hasDatabase) {
  prisma = global.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
}

// Initialize Redis for rate limiting
// Fallback to null if not configured to prevent crash during local dev without Redis
const redis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN 
  ? new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN }) 
  : null;

// --- 🛡️ 阶段一隐私保护：手机号单向 Hash 加密函数 (PIPL 合规要求) ---
function hashPhone(phone) {
  const salt = process.env.IP_HASH_SALT || "med-nav-secure-salt-2024-fallback";
  return crypto.createHash('sha256').update(phone + salt).digest('hex');
}

/**
 * 指数退避重试，防数据库冷启动超时
 */
async function withRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isNetworkError = err.message?.includes('Can\'t reach database') || 
                             err.code === 'P1001' || 
                             err.code === 'P5003' || 
                             err.message?.includes('connection limit') || 
                             err.message?.includes('timeout');
      if (isNetworkError && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i + 1) * 1000));
        continue;
      }
      throw err;
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    // ==========================================
    // 🛡️ 1. IP 防爆刷逻辑 (Rate Limiting via Redis)
    // ==========================================
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    
    if (redis) {
      const windowMs = 60; // 60 seconds
      const maxRequests = 5;
      const redisKey = `rate_limit:${ip}`;

      const requests = await redis.incr(redisKey);
      
      if (requests === 1) {
        await redis.expire(redisKey, windowMs);
      }

      if (requests > maxRequests) {
        return res.status(429).json({ success: false, message: '您的操作过于频繁，为保护系统安全，请1分钟后再试。' });
      }
    }

    // ==========================================
    // 🛡️ 2. 参数校验与隐私加密
    // ==========================================
    const { phone, code, profileData } = req.body;
    if (!phone || !code) return res.status(400).json({ success: false, message: '缺少核心鉴权参数' });
    if (typeof phone !== 'string' || phone.length !== 11 || !/^\d{11}$/.test(phone)) return res.status(400).json({ success: false, message: '手机号格式不正确' });
    if (typeof code !== 'string' || code.length !== 4 || !/^\d{4}$/.test(code)) return res.status(400).json({ success: false, message: '专属码格式不正确' });

    // 将明文手机号转化为 Hash 密文
    const secureHashedPhone = hashPhone(phone);

    // ==========================================
    // 🧠 3. 核心算力：调用逻辑引擎，动态计算福利匹配结果
    // ==========================================
    // 引擎会返回按类别分好的对象：{ urgent: [...], financial: [...], ... }
    const engineResult = runDecisionEngine(profileData || {});
    
    // 如果没有配置数据库环境变量 (Phase 1 纯内存模式)，我们直接返回引擎结果并跳过数据库写入
    if (!hasDatabase || !prisma) {
      console.log('No DATABASE_URL found. Running in Phase 1 purely in-memory mode.');
      return res.status(200).json({ success: true, userId: 'mock-user-phase-1', assessmentId: 'mock-assessment-phase-1', engineResult });
    }

    // 因为目前 schema.prisma 里 matchedBenefitsIds 设定的格式是 String[] 一维数组
    // 我们需要将引擎返回的对象拍平（flatten）成一个纯 ID 构成的数组
    const calculatedBenefits = Object.values(engineResult).flat();

    // ==========================================
    // 🗄️ 4. 数据库安全写入 (Transaction)
    // ==========================================
    const result = await withRetry(async () => {
      return await prisma.$transaction(async (tx) => {
        
        // 使用哈希值存入 User 表
        const user = await tx.user.upsert({
          where: { phone: secureHashedPhone },
          update: { sessionId: code }, 
          create: {
            phone: secureHashedPhone,
            sessionId: code
          },
        });

        // 将引擎算出的最终匹配结果 (calculatedBenefits) 落库存档！
        const assessment = await tx.assessment.create({
          data: {
            userId: user.id,
            profileJson: profileData || {},
            matchedBenefitsIds: calculatedBenefits 
          }
        });
        
        return { userId: user.id, assessmentId: assessment.id, engineResult };
      });
    });

    // 返回成功状态，同时把引擎分好类的详细结果 (engineResult) 给前端，方便前端未来直接渲染
    return res.status(200).json({ success: true, ...result });

  } catch (error) {
    console.error("[API Error] Create Profile Failed:", error);
    return res.status(500).json({ success: false, message: "网络或数据库连接异常，请稍后再试" });
  }
}