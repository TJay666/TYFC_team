"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Assuming Input component exists
import { Label } from '@/components/ui/label'; // Assuming Label component exists
import Link from 'next/link';
import Image from 'next/image';
import { registerUser } from '@/lib/auth-api'; // Import the registration API function

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call the backend registration API
      await registerUser({ username, email, password });
      // On successful registration, redirect to the login page
      alert('Registration successful! Please contact your administrator for account activation.'); // Optional: show a success message
      router.push('/login');
    } catch (err: any) {
      // Handle registration errors
      setError(err.message || 'Registration failed.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 p-4">
      {/* User needs to place taoyuan_universe_logo.png in public/images/ */}
      <Card className="w-full max-w-md shadow-2xl bg-background/80 backdrop-blur-md border-primary/50">
        <CardHeader className="text-center bg-gray-800 text-white">
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
          <CardTitle className="text-3xl font-bold text-white">帳號註冊</CardTitle>
          <CardDescription className="text-gray-300">感謝您有興趣加入 獵鷹宇宙！</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">使用者名稱</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="您的使用者名稱" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="您的電子郵件" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="您的密碼" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '註冊中...' : '註冊帳號'}
            </Button>
          </form>

          {/* Original message and login link */}
           <div className="space-y-4 text-center">
              <p className="text-card-foreground">
                目前帳號註冊採審核制。若您需要建立帳號，請聯繫您的球隊教練或系統管理員協助開通。
              </p>
              <p className="text-sm text-muted-foreground">
                審核通過後，您將會收到通知並可以使用分配的帳號登入。
              </p>
               <Link href="/login" passHref legacyBehavior>
                <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                   <a>返回登入頁面</a>
                 </Button>
              </Link>
          </div>

        </CardContent>
      </Card>
       <footer className="mt-8 text-center text-sm text-gray-300">
        <p>桃園獵鷹宇宙 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
