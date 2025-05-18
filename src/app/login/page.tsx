
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

   // Render loading/redirect state if auth is loading or user is already authenticated
   if (authLoading || isAuthenticated) {
     return (
         <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 p-4">
             <p className="text-gray-400">載入中或重定向...</p>
         </div>
     );
   }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 p-4">
      <Card className="w-full max-w-md shadow-2xl bg-background/80 backdrop-blur-md border-primary/50">
        <CardHeader className="text-center bg-gray-800 text-card-foreground">
          <div className="mx-auto mb-6 w-32 h-32 relative">
            <Image
              src="/images/taoyuan_universe_logo.png" 
              alt="獵鷹 Logo"
              fill
              sizes="128px"
              className="rounded-full shadow-lg object-cover"
              data-ai-hint="football club logo"
              priority
            />
          </div>
          <CardTitle className="text-3xl font-bold text-white">獵鷹登入</CardTitle>
          <CardDescription className="text-gray-300">歡迎回來！請輸入您的帳號密碼。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4"> {/* Use handleLogin for form submission */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-card-foreground">使用者名稱</Label>
              <Input 
                id="username" 
                placeholder="請輸入您的帳號" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/70 border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-card-foreground">密碼</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="請輸入您的密碼" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/70 border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            {/* Single Login Button */}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base" disabled={isLoading}>
               {isLoading ? '登入中...' : '登入'}
            </Button>
          </form>

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <Link href="/register" legacyBehavior>
             <a className="text-sm text-primary hover:text-primary/80 hover:underline">
              還沒有帳號嗎？點此註冊
            </a>
          </Link>
           {/* Removed the demo login text */}
        </CardFooter>
      </Card>
       <footer className="mt-8 text-center text-sm text-gray-300">
        <p>桃園獵鷹宇宙 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
