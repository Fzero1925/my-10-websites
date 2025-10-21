import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI提示词生成器',
  description: '将你的想法转化为专业AI绘画提示词',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="zh">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}