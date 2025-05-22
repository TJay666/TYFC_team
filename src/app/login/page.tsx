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
  };  // Render loading state if auth is loading
  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#2e1065] via-[#4338ca] to-[#312e81]">
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <p className="text-indigo-800 text-base font-medium">載入中...</p>
        </div>
      </div>
    );
  }
  
  // Render login form when not loading and not authenticated
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2e1065] via-[#4338ca] to-[#312e81]">
      <div className="w-full max-w-md px-4">
        <Card className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* 卡片頂部 - 深色背景 */}
          <CardHeader className="text-center bg-[#1e1b4b] p-6">
            {/* Logo 容器 */}
            <div className="mx-auto mb-4 bg-white p-3 rounded-full inline-block shadow-md">
              <Image
                src="/images/taoyuan_universe_logo.png"
                alt="獵鷹 Logo"
                width={100}
                height={100}
                className="rounded-full"
                priority
              />
            </div>
            
            {/* 標題文字 */}
            <CardTitle className="text-2xl font-bold text-white">獵鷹登入</CardTitle>
            <CardDescription className="text-slate-200 mt-2">歡迎回來！請輸入您的帳號密碼。</CardDescription>
          </CardHeader>
            <CardContent className="p-8">
            {/* 登入表單 */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium text-sm">使用者名稱</Label>
                <Input 
                  id="username" 
                  placeholder="請輸入您的帳號" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-md p-2.5 text-gray-800 placeholder:text-gray-400 w-full transition-colors"
                  name="username"
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium text-sm">密碼</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="請輸入您的密碼" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-md p-2.5 text-gray-800 placeholder:text-gray-400 w-full transition-colors"
                  name="password"
                  autoComplete="current-password"
                />
              </div>
              
              {/* 錯誤訊息 */}
              {error && (
                <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-md text-sm text-center">
                  {error}
                </div>
              )}
              
              {/* 登入按鈕 */}
              <Button 
                type="submit" 
                className="w-full bg-[#312e81] hover:bg-indigo-800 text-white font-medium py-2.5 rounded-md transition-colors mt-3 shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? '登入中...' : '登入'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6 pt-0">
            <Link href="/register" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
              還沒有帳號嗎？點此註冊
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
