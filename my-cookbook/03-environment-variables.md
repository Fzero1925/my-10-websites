# 03. 环境变量管理

## 目的
安全地管理API密钥和敏感配置。

## 本地开发
1. 创建 `.env.local` 文件
2. 添加变量：`VARIABLE_NAME=value`
3. 在代码中使用：`process.env.VARIABLE_NAME`

## Vercel部署
1. 在项目设置 → Environment Variables 中添加
2. 变量名和值需要与本地一致

## 安全规则
- ✅ 将 `.env.local` 添加到 `.gitignore`
- ✅ 在服务器端API路由中使用环境变量
- ❌ 不要在客户端组件中直接暴露环境变量

## 示例：OpenAI集成
```typescript
// 安全：在API路由中使用
const response = await fetch('https://api.openai.com/v1/...', {
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
});


**文件：`my-cookbook/04-api-integration.md`**

```markdown
# 04. 外部API集成模式

## 架构模式
前端 → Next.js API路由 → 外部API服务

## 步骤
1. 创建API路由文件：`src/app/api/endpoint/route.ts`
2. 实现服务器端逻辑
3. 前端通过fetch调用本地API路由

## 错误处理模板
```typescript
export async function POST(request: NextRequest) {
  try {
    // 业务逻辑
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '友好的错误信息' },
      { status: 500 }
    );
  }
}

前端调用模式
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: input }),
    });
    const result = await response.json();
    // 处理结果
  } catch (error) {
    // 处理错误
  } finally {
    setIsLoading(false);
  }
};