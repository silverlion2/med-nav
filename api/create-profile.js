import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { phone, code, profileData } = req.body;

    // 🚀 使用 Prisma 的 upsert (存在则更新，不存在则创建)
    const user = await prisma.user.upsert({
      where: { phone: phone },
      update: { sessionId: code }, // 将专属码存入 sessionId
      create: {
        phone: phone,
        sessionId: code
      },
    });

    // 为该用户创建一条评估记录
    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        profileJson: profileData,
        matchedBenefitsIds: [] // 后期可根据算法填入
      }
    });

    return res.status(200).json({ success: true, userId: user.id, assessmentId: assessment.id });
  } catch (error) {
    console.error("建档失败:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}