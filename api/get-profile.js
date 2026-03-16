// import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
// 🚀 引入核心逻辑引擎，让老用户找回时也能动态计算！
import { runDecisionEngine } from '../utils/decisionEngine.js';

const hasDatabase = !!process.env.POSTGRES_PRISMA_URL;
let prisma = null;

if (hasDatabase) {
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = global.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
  } catch (e) {
    console.log("Prisma Client not available, continuing without database.");
  }
}

const rateLimitMap = new Map();

function hashPhone(phone) {
  const salt = "med-nav-secure-salt-2024";
  return crypto.createHash('sha256').update(phone + salt).digest('hex');
}

async function withRetry(fn, retries = 3) {
  // If no prisma, just execute the mock function
  if (!prisma) return await fn();

  for (let i = 0; i < retries; i++) {
    try { 
      return await fn(); 
    } catch (err) {
      if ((err.message?.includes('database') || err.code === 'P1001') && i < retries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000)); 
        continue;
      }
      throw err;
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: '只支持 POST 请求' });

  try {
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; 
    
    if (rateLimitMap.has(ip)) {
      const userStatus = rateLimitMap.get(ip);
      if (now - userStatus.startTime < windowMs) { 
        if (userStatus.count >= 5) {
          return res.status(429).json({ success: false, message: '尝试错误次数过多，账号已临时锁定，请1分钟后再试。' });
        }
        userStatus.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, startTime: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, startTime: now });
    }

    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ success: false, message: '手机号或专属码缺失' });

    const secureHashedPhone = hashPhone(phone);

    const result = await withRetry(async () => {
      const user = await prisma.user.findUnique({
        where: { phone: secureHashedPhone }
      });

      if (!user || user.sessionId !== code) {
        return { error: '手机号或专属码不正确，请核对后重试', status: 400 };
      }

      const assessment = await prisma.assessment.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });

      if (!assessment) return { error: '未找到您的健康评估记录', status: 400 };
      
      // 🚀 核心改动：把该用户的历史问卷数据，放进引擎重新跑一遍，输出分类好的结果！
      const engineResult = runDecisionEngine(assessment.profileJson || {});
      
      return { 
        success: true, 
        profileData: assessment.profileJson,
        engineResult: engineResult // 将引擎跑出来的结果一起扔给前端渲染
      };
    });

    if (result.error) return res.status(result.status).json({ success: false, message: result.error });
    return res.status(200).json(result);

  } catch (error) {
    console.error("[API Error] 找回档案失败:", error);
    return res.status(500).json({ success: false, message: "服务器网络连接异常，请稍后再试" });
  }
}