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

    const urgentList = (matchedBenefits?.urgent || []).join('、') || '无';
    const financialList = (matchedBenefits?.financial || []).join('、') || '无';
    const insuranceList = (matchedBenefits?.insurance || []).join('、') || '无';
    const healthList = (matchedBenefits?.health || []).join('、') || '无';
    const clarificationList = (matchedBenefits?.clarification || [])
      .map(item => typeof item === 'object' ? item.benefit?.title : item)
      .join('、') || '无';

    const systemPrompt = `你是一位专业且富有同理心的医保福利顾问AI助手「熊猫福利官」。根据后端规则引擎已计算好的福利匹配结果，为用户撰写简短、温暖的个性化总结。规则：1.不要自己判断资格 2.用自然语言描述福利而非代码ID 3.限制3-5句话 4.如有待确认福利则鼓励补充信息 5.中文回复。`;

    const userPrompt = `问卷：${JSON.stringify(profileSummary || {})}
结果：紧急:${urgentList} | 资金:${financialList} | 保险:${insuranceList} | 健康:${healthList} | 待确认:${clarificationList}
请撰写个性化总结。`;

    let resultText = "";

    if (deepseekKey) {
      console.log(`[generate-summary] Using DeepSeek directly via fetch`);
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      resultText = data.choices[0]?.message?.content || "";
    } else {
      console.log(`[generate-summary] Using OpenAI via AI SDK`);
      const provider = createOpenAI({ apiKey: openaiKey });
      const result = await generateText({
        model: provider('gpt-4o-mini'),
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 200,
        temperature: 0.7,
      });
      resultText = result.text;
    }

    console.log(`[generate-summary] Success! Got ${resultText.length} chars`);

    return new Response(resultText, {
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
