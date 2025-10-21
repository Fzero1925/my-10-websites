'use client';

import { useState } from 'react';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const generatePrompt = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: input,
          userId: isSignedIn ? user.id : 'anonymous' // 记录用户ID
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.result);
      } else {
        setOutput(`错误：${data.error}`);
      }
    } catch (error) {
      console.error('生成失败:', error);
      setOutput('网络错误，请检查连接后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('已复制到剪贴板！');
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* 导航栏 */}
      <nav className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">AI提示词生成器</h1>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <span className="text-sm text-gray-600">欢迎，{user.firstName || user.username}!</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => router.push('/history')}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    历史记录
                  </button>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                  登录 / 注册
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">专业AI提示词生成器</h2>
            <p className="text-lg text-gray-600">将你的简单想法转化为详细的AI绘画提示词</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="space-y-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例如：一只在太空站喝咖啡的猫"
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && generatePrompt()}
              />
              
              <button 
                onClick={generatePrompt}
                disabled={isLoading || !input.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </span>
                ) : '生成专业提示词'}
              </button>
            </div>

            {output && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">生成的提示词：</h3>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    复制
                  </button>
                </div>
                <div className="bg-white p-4 rounded border text-gray-800 whitespace-pre-wrap text-left">
                  {output}
                </div>
              </div>
            )}
          </div>

          <footer className="text-gray-500 text-sm">
            <p>✨ 已集成用户系统 - 你的应用越来越强大了！</p>
          </footer>
        </div>
      </div>
    </main>
  );
}