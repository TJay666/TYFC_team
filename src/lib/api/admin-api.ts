// src/lib/api/admin-api.ts
import { USER_ROLES, User } from '@/lib/types';
import { apiRequest, ApiResponse } from './api-config';

// 獲取所有使用者（僅供管理員使用）
export async function fetchUsers(token?: string): Promise<ApiResponse<User[]>> {
  const response = await apiRequest<any[]>('/api/users/users/', 'GET', undefined, token);
  
  if (response.data) {
    // 將後端返回的使用者資料映射到前端所需的格式
    const mappedUsers: User[] = response.data.map((item: any) => ({
      id: item.id.toString(),
      username: item.username,
      email: item.email,
      role: item.role as USER_ROLES,
      createdAt: item.date_joined || new Date().toISOString(),
      teamId: item.team_id || undefined
    }));
    
    return {
      data: mappedUsers,
      status: response.status,
      error: response.error
    };
  }
  
  return response as ApiResponse<User[]>;
}

// 更新使用者角色
export async function updateUserRole(userId: string, newRole: USER_ROLES, token?: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/users/${userId}/role/`, 'PATCH', { role: newRole }, token);
}

// 獲取當前登入使用者的詳細資訊
export async function fetchCurrentUser(token?: string): Promise<ApiResponse<User>> {
  const response = await apiRequest<any>('/api/users/me/', 'GET', undefined, token);
  
  if (response.data) {
    // 映射到前端所需的格式
    const userData: User = {
      id: response.data.id.toString(),
      username: response.data.username,
      email: response.data.email,
      role: response.data.role as USER_ROLES,
      createdAt: response.data.date_joined || new Date().toISOString(),
      teamId: response.data.team_id || undefined
    };
    
    return {
      data: userData,
      status: response.status,
      error: response.error
    };
  }
  
  return response as ApiResponse<User>;
}
