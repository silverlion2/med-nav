import { PrismaClient } from '@prisma/client'

// 使用单例模式，防止 Serverless 环境下数据库连接数爆满
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

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

    // 1. 去 User 表里核对手机号
    const user = await prisma.user.findUnique({
      where: { phone: phone }
    });

    // 核对专属码 (我们之前存在了 sessionId 字段里)
    if (!user || user.sessionId !== code) {
      return res.status(400).json({ success: false, message: '手机号或专属码不正确，请核对后重试' });
    }

    // 2. 凭 userId 去 Assessment 表里找他的问卷答案
    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' } // 如果有多条，拿最新的一次
    });

    if (!assessment) {
      return res.status(400).json({ success: false, message: '未找到您的健康评估记录，请重新测算' });
    }

    // 3. 找回成功，把当初填写的画像数据发回给前端
    return res.status(200).json({ 
      success: true, 
      profileData: assessment.profileJson 
    });

  } catch (error) {
    console.error("[API Error] 找回档案失败:", error);
    return res.status(500).json({ success: false, message: "服务器网络连接异常，请稍后再试" });
  }
}