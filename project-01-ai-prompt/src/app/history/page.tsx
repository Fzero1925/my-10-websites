'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PromptHistory {
  id: string;
  user_input: string;
  generated_prompt: string;
  created_at: string;
  is_mock: boolean;
}

export default function HistoryPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (isSignedIn) {
      fetchHistory();
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      
      if (response.ok) {
        setHistory(data.history);
      } else {
        console.error('Failed to fetch history:', data.error);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板！');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 导航栏 */}
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">生成历史</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            返回生成器
          </button>
        </nav>

        {/* 历史记录列表 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无生成记录</h3>
              <p className="text-gray-500">开始使用提示词生成器来创建你的第一个提示词吧！</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">
                  共 {history.length} 条生成记录
                </h2>
                <button 
                  onClick={fetchHistory}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  刷新
                </button>
              </div>
              
              {history.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">输入：</span>
                        <span className="text-gray-800 bg-gray-100 px-2 py-1 rounded text-sm">
                          {item.user_input}
                        </span>
                        {item.is_mock && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            模拟数据
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        生成于 {formatDate(item.created_at)}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.generated_prompt)}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm ml-4"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      复制
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border text-gray-700 whitespace-pre-wrap">
                    {item.generated_prompt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}