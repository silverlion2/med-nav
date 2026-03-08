import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// --- 🛡️ 阶段一防撞库防护：IP 内存级限流字典 ---
const rateLimitMap = new Map();

// --- 🛡️ 阶段一隐私保护：与建档一致的 Hash 加密 ---
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
    // ==========================================
    // 🛡️ 1. 防爆破机制：防止黑客使用脚本疯狂猜 4 位专属码
    // ==========================================
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1分钟窗口期
    
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

    // ==========================================
    // 🛡️ 2. 参数校验与哈希比对
    // ==========================================
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ success: false, message: '手机号或专属码缺失' });

    // 核心步骤：将前端传来的明文手机号转化为 Hash 密文，再去数据库里捞人
    const secureHashedPhone = hashPhone(phone);

    const result = await withRetry(async () => {
      // 只能通过 Hash 密文去数据库查找用户
      const user = await prisma.user.findUnique({
        where: { phone: secureHashedPhone }
      });

      // 密码错误或找不到该用户
      if (!user || user.sessionId !== code) {
        return { error: '手机号或专属码不正确，请核对后重试', status: 400 };
      }

      // 找回该用户最新的一份评估记录
      const assessment = await prisma.assessment.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });

      if (!assessment) return { error: '未找到您的健康评估记录', status: 400 };
      
      // 找回成功，把当初填写的画像数据发回给前端还原
      return { success: true, profileData: assessment.profileJson };
    });

    if (result.error) return res.status(result.status).json({ success: false, message: result.error });
    return res.status(200).json(result);

  } catch (error) {
    console.error("[API Error] 找回档案失败:", error);
    return res.status(500).json({ success: false, message: "服务器网络连接异常，请稍后再试" });
  }
}