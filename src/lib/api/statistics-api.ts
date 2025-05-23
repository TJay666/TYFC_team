// src/lib/api/statistics-api.ts
import { PlayerMatchStats } from '@/lib/types';
import { apiRequest, ApiResponse } from './api-config';

// 定義統計資料接口
export interface MatchStatistics {
  [playerId: string]: PlayerMatchStats;
}

// 獲取比賽統計資料
export async function fetchMatchStatistics(matchId: string, token?: string): Promise<ApiResponse<MatchStatistics>> {
  return apiRequest<MatchStatistics>(`/api/match-statistics/statistics/${matchId}/`, 'GET', undefined, token);
}

// 獲取球員統計資料
export async function fetchPlayerStatistics(playerId: string, token?: string): Promise<ApiResponse<PlayerMatchStats[]>> {
  return apiRequest<PlayerMatchStats[]>(`/api/match-statistics/statistics/?player=${playerId}`, 'GET', undefined, token);
}

// 獲取指定比賽內特定球員的統計資料
export async function fetchPlayerMatchStatistics(
  matchId: string,
  playerId: string,
  token?: string
): Promise<ApiResponse<PlayerMatchStats>> {
  return apiRequest<PlayerMatchStats>(
    `/api/match-statistics/statistics/${matchId}/player/${playerId}/`,
    'GET',
    undefined,
    token
  );
}

// 更新球員比賽統計資料
export async function updatePlayerStatistics(
  matchId: string,
  playerId: string,
  statistics: Partial<PlayerMatchStats>,
  token?: string
): Promise<ApiResponse<PlayerMatchStats>> {
  return apiRequest<PlayerMatchStats>(
    `/api/match-statistics/statistics/${matchId}/player/${playerId}/`,
    'PUT',
    statistics,
    token
  );
}

// 批量更新比賽統計資料
export async function bulkUpdateMatchStatistics(
  matchId: string,
  statisticsData: Record<string, Partial<PlayerMatchStats>>,
  token?: string
): Promise<ApiResponse<MatchStatistics>> {
  return apiRequest<MatchStatistics>(
    `/api/match-statistics/statistics/${matchId}/bulk-update/`,
    'POST',
    { player_statistics: statisticsData },
    token
  );
}

// 獲取球員團隊統計資料
export async function fetchTeamStatistics(token?: string): Promise<ApiResponse<any>> {
  return apiRequest<any>('/api/match-statistics/statistics/team-stats/', 'GET', undefined, token);
}

// 獲取聯賽統計資料
export async function fetchLeagueStatistics(leagueId: string, token?: string): Promise<ApiResponse<any>> {
  return apiRequest<any>(`/api/match-statistics/statistics/league-stats/${leagueId}/`, 'GET', undefined, token);
}
