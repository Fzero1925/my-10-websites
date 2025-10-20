export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">我的AI提示词工具</h1>
      <p className="text-xl mb-8">这是我的第一个工具站！它虽然简陋，但它上线了！</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        马上就能生成提示词
      </button>
    </main>
  );
}