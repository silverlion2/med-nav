import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, feedbackData } = req.body;
    // 将用户的反馈数据存入 Assessment 表
    const result = await prisma.assessment.create({
      data: {
        userId: userId,
        profileJson: {}, 
        intentionFeedback: feedbackData 
      }
    });
    res.status(200).json({ success: true, data: result });
  }
}

