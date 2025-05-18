// src/lib/api/auth-api.ts
import { apiRequest, ApiResponse } from './api-config';

export interface TokenObtainPairResponse {
  access: string;
  refresh: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

// 使用者註冊
export async function registerUser(data: RegisterData): Promise<ApiResponse<RegisterResponse>> {
  return apiRequest<RegisterResponse>('/api/users/register/', 'POST', data);
}

// 使用者登入
export async function loginUser(username: string, password: string): Promise<ApiResponse<TokenObtainPairResponse>> {
  return apiRequest<TokenObtainPairResponse>('/api/token/', 'POST', { username, password });
}

// 刷新令牌
export async function refreshToken(refreshToken: string): Promise<ApiResponse<{ access: string }>> {
  return apiRequest<{ access: string }>('/api/token/refresh/', 'POST', { refresh: refreshToken });
}

// 驗證令牌有效性
export async function verifyToken(token: string): Promise<ApiResponse<boolean>> {
  const response = await apiRequest<any>('/api/token/verify/', 'POST', { token });
  return {
    data: response.status === 200,
    error: response.error,
    status: response.status
  };
}
