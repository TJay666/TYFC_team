// src/lib/api/leagues-api.ts
import { League } from '@/lib/types';
import { apiRequest, ApiResponse } from './api-config';

// 獲取所有聯賽
export async function fetchLeagues(token?: string): Promise<ApiResponse<League[]>> {
  return apiRequest<League[]>('/api/leagues/leagues/', 'GET', undefined, token);
}

// 獲取單個聯賽
export async function fetchLeague(leagueId: string, token?: string): Promise<ApiResponse<League>> {
  return apiRequest<League>(`/api/leagues/leagues/${leagueId}/`, 'GET', undefined, token);
}

// 建立新聯賽
export async function createLeague(leagueData: Partial<League>, token?: string): Promise<ApiResponse<League>> {
  return apiRequest<League>('/api/leagues/leagues/', 'POST', leagueData, token);
}

// 更新聯賽
export async function updateLeague(leagueId: string, leagueData: Partial<League>, token?: string): Promise<ApiResponse<League>> {
  return apiRequest<League>(`/api/leagues/leagues/${leagueId}/`, 'PUT', leagueData, token);
}

// 刪除聯賽
export async function deleteLeague(leagueId: string, token?: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/leagues/leagues/${leagueId}/`, 'DELETE', undefined, token);
}
