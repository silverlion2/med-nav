import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Quick debug: visit /api/generate-summary in browser to check env var status
  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      deepseek_key_set: !!process.env.DEEPSEEK_API_KEY,
      openai_key_set: !!process.env.OPENAI_API_KEY,
      deepseek_key_prefix: process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.substring(0, 5) + '...' : null,
      hint: 'If both are false, the env var is not configured for this environment (Production vs Preview).'
    }, null, 2), { headers: { 'Content-Type': 'application/json' } });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  // Support multiple providers: DeepSeek (preferred, cheaper) → OpenAI (fallback)
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  console.log(`[generate-summary] DeepSeek key present: ${!!deepseekKey}, OpenAI key present: ${!!openaiKey}`);

  if (!deepseekKey && !openaiKey) {
    // Graceful fallback: return a mock streamed summary if no key is configured
    const fallbackText = "（AI 摘要功能尚未激活。请在 Vercel 环境变量中配置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY 以启用智能分析。）当前显示的是基于规则引擎的确定性匹配结果。";
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fallbackText));
        controller.close();
      }
    });
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  try {
    const { matchedBenefits, profileSummary } = await req.json();

    // DeepSeek's API is OpenAI-compatible, so we reuse createOpenAI with a custom baseURL
    let provider, modelId;
    if (deepseekKey) {
      provider = createOpenAI({ apiKey: deepseekKey, baseURL: 'https://api.deepseek.com/v1' });
      modelId = 'deepseek-chat';  // DeepSeek-V3 (the latest, cheapest option)
    } else {
      provider = createOpenAI({ apiKey: openaiKey });
      modelId = 'gpt-4o-mini';
    }

    // Build a deterministic context string from the engine results
    const urgentList = (matchedBenefits?.urgent || []).join('、') || '无';
    const financialList = (matchedBenefits?.financial || []).join('、') || '无';
    const insuranceList = (matchedBenefits?.insurance || []).join('、') || '无';
    const healthList = (matchedBenefits?.health || []).join('、') || '无';
    const clarificationList = (matchedBenefits?.clarification || []).join('、') || '无';

    const systemPrompt = `你是一位专业且富有同理心的医保福利顾问AI助手「熊猫福利官」。你的任务是根据一个后端确定性规则引擎已经计算好的福利匹配结果，为用户撰写一段简短、温暖、专业的个性化总结摘要。

⚠️ 关键规则：
1. 你绝不能自己判断用户是否有资格获得福利。所有的福利匹配结果已经由后端的确定性JS引擎计算完毕。你只是一个翻译员和总结员。
2. 不要列举具体福利名称（如 "men_te"、"pap_a"），而是用用户能理解的自然语言描述。例如 "门慢/门特资质申请" 而不是 "men_te"。
3. 摘要应限制在3-5句话以内，语气温暖但不过度夸张。
4. 如果有「待确认」类福利 (clarification)，用鼓励性的语气提示用户补充信息。
5. 用中文回复。`;

    const userPrompt = `用户问卷快照：${JSON.stringify(profileSummary || {})}

引擎匹配结果摘要：
- 🚨 紧急红线福利 (必须在付款前申请): ${urgentList}
- 💰 资金兜底福利: ${financialList}
- 🛡️ 保险理赔福利: ${insuranceList}
- 💚 日常健康福利: ${healthList}
- ❓ 待确认福利 (需补充信息): ${clarificationList}

请基于以上信息，为该用户撰写一段个性化的分析总结。`;

    const result = streamText({
      model: provider(modelId),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 300,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('[API Error] Generate Summary Failed:', error);
    return new Response(
      JSON.stringify({ error: '生成AI摘要时出错，请稍后再试。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
