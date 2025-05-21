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
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-[#1d3557] text-lg font-medium">載入中...</p>
        </div>
      </div>
    );
  }  // Render login form when not loading and not authenticated
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1d3557] via-[#457b9d] to-[#1d3557] p-4 login-page-gradient">
      <Card className="w-full max-w-md shadow-2xl bg-white rounded-lg overflow-hidden border-2 border-[#457b9d]/20 login-card">
        <CardHeader className="text-center bg-[#1d3557] p-6 login-header">
          <div className="mx-auto mb-4 bg-white p-2 rounded-full inline-block">
            <Image
              src="/images/taoyuan_universe_logo.png"
              alt="獵鷹 Logo"
              width={120}
              height={120}
              className="rounded-full shadow-md object-cover"
              priority
            />
          </div>
          <CardTitle className="text-3xl font-bold text-white">獵鷹登入</CardTitle>
          <CardDescription className="text-[#f1faee]/90 mt-2">歡迎回來！請輸入您的帳號密碼。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5"> {/* Use handleLogin for form submission */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#1d3557] font-medium">使用者名稱</Label>              <Input 
                id="username" 
                placeholder="請輸入您的帳號" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white border-2 border-[#457b9d]/50 focus:border-[#457b9d] focus:ring-2 focus:ring-[#457b9d]/30 rounded-md p-2.5 text-[#1d3557] placeholder:text-[#457b9d]/50 login-input"
                name="username"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1d3557] font-medium">密碼</Label>              <Input 
                id="password" 
                type="password" 
                placeholder="請輸入您的密碼" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-2 border-[#457b9d]/50 focus:border-[#457b9d] focus:ring-2 focus:ring-[#457b9d]/30 rounded-md p-2.5 text-[#1d3557] placeholder:text-[#457b9d]/50 login-input"
                name="password"
                autoComplete="current-password"
              />
            </div>            {error && <p className="text-[#e63946] text-sm text-center font-medium">{error}</p>}
            
            {/* Single Login Button */}            <Button type="submit" className="w-full bg-[#1d3557] hover:bg-[#457b9d] text-white font-semibold py-3 text-base rounded-md transition-colors duration-300 shadow-md login-button" disabled={isLoading}>
               {isLoading ? '登入中...' : '登入'}
            </Button>
          </form>

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pb-5 pt-0">
           <Link href="/register" legacyBehavior>
             <a className="text-sm text-[#457b9d] hover:text-[#1d3557] hover:underline transition-colors duration-200 font-medium">
              還沒有帳號嗎？點此註冊
            </a>
          </Link>
           {/* Removed the demo login text */}
        </CardFooter>
      </Card>
      <footer className="mt-8 text-center text-sm text-white/80">
        <p>TJay &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
