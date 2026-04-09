import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '뉴스 AI 분석 서비스 - 실시간 핫이슈',
  description: '네이버 뉴스 기반 AI 실시간 분석 서비스. 키워드 추출, 감정 분석, 마인드맵, 트렌드 인사이트 제공.',
  keywords: ['뉴스', '뉴스 분석', 'AI', '실시간 뉴스', '트렌드'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
