// import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const hasDatabase = !!process.env.DATABASE_URL;
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

// --- 🛡️ 隐私保护：必须与建档接口保持完全一致的 Hash 加密算法 ---
function hashPhone(phone) {
  const salt = "med-nav-secure-salt-2024";
  return crypto.createHash('sha256').update(phone + salt).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    const { userId, feedbackData } = req.body;

    // 如果前端传来了用户的明文手机号 (userId)
    if (userId && userId !== 'anonymous-user') {
      
      // 🛡️ 立刻将其转换为 Hash 密文，再去数据库查询
      const secureHashedPhone = hashPhone(userId);
      
      // 用 Hash 密文去找对应的真实用户
      const user = await prisma.user.findUnique({
        where: { phone: secureHashedPhone }
      });

      if (user) {
        // 找到该用户最新的一次测算记录，因为点击动作发生在这份报告里
        const latestAssessment = await prisma.assessment.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        });

        if (latestAssessment) {
          // 合并旧的点击记录与新的点击记录 (例如: {"ins_huimin": "不感兴趣", "pap_a": "准备申请"})
          const existingFeedback = latestAssessment.intentionFeedback || {};
          const updatedFeedback = { ...existingFeedback, [feedbackData.benefitId]: feedbackData };
          
          // 更新存入数据库
          await prisma.assessment.update({
            where: { id: latestAssessment.id },
            data: { intentionFeedback: updatedFeedback }
          });
          
          return res.status(200).json({ success: true, message: "Feedback updated successfully" });
        }
      }
    }

    // 如果是尚未建档的匿名用户，或者找不到用户，直接返回成功，绝不阻断前端的流畅交互
    return res.status(200).json({ success: true, message: "Ignored or processed anonymously" });
    
  } catch (error) {
    console.error("[API Error] 保存反馈埋点失败:", error);
    return res.status(500).json({ success: false, message: "内部错误" });
  }
}