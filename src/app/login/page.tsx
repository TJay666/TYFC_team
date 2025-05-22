"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect authenticated users to the homepage
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 使用 auth context 的 login 函數，現在它直接處理 API 請求
      const success = await login(username, password);
      if (!success) {
        setError('登入失敗，請檢查使用者名稱和密碼。');
      }
      // 如果成功，auth context 將自動重定向到首頁
    } catch (err: any) {
      setError(err instanceof Error ? err.message : '登入失敗，請稍後再試。');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state if auth is loading
  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1d3557] via-[#457b9d] to-[#1d3557] p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg animate-pulse">
          <p className="text-[#1d3557] text-lg font-medium">載入中...</p>
        </div>
      </div>
    );
  }

  // Render login form when not loading and not authenticated
  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      {/* 背景設計 */}      <div className="absolute inset-0 bg-gradient-to-br from-[#1d3557] via-[#457b9d] to-[#1d3557] login-page-gradient overflow-hidden">
        {/* 背景裝飾紋理 */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}></div>
        
        {/* 添加漂浮裝飾元素 */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#a8dadc]/10 rounded-full blur-xl" style={{ animation: 'float 8s infinite ease-in-out' }}></div>
        <div className="absolute bottom-1/3 right-1/5 w-40 h-40 bg-[#f1faee]/10 rounded-full blur-xl" style={{ animation: 'float 6s infinite ease-in-out 1s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-24 h-24 bg-[#e63946]/5 rounded-full blur-xl" style={{ animation: 'float 10s infinite ease-in-out 2s' }}></div>
      </div>
        {/* 卡片容器 - 添加立體陰影和玻璃效果 */}
      <div className="relative z-10 w-full max-w-md px-4 transform transition-all duration-500 animate-fadeIn">
        <Card className="w-full shadow-2xl bg-white/95 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 login-card">
          {/* 卡片頂部 - 立體化設計 */}
          <CardHeader className="text-center bg-[#1d3557] p-8 login-header relative overflow-hidden">
            {/* 頂部裝飾圓形 */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#457b9d]/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#a8dadc]/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-xl"></div>
              {/* Logo 容器 - 更現代的設計 */}
            <div className="mx-auto mb-6 bg-white p-3 rounded-full inline-flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300" style={{ animation: 'pulse 3s infinite ease-in-out' }}>
              <div className="bg-gradient-to-br from-[#1d3557] to-[#457b9d] p-0.5 rounded-full relative overflow-hidden">
                {/* 閃光效果 */}
                <div className="absolute -inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full animate-[shimmer_2.5s_infinite]" style={{ animation: 'shimmer 2.5s infinite' }}></div>
                <Image
                  src="/images/taoyuan_universe_logo.png"
                  alt="獵鷹 Logo"
                  width={110}
                  height={110}
                  className="rounded-full shadow-inner object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* 標題文字 - 增加間距和字體效果 */}
            <CardTitle className="text-3xl font-bold text-white tracking-wider drop-shadow-md mb-2">獵鷹登入</CardTitle>
            <CardDescription className="text-[#f1faee] mt-2 text-base font-medium opacity-90">歡迎回來！請輸入您的帳號密碼。</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 p-8 pt-6">
            {/* 登入表單 - 增強輸入框和間距 */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#1d3557] font-medium text-base">使用者名稱</Label>
                <div className="relative">
                  <Input 
                    id="username" 
                    placeholder="請輸入您的帳號" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/70 border-2 border-[#457b9d]/30 focus:border-[#457b9d] focus:ring-2 focus:ring-[#457b9d]/30 rounded-lg p-3 pl-4 text-[#1d3557] placeholder:text-[#457b9d]/50 login-input transition-all duration-300 hover:border-[#457b9d]/50"
                    name="username"
                    autoComplete="username"
                  />
                  <svg 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#457b9d]/70" 
                    width="18" height="18" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1d3557] font-medium text-base">密碼</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="請輸入您的密碼" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/70 border-2 border-[#457b9d]/30 focus:border-[#457b9d] focus:ring-2 focus:ring-[#457b9d]/30 rounded-lg p-3 pl-4 text-[#1d3557] placeholder:text-[#457b9d]/50 login-input transition-all duration-300 hover:border-[#457b9d]/50"
                    name="password"
                    autoComplete="current-password"
                  />
                  <svg 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#457b9d]/70" 
                    width="18" height="18" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
                {/* 錯誤訊息 - 改進顯示方式 */}
              {error && (
                <div className="bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/20 p-3 rounded-lg text-sm text-center font-medium animate-fadeIn">
                  <svg 
                    className="inline-block mr-1 mb-0.5" 
                    width="16" height="16" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {error}
                </div>
              )}
                {/* 更現代化按鈕設計 */}
              <Button 
                type="submit" 
                className="relative w-full bg-gradient-to-r from-[#1d3557] to-[#457b9d] hover:from-[#457b9d] hover:to-[#1d3557] text-white font-semibold py-3.5 text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 login-button mt-2 overflow-hidden group"
                disabled={isLoading}
              >
                {/* 按鈕漣漪效果 */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out]" style={{ animation: isLoading ? 'none' : '' }}></span>
                
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    登入中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg 
                      className="inline-block mr-2 h-5 w-5" 
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3" />
                    </svg>
                    登入
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center space-y-2 pb-6 pt-0">
            <Link href="/register" className="text-sm text-[#457b9d] hover:text-[#1d3557] hover:underline transition-colors duration-200 font-medium flex items-center gap-1">
              <svg 
                width="16" height="16" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              還沒有帳號嗎？點此註冊
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      {/* 頁尾 - 增強設計 */}
      <footer className="mt-8 text-center text-sm text-white/90 relative z-10">
        <p className="drop-shadow-md font-medium">TJay &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
