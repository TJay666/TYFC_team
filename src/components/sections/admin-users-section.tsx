'use client';

import React, { useEffect, useState } from 'react';
import { fetchUsers, updateUserRole } from '@/lib/admin-api';
import { User, USER_ROLES } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const usersData = await fetchUsers();
      setUsers(usersData);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: USER_ROLES) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      toast({
        title: 'Success',
        description: `User role updated successfully.`, 
      });
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading users...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>
                <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value as USER_ROLES)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
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
  );
}