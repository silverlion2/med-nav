import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// --- 🛡️ 基础防护：IP 内存级限流字典 ---
const rateLimitMap = new Map();

// --- 🛡️ 隐私保护：手机号单向 Hash 加密函数 (PIPL 合规要求) ---
function hashPhone(phone) {
  // 加盐哈希，即使数据库被盗也无法反推明文手机号
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
    // 🛡️ 阶段一防爆刷：IP 维度的频率限制 (1分钟内最多尝试建档 5 次)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 分钟窗口期
    
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

    const { phone, code, profileData } = req.body;
    if (!phone || !code) return res.status(400).json({ success: false, message: '缺少核心鉴权参数' });

    // 🛡️ 将明文手机号转化为 Hash 密文
    const secureHashedPhone = hashPhone(phone);

    const result = await withRetry(async () => {
      return await prisma.$transaction(async (tx) => {
        // 🚀 使用哈希值存入数据库，数据库内不再出现明文手机号
        const user = await tx.user.upsert({
          where: { phone: secureHashedPhone },
          update: { sessionId: code }, 
          create: {
            phone: secureHashedPhone,
            sessionId: code
          },
        });

        // 绑定问卷数据快照
        const assessment = await tx.assessment.create({
          data: {
            userId: user.id,
            profileJson: profileData || {},
            matchedBenefitsIds: [] 
          }
        });
        return { userId: user.id, assessmentId: assessment.id };
      });
    });

    return res.status(200).json({ success: true, ...result });

  } catch (error) {
    console.error("[API Error] Create Profile Failed:", error);
    return res.status(500).json({ success: false, message: "网络或数据库连接异常，请稍后再试" });
  }
}