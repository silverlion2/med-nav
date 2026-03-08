import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
// 🚀 引入我们刚刚写好的核心逻辑引擎
import { runDecisionEngine } from '../utils/decisionEngine.js';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// --- 🛡️ 阶段一基础防护：IP 内存级限流字典 ---
const rateLimitMap = new Map();

// --- 🛡️ 阶段一隐私保护：手机号单向 Hash 加密函数 (PIPL 合规要求) ---
function hashPhone(phone) {
  const salt = "med-nav-secure-salt-2024";
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
      const isNetworkError = err.message?.includes('Can\'t reach database') || err.code === 'P1001';
      if (isNetworkError && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
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
    // 🛡️ 1. IP 防爆刷逻辑 (Rate Limiting)
    // ==========================================
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; 
    
    if (rateLimitMap.has(ip)) {
      const userStatus = rateLimitMap.get(ip);
      if (now - userStatus.startTime < windowMs) {
        if (userStatus.count >= 5) {
          return res.status(429).json({ success: false, message: '您的操作过于频繁，为保护系统安全，请1分钟后再试。' });
        }
        userStatus.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, startTime: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, startTime: now });
    }

    // ==========================================
    // 🛡️ 2. 参数校验与隐私加密
    // ==========================================
    const { phone, code, profileData } = req.body;
    if (!phone || !code) return res.status(400).json({ success: false, message: '缺少核心鉴权参数' });

    // 将明文手机号转化为 Hash 密文
    const secureHashedPhone = hashPhone(phone);

    // ==========================================
    // 🧠 3. 核心算力：调用逻辑引擎，动态计算福利匹配结果
    // ==========================================
    // 引擎会返回按类别分好的对象：{ urgent: [...], financial: [...], ... }
    const engineResult = runDecisionEngine(profileData || {});
    
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