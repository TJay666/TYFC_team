
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
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
          <CardTitle className="text-3xl font-bold text-primary">帳號註冊</CardTitle>
          <CardDescription className="text-muted-foreground">感謝您有興趣加入 TeamTactics！</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-foreground">
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
        </CardContent>
      </Card>
       <footer className="mt-8 text-center text-sm text-foreground/70">
        <p>桃園獵鷹宇宙 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
