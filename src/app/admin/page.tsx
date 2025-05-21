'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { USER_ROLES } from '@/lib/types';
import AdminUsersSection from '@/components/sections/admin-users-section';

export default function AdminPage() {
  const { isAuthenticated, currentUserRole, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || currentUserRole !== USER_ROLES.ADMIN)) {
      router.push('/'); // Redirect to homepage or a forbidden page
    }
  }, [isAuthenticated, currentUserRole, loading, router]);
  if (loading || !isAuthenticated || currentUserRole !== USER_ROLES.ADMIN) {    // Optionally show a loading spinner or a message before redirecting
    return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1d3557] via-[#457b9d] to-[#1d3557] login-page-gradient">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-[#1d3557] font-medium">載入中...</p>
      </div>
    </div>;
  }
  return (
    <div className="min-h-screen bg-[#f1faee] py-8">
      <AdminUsersSection />
    </div>
  );
}