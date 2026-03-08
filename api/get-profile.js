import { PrismaClient } from '@prisma/client'

// 使用单例模式，防止 Serverless 环境下数据库连接数爆满
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

/**
 * 带有指数退避的重试函数，专门应对 Serverless 冷启动和瞬时网络波动
 */
async function withRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isNetworkError = err.message?.includes('Can\'t reach database') || 
                             err.message?.includes('timed out') ||
                             err.code === 'P1001';
      
      if (isNetworkError && i < retries - 1) {
        // 等待 1s, 2s, 4s 后重试
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw err;
    }
  }
}

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '只支持 POST 请求' });
  }

  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ success: false, message: '手机号或专属码不能为空' });
    }

    // 将数据库查询操作包裹在重试机制中
    const result = await withRetry(async () => {
      // 1. 去 User 表里核对手机号
      const user = await prisma.user.findUnique({
        where: { phone: phone }
      });

      // 核对专属码 (我们之前存在了 sessionId 字段里)
      if (!user || user.sessionId !== code) {
        return { error: '手机号或专属码不正确，请核对后重试', status: 400 };
      }

      // 2. 凭 userId 去 Assessment 表里找他的问卷答案
      const assessment = await prisma.assessment.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' } // 如果有多条，拿最新的一次
      });

      if (!assessment) {
        return { error: '未找到您的健康评估记录，请重新测算', status: 400 };
      }

      return { success: true, profileData: assessment.profileJson };
    });

    // 如果内部业务逻辑报错（如密码错误），返回对应的错误码
    if (result.error) {
      return res.status(result.status).json({ success: false, message: result.error });
    }

    // 3. 找回成功，把当初填写的画像数据发回给前端
    return res.status(200).json(result);

  } catch (error) {
    console.error("[API Error] 找回档案失败:", error);
    // 在返回的数据中附带 debug 信息，如果前端依然报错，您可以按 F12 在 Network 里看到真实死因
    return res.status(500).json({ 
      success: false, 
      message: "服务器网络连接异常，请稍后再试",
      debug: error.message 
    });
  }
}