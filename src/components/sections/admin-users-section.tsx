'use client';

import React, { useEffect, useState } from 'react';
import { fetchUsers, updateUserRole } from '@/lib/admin-api';
import { User, USER_ROLES } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-simple-toast';

export default function AdminUsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const usersData = await fetchUsers();
      setUsers(usersData);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: USER_ROLES) => {    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      addToast({
        title: 'Success',
        message: `User role updated successfully.`,
        type: "success"
      });
    } catch (error) {
      console.error('Failed to update user role:', error);
      addToast({
        title: 'Error',
        message: 'Failed to update user role.',
        type: "error"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">
      <div className="inline-block bg-white p-6 rounded-lg shadow-md">
        <p className="text-[#1d3557] font-medium">載入使用者資料中...</p>
      </div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#457b9d]/20">
        <div className="bg-[#1d3557] text-white p-4">
          <h2 className="text-2xl font-bold">使用者管理</h2>
          <p className="text-[#f1faee]/80 text-sm mt-1">管理系統使用者權限</p>
        </div>
        <div className="p-4">
          <Table>
            <TableHeader className="bg-[#f1faee]">
              <TableRow>
                <TableHead className="text-[#1d3557] font-semibold">使用者名稱</TableHead>
                <TableHead className="text-[#1d3557] font-semibold">角色</TableHead>
                <TableHead className="text-[#1d3557] font-semibold text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-b border-[#e9ecef] hover:bg-[#f8f9fa]">
                  <TableCell className="font-medium text-[#1d3557]">{user.username}</TableCell>
                  <TableCell>
                    <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value as USER_ROLES)}>
                      <SelectTrigger className="w-[180px] border-[#457b9d]/30 focus:ring-[#457b9d]/20">
                        <SelectValue placeholder="選擇角色" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(USER_ROLES).map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Add more action buttons here if needed, e.g., delete user */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}