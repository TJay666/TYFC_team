// src/lib/api/players-api.ts
import { Player } from '@/lib/types';
import { apiRequest, ApiResponse } from './api-config';

// 獲取所有球員
export async function fetchPlayers(token?: string): Promise<ApiResponse<Player[]>> {
  return apiRequest<Player[]>('/api/players/players/', 'GET', undefined, token);
}

// 獲取單個球員
export async function fetchPlayer(playerId: string, token?: string): Promise<ApiResponse<Player>> {
  return apiRequest<Player>(`/api/players/players/${playerId}/`, 'GET', undefined, token);
}

// 根據聯賽ID獲取球員
export async function fetchPlayersByLeague(leagueId: string, token?: string): Promise<ApiResponse<Player[]>> {
  return apiRequest<Player[]>(`/api/players/players/?league=${leagueId}`, 'GET', undefined, token);
}

// 根據球隊ID獲取球員
export async function fetchPlayersByTeam(teamId: string, token?: string): Promise<ApiResponse<Player[]>> {
  return apiRequest<Player[]>(`/api/players/players/?team=${teamId}`, 'GET', undefined, token);
}

// 建立新球員
export async function createPlayer(playerData: Partial<Player>, token?: string): Promise<ApiResponse<Player>> {
  return apiRequest<Player>('/api/players/players/', 'POST', playerData, token);
}

// 更新球員
export async function updatePlayer(playerId: string, playerData: Partial<Player>, token?: string): Promise<ApiResponse<Player>> {
  return apiRequest<Player>(`/api/players/players/${playerId}/`, 'PUT', playerData, token);
}

// 刪除球員
export async function deletePlayer(playerId: string, token?: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/players/players/${playerId}/`, 'DELETE', undefined, token);
}

// 更新球員參與的聯賽
export async function updatePlayerLeagues(
  playerId: string, 
  leagueIds: string[], 
  token?: string
): Promise<ApiResponse<void>> {
  return apiRequest<void>(
    `/api/players/players/${playerId}/update-leagues/`, 
    'POST', 
    { league_ids: leagueIds }, 
    token
  );
}

// 獲取受傷球員
export async function fetchInjuredPlayers(token?: string): Promise<ApiResponse<Player[]>> {
  return apiRequest<Player[]>('/api/players/players/injured/', 'GET', undefined, token);
}
