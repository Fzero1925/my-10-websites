import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 创建服务端Supabase客户端
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId } = await request.json();

    let generatedText: string;
    let isMock = true; // 默认使用模拟数据

    // 如果没有配置OpenAI API密钥或想使用模拟数据，返回模拟数据
    if (!process.env.OPENAI_API_KEY) {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPrompts = [
        `专业提示词：在一个宁静的湖畔，${prompt}静静地伫立，水面倒映着绚丽的晚霞，细节丰富，4K画质，电影级光影`,
        `创意描述：${prompt}置身于未来都市，霓虹灯光交织，赛博朋克风格，充满科技感和神秘氛围，超现实主义`,
        `艺术构想：${prompt}在梦幻的森林中，散发着柔和的光芒，童话风格，细腻的笔触，充满魔幻色彩`,
        `详细场景：${prompt}位于古典城堡内，烛光摇曳，哥特式建筑，精细的纹理和阴影，油画质感`
      ];
      
      generatedText = mockPrompts[Math.floor(Math.random() * mockPrompts.length)];
    } else {
      // 真实 OpenAI API 调用
      try {
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

        generatedText = data.choices[0]?.message?.content || '生成失败，请重试。';
        isMock = false;
      } catch (apiError) {
        console.error('OpenAI API Error:', apiError);
        // API 调用失败时回退到模拟数据
        const fallbackPrompts = [
          `备用提示词：${prompt}在优美的自然风光中，阳光明媚，色彩鲜艳，超高画质`,
          `备用描述：${prompt}呈现出令人惊叹的视觉效果，细节精致，氛围感强烈`
        ];
        generatedText = fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
      }
    }

    // 保存到数据库（无论登录与否都保存，但关联用户ID）
    try {
      const { error: dbError } = await supabaseAdmin
        .from('prompt_history')
        .insert({
          user_id: userId || 'anonymous',
          user_input: prompt,
          generated_prompt: generatedText,
          is_mock: isMock
        });

      if (dbError) {
        console.error('Database Error:', dbError);
        // 不因为数据库错误而让整个请求失败
      }

      return NextResponse.json({ 
        result: generatedText, 
        mock: isMock,
        saved: !dbError 
      });
    } catch (dbError) {
      console.error('Database Operation Failed:', dbError);
      // 即使数据库操作失败，也返回生成的结果
      return NextResponse.json({ 
        result: generatedText, 
        mock: isMock,
        saved: false 
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '生成提示词时出现错误，请稍后重试。' },
      { status: 500 }
    );
  }
}