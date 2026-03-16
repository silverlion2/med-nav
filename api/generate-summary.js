import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const config = {
  runtime: 'edge',
  maxDuration: 20, // 20 second max for Edge function
};

export default async function handler(req) {
  // Quick debug: visit /api/generate-summary in browser to check env var status
  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      deepseek_key_set: !!process.env.DEEPSEEK_API_KEY,
      openai_key_set: !!process.env.OPENAI_API_KEY,
      deepseek_key_prefix: process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.substring(0, 5) + '...' : null,
    }, null, 2), { headers: { 'Content-Type': 'application/json' } });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!deepseekKey && !openaiKey) {
    return new Response(
      "（AI 摘要功能尚未激活。请在 Vercel 环境变量中配置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY。）",
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  try {
    const { matchedBenefits, profileSummary } = await req.json();

    let provider, modelId, providerName;
    if (deepseekKey) {
      // DeepSeek uses OpenAI-compatible format
      provider = createOpenAI({
        apiKey: deepseekKey,
        baseURL: 'https://api.deepseek.com/v1',
      });
      modelId = 'deepseek-chat';
      providerName = 'DeepSeek';
    } else {
      provider = createOpenAI({ apiKey: openaiKey });
      modelId = 'gpt-4o-mini';
      providerName = 'OpenAI';
    }

    console.log(`[generate-summary] Using ${providerName} / ${modelId}`);

    const urgentList = (matchedBenefits?.urgent || []).join('、') || '无';
    const financialList = (matchedBenefits?.financial || []).join('、') || '无';
    const insuranceList = (matchedBenefits?.insurance || []).join('、') || '无';
    const healthList = (matchedBenefits?.health || []).join('、') || '无';
    const clarificationList = (matchedBenefits?.clarification || []).join('、') || '无';

    const systemPrompt = `你是一位专业且富有同理心的医保福利顾问AI助手「熊猫福利官」。根据后端规则引擎已计算好的福利匹配结果，为用户撰写简短、温暖的个性化总结。规则：1.不要自己判断资格 2.用自然语言描述福利而非代码ID 3.限制3-5句话 4.如有待确认福利则鼓励补充信息 5.中文回复。`;

    const userPrompt = `问卷：${JSON.stringify(profileSummary || {})}
结果：紧急:${urgentList} | 资金:${financialList} | 保险:${insuranceList} | 健康:${healthList} | 待确认:${clarificationList}
请撰写个性化总结。`;

    // Use non-streaming generateText for reliability; stream later once confirmed working
    const result = await generateText({
      model: provider(modelId),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 200,
      temperature: 0.7,
    });

    console.log(`[generate-summary] Success! Got ${result.text.length} chars`);

    return new Response(result.text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    // Return the ACTUAL error so we can debug
    console.error('[generate-summary] ERROR:', error.message, error.cause || '');
    const errorMsg = `（AI 生成失败: ${error.message}）系统将使用规则引擎结果。`;
    return new Response(errorMsg, {
      status: 200, // Return 200 so frontend displays it instead of falling back silently
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
