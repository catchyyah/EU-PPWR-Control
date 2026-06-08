import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PPWR/ESPR 규제 모니터링 시스템",
  description: "EU PPWR/ESPR 규제 정보 자동 수집 및 기술 로드맵 시각화",
  keywords: "PPWR, ESPR, 규제, 패키징, 로드맵",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-blue-600">📋</div>
                <h1 className="text-xl font-bold text-gray-900">
                  PPWR/ESPR 모니터링
                </h1>
              </div>
              <div className="flex gap-4">
                <a href="/" className="hover:text-blue-600">대시보드</a>
                <a href="/regulations" className="hover:text-blue-600">규제정보</a>
                <a href="/articles" className="hover:text-blue-600">조항분석</a>
                <a href="/roadmap" className="hover:text-blue-600">로드맵</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
            © 2025 PPWR/ESPR 모니터링 시스템
          </div>
        </footer>
      </body>
    </html>
  );
}
