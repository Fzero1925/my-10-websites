import { NextRequest, NextResponse } from 'next/server';

// 这是一个服务器端API路由，可以安全地使用环境变量
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // 调用OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的AI提示词工程师。用户给你一个简单的想法，你需要把它扩展成详细、生动、富有创意的AI绘画提示词。提示词应该包含场景描述、风格参考、细节要求等。'
          },
          {
            role: 'user',
            content: `请为以下想法生成一个专业的AI绘画提示词：${prompt}`
          }
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API请求失败');
    }

    const generatedText = data.choices[0]?.message?.content || '生成失败，请重试。';

    return NextResponse.json({ result: generatedText });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '生成提示词时出现错误，请稍后重试。' },
      { status: 500 }
    );
  }
}