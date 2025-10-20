'use client'; // 需要在客户端使用状态

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const generatePrompt = () => {
    // 模拟调用AI API - 这是最简单的实现
    const generated = `专业提示词：请创作一个关于"${input}"的详细、生动的描述，包含丰富的细节和氛围感。`;
    setOutput(generated);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('已复制到剪贴板！');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">我的AI提示词工具</h1>
      
      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你的想法，比如：'森林中的魔法城堡'"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        
        <button 
          onClick={generatePrompt}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
        >
          生成专业提示词
        </button>

        {output && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">生成的提示词：</p>
            <p className="mb-3 whitespace-pre-wrap">{output}</p>
            <button 
              onClick={copyToClipboard}
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm"
            >
              复制提示词
            </button>
          </div>
        )}
      </div>

      <footer className="mt-12 text-gray-500">
        <p>这是我的第一个工具站！它已经具备了核心功能。</p>
      </footer>
    </main>
  );
}