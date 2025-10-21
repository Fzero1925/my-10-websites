import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 创建服务端Supabase客户端
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 使用服务端密钥
);

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId } = await request.json();

    // ... 原有的生成逻辑（模拟或真实API）...

    let generatedText: string;
    let isMock = false;

    // 模拟数据逻辑
    if (!process.env.OPENAI_API_KEY) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPrompts = [
        `专业提示词：在一个宁静的湖畔，${prompt}静静地伫立，水面倒映着绚丽的晚霞，细节丰富，4K画质，电影级光影`,
        `创意描述：${prompt}置身于未来都市，霓虹灯光交织，赛博朋克风格，充满科技感和神秘氛围，超现实主义`,
        `艺术构想：${prompt}在梦幻的森林中，散发着柔和的光芒，童话风格，细腻的笔触，充满魔幻色彩`
      ];
      generatedText = mockPrompts[Math.floor(Math.random() * mockPrompts.length)];
      isMock = true;
    } else {
      // 原有的真实API调用...
      // generatedText = ... (保持原有逻辑)
      // isMock = false;
    }

    // 保存到数据库（无论登录与否都保存，但关联用户ID）
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

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '生成提示词时出现错误，请稍后重试。' },
      { status: 500 }
    );
  }
}