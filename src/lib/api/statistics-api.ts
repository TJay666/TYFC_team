// src/lib/api/statistics-api.ts
import { MatchStatistics, PlayerStats } from '@/lib/types';
import { apiRequest, ApiResponse } from './api-config';

// 獲取比賽統計數據
export async function fetchMatchStatistics(matchId: string, token?: string): Promise<ApiResponse<MatchStatistics>> {
  return apiRequest<MatchStatistics>(`/api/match_statistics/statistics/${matchId}/`, 'GET', undefined, token);
}

// 獲取球員統計數據
export async function fetchPlayerStatistics(playerId: string, token?: string): Promise<ApiResponse<PlayerStats[]>> {
  return apiRequest<PlayerStats[]>(`/api/match_statistics/player-stats/${playerId}/`, 'GET', undefined, token);
}

// 獲取特定比賽中某球員的統計數據
export async function fetchPlayerMatchStatistics(
  matchId: string,
  playerId: string,
  token?: string
): Promise<ApiResponse<PlayerStats>> {
  return apiRequest<PlayerStats>(
    `/api/match_statistics/statistics/${matchId}/player/${playerId}/`,
    'GET',
    undefined,
    token
  );
}

// 更新球員比賽統計數據
export async function updatePlayerStatistics(
  matchId: string,
  playerId: string,
  statistics: Partial<PlayerStats>,
  token?: string
): Promise<ApiResponse<PlayerStats>> {
  return apiRequest<PlayerStats>(
    `/api/match_statistics/statistics/${matchId}/player/${playerId}/`,
    'PUT',
    statistics,
    token
  );
}

// 批次更新比賽統計數據
export async function bulkUpdateMatchStatistics(
  matchId: string,
  statisticsData: Record<string, Partial<PlayerStats>>,
  token?: string
): Promise<ApiResponse<MatchStatistics>> {
  return apiRequest<MatchStatistics>(
    `/api/match_statistics/statistics/${matchId}/bulk-update/`,
    'POST',
    { player_statistics: statisticsData },
    token
  );
}

// 獲取球隊整體統計數據
export async function fetchTeamStatistics(token?: string): Promise<ApiResponse<any>> {
  return apiRequest<any>('/api/match_statistics/team-stats/', 'GET', undefined, token);
}

// 獲取聯賽統計數據
export async function fetchLeagueStatistics(leagueId: string, token?: string): Promise<ApiResponse<any>> {
  return apiRequest<any>(`/api/match_statistics/league-stats/${leagueId}/`, 'GET', undefined, token);
}
