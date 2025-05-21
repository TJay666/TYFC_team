import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
// import { Toaster } from "@/components/ui/toaster"; // 註釋掉有問題的 Toaster
import { SimpleToaster } from "@/components/ui/simple-toaster"; // 使用我們的簡化版 Toaster
import { ToastProvider } from "@/hooks/use-simple-toast"; // 使用我們的簡化版 ToastProvider
import { AuthProvider } from '@/contexts/auth-context';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '桃園獵鷹宇宙足球管理系統',
  description: '桃園獵鷹宇宙足球隊的專業管理應用程序',
  metadataBase: new URL('http://localhost:9002'),
  keywords: ['足球', '桃園獵鷹', '球隊管理', '比賽排程', '統計數據'],
  authors: [{ name: '桃園獵鷹宇宙足球隊' }],
  openGraph: {
    title: '桃園獵鷹宇宙足球管理系統',
    description: '桃園獵鷹宇宙足球隊的專業管理應用程序',
    images: ['/images/taoyuan_universe_logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased flex flex-col min-h-screen`}>
        <ToastProvider>
          <AuthProvider>
            {children}
            <SimpleToaster />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
