// src/lib/api/matches-api.ts
import { Match, PlayerMatchStats } from '@/lib/types';
import { apiRequest, ApiResponse } from './api-config';

// 獲取所有比賽
export async function fetchMatches(token?: string): Promise<ApiResponse<Match[]>> {
  return apiRequest<Match[]>('/api/matches/matches/', 'GET', undefined, token);
}

// 獲取單個比賽
export async function fetchMatch(matchId: string, token?: string): Promise<ApiResponse<Match>> {
  return apiRequest<Match>(`/api/matches/matches/${matchId}/`, 'GET', undefined, token);
}

// 根據聯賽ID獲取比賽
export async function fetchMatchesByLeague(leagueId: string, token?: string): Promise<ApiResponse<Match[]>> {
  return apiRequest<Match[]>(`/api/matches/matches/?league=${leagueId}`, 'GET', undefined, token);
}

// 建立新比賽
export async function createMatch(matchData: Partial<Match>, token?: string): Promise<ApiResponse<Match>> {
  return apiRequest<Match>('/api/matches/matches/', 'POST', matchData, token);
}

// 更新比賽
export async function updateMatch(matchId: string, matchData: Partial<Match>, token?: string): Promise<ApiResponse<Match>> {
  return apiRequest<Match>(`/api/matches/matches/${matchId}/`, 'PUT', matchData, token);
}

// 刪除比賽
export async function deleteMatch(matchId: string, token?: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/matches/matches/${matchId}/`, 'DELETE', undefined, token);
}

// 更新比賽統計數據
export async function updateMatchStatistics(
  matchId: string, 
  playerStats: Record<string, PlayerMatchStats>, 
  token?: string
): Promise<ApiResponse<void>> {
  return apiRequest<void>(
    `/api/match-statistics/match-statistics/update-batch/`, 
    'POST', 
    { match_id: matchId, player_stats: playerStats }, 
    token
  );
}

// 獲取比賽統計數據
export async function fetchMatchStatistics(matchId: string, token?: string): Promise<ApiResponse<Record<string, PlayerMatchStats>>> {
  return apiRequest<Record<string, PlayerMatchStats>>(
    `/api/match-statistics/match-statistics/${matchId}/`, 
    'GET', 
    undefined, 
    token
  );
}

// 獲取比賽出席狀態
export async function fetchMatchAvailability(matchId: string, token?: string): Promise<ApiResponse<Record<string, boolean>>> {
  return apiRequest<Record<string, boolean>>(
    `/api/matches/match-availability/${matchId}/`,
    'GET',
    undefined,
    token
  );
}

// 更新球員比賽出席狀態
export async function updateMatchAvailability(
  matchId: string, 
  playerId: string, 
  isAvailable: boolean, 
  token?: string
): Promise<ApiResponse<void>> {
  return apiRequest<void>(
    `/api/matches/match-availability/update/`,
    'POST',
    { match_id: matchId, player_id: playerId, is_available: isAvailable },
    token
  );
}

// 更新球員對比賽的出席狀態
export async function updatePlayerAvailability(
  matchId: string,
  playerId: string,
  isAvailable: boolean,
  token?: string
): Promise<ApiResponse<void>> {
  return apiRequest<void>(
    `/api/matches/match-availability/${matchId}/player/${playerId}/`,
    'PUT',
    { is_available: isAvailable },
    token
  );
}

// 批次更新比賽陣容
export async function updateMatchRoster(
  matchId: string,
  roster: { playerId: string, position: string }[],
  token?: string
): Promise<ApiResponse<void>> {
  return apiRequest<void>(
    `/api/matches/match-roster/${matchId}/`,
    'PUT',
    { roster },
    token
  );
}

// 獲取比賽陣容
export async function fetchMatchRoster(matchId: string, token?: string): Promise<ApiResponse<{ playerId: string, position: string }[]>> {
  return apiRequest<{ playerId: string, position: string }[]>(
    `/api/matches/match-roster/${matchId}/`,
    'GET',
    undefined,
    token
  );
}
