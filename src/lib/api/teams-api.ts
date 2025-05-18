// src/lib/api/teams-api.ts
import { Team } from '@/lib/types';
import { apiRequest, ApiResponse } from './api-config';

// 獲取所有球隊
export async function fetchTeams(token?: string): Promise<ApiResponse<Team[]>> {
  return apiRequest<Team[]>('/api/teams/teams/', 'GET', undefined, token);
}

// 獲取單個球隊
export async function fetchTeam(teamId: string, token?: string): Promise<ApiResponse<Team>> {
  return apiRequest<Team>(`/api/teams/teams/${teamId}/`, 'GET', undefined, token);
}

// 建立新球隊
export async function createTeam(teamData: Partial<Team>, token?: string): Promise<ApiResponse<Team>> {
  return apiRequest<Team>('/api/teams/teams/', 'POST', teamData, token);
}

// 更新球隊
export async function updateTeam(teamId: string, teamData: Partial<Team>, token?: string): Promise<ApiResponse<Team>> {
  return apiRequest<Team>(`/api/teams/teams/${teamId}/`, 'PUT', teamData, token);
}

// 刪除球隊
export async function deleteTeam(teamId: string, token?: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/teams/teams/${teamId}/`, 'DELETE', undefined, token);
}
