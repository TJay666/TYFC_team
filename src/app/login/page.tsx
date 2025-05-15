
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
import { USER_ROLES } from '@/lib/types';

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/'); // Redirect to main app page if already authenticated
    }
  }, [isAuthenticated, authLoading, router]);

  const handlePlayerLogin = () => {
    // In a real app, you'd validate username/password
    login(USER_ROLES.PLAYER, username || '球員A');
  };

  const handleCoachLogin = () => {
    // In a real app, you'd validate username/password
    login(USER_ROLES.COACH, username || '教練B');
  };

  if (authLoading || isAuthenticated) {
     // Show loading or null if already authenticated and redirecting
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <p className="text-muted-foreground">載入中或重定向...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6">
            <Image
              src="https://placehold.co/150x150.png" // Replace with your actual logo path e.g., /images/logo.png
              alt="TeamTactics Logo"
              width={120}
              height={120}
              className="rounded-full shadow-lg"
              data-ai-hint="football club logo"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">TeamTactics 登入</CardTitle>
          <CardDescription className="text-muted-foreground">歡迎回來！請選擇您的登入身份。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">使用者名稱 (選填)</Label>
            <Input 
              id="username" 
              placeholder="請輸入您的帳號" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密碼 (選填)</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="請輸入您的密碼" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button onClick={handlePlayerLogin} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-3 text-base">
              球員登入
            </Button>
            <Button onClick={handleCoachLogin} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base">
              教練登入
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link href="/register" legacyBehavior>
            <a className="text-sm text-primary hover:text-primary/80 hover:underline">
              還沒有帳號嗎？點此註冊
            </a>
          </Link>
           <p className="text-xs text-muted-foreground text-center px-4">
            注意：此為模擬登入系統。輸入的帳號密碼僅供演示，不會進行真實驗證。
          </p>
        </CardFooter>
      </Card>
       <footer className="mt-8 text-center text-sm text-foreground/70">
        <p>桃園獵鷹宇宙 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
