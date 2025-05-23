"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Player, Match, League, AppData, PlayerMatchStats } from '@/lib/types';
import { GoalsAssistsCharts } from '@/components/charts/goals-assists-charts';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from "@/hooks/use-simple-toast";

// 導入API服務
import {
  fetchLeagueStatistics,
  fetchTeamStatistics,
  fetchPlayerStatistics
} from '@/lib/api/statistics-api';

interface StatisticsSectionProps {
  appData: AppData;
  filteredPlayers: Player[]; // Players filtered by global group/level
  filteredMatches: Match[]; // Matches filtered by global group/level
  filteredLeagues: League[]; // Leagues filtered by global group/level for dropdown
  globalGroupIndicator: string;
}

interface PlayerStatsSummary {
  id: string;
  name: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export function StatisticsSection({
  appData,
  filteredPlayers,
  filteredMatches,
  filteredLeagues,
  globalGroupIndicator,
}: StatisticsSectionProps) {
  const { authToken } = useAuth();
  const { addToast } = useToast();
  
  const [statsLeagueFilter, setStatsLeagueFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [playerStatsSummaries, setPlayerStatsSummaries] = useState<PlayerStatsSummary[]>([]);

  // 統計數據計算 - 使用本地資料 + API 資料的混合方法
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // 初始化所有符合全局篩選的球員的摘要
        const summaries: { [playerId: string]: PlayerStatsSummary } = {};
        filteredPlayers.forEach(player => {
          summaries[player.id] = { 
            id: player.id,
            name: player.name, 
            goals: 0, 
            assists: 0, 
            yellowCards: 0, 
            redCards: 0 
          };
        });
        
        // 嘗試從 API 獲取統計數據
        if (statsLeagueFilter !== "all") {
          // 獲取特定聯賽的統計數據
          const response = await fetchLeagueStatistics(statsLeagueFilter, authToken || undefined);
          if (!response.error && response.data) {
            // 處理 API 返回的聯賽統計數據
            const leagueStats = response.data;
            // 假設 leagueStats 包含球員統計數據的結構
            // 這里需要根據實際 API 返回的數據結構進行調整
            if (leagueStats.player_stats) {
              for (const playerId in leagueStats.player_stats) {
                if (summaries[playerId]) {
                  const pStats = leagueStats.player_stats[playerId];
                  summaries[playerId].goals = pStats.goals || 0;
                  summaries[playerId].assists = pStats.assists || 0;
                  summaries[playerId].yellowCards = pStats.yellow_cards || 0;
                  summaries[playerId].redCards = pStats.red_cards || 0;
                }
              }
            }
          } else {
            // 如果 API 請求失敗，回退到使用本地數據
            fallbackToLocalData(summaries);
          }
        } else {
          // 獲取球隊整體統計數據
          const response = await fetchTeamStatistics(authToken || undefined);
          if (!response.error && response.data) {
            // 處理 API 返回的球隊統計數據
            const teamStats = response.data;
            // 假設 teamStats 包含球員統計數據的結構
            // 這里需要根據實際 API 返回的數據結構進行調整
            if (teamStats.player_stats) {
              for (const playerId in teamStats.player_stats) {
                if (summaries[playerId]) {
                  const pStats = teamStats.player_stats[playerId];
                  summaries[playerId].goals = pStats.goals || 0;
                  summaries[playerId].assists = pStats.assists || 0;
                  summaries[playerId].yellowCards = pStats.yellow_cards || 0;
                  summaries[playerId].redCards = pStats.red_cards || 0;
                }
              }
            }
          } else {
            // 如果 API 請求失敗，回退到使用本地數據
            fallbackToLocalData(summaries);
          }
        }
        
        setPlayerStatsSummaries(Object.values(summaries));      } catch (error) {
        console.error('獲取統計數據時出錯：', error);
        // 發生錯誤時顯示通知
        addToast({
          type: "error",
          title: "獲取統計數據失敗",
          message: error instanceof Error ? error.message : "發生未知錯誤",
        });
        
        // 回退到使用本地數據
        const summaries: { [playerId: string]: PlayerStatsSummary } = {};
        fallbackToLocalData(summaries);
        setPlayerStatsSummaries(Object.values(summaries));
      } finally {
        setIsLoading(false);
      }
    };
    
    const fallbackToLocalData = (summaries: { [playerId: string]: PlayerStatsSummary }) => {
      // 初始化所有符合全局篩選的球員的摘要
      filteredPlayers.forEach(player => {
        summaries[player.id] = { 
          id: player.id,
          name: player.name, 
          goals: 0, 
          assists: 0, 
          yellowCards: 0, 
          redCards: 0 
        };
      });
      
      const matchesToConsider = statsLeagueFilter === "all" 
        ? filteredMatches // 使用全局篩選的比賽
        : filteredMatches.filter(m => m.leagueId === statsLeagueFilter);

      matchesToConsider.forEach(match => {
        if (match.stats) {
          for (const playerId in match.stats) {
            if (summaries[playerId]) { // 只統計當前全局篩選範圍內的球員的數據
              const pStats = match.stats[playerId];
              summaries[playerId].goals += pStats.goals || 0;
              summaries[playerId].assists += pStats.assists || 0;
              summaries[playerId].yellowCards += pStats.yellow || 0;
              summaries[playerId].redCards += pStats.red || 0;
            }
          }
        }
      });
    };
    
    fetchStats();
  }, [filteredPlayers, filteredMatches, statsLeagueFilter, authToken, addToast]);

  const injuredPlayersList = useMemo(() => {
    return filteredPlayers.filter(p => p.injured === '是');
  }, [filteredPlayers]);


  return (
    <div>
      <h2 className="text-3xl font-bold text-[#1d3557] flex items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M12 2v8"></path>
          <path d="m16 6-4 4-4-4"></path>
          <rect width="20" height="8" x="2" y="14" rx="2"></rect>
        </svg>
        統計數據 <span className="text-xl text-[#457b9d] ml-2">{globalGroupIndicator}</span>
      </h2>

      <Card className="shadow-lg bg-white border border-[#457b9d]/20 overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="stats-league-filter" className="text-[#1d3557] font-medium">聯賽</Label>
              <Select value={statsLeagueFilter} onValueChange={setStatsLeagueFilter}>
                <SelectTrigger id="stats-league-filter" className="border-[#457b9d]/30 focus:ring-[#457b9d]/20 bg-white">
                  <SelectValue placeholder="所有聯賽" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有聯賽</SelectItem>
                  {filteredLeagues.map((league) => (
                    <SelectItem key={league.id} value={league.id}>{league.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-[#1d3557] border-b border-[#457b9d]/20 pb-2 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m8 12 3 3 5-5"></path>
              </svg>
              進球/助攻統計
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#f1faee]">
                  <TableRow>
                    <TableHead className="text-[#1d3557] font-semibold">球員姓名</TableHead>
                    <TableHead className="text-[#1d3557] font-semibold">進球總數</TableHead>
                    <TableHead className="text-[#1d3557] font-semibold">助攻總數</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerStatsSummaries.map((summary) => (
                    <TableRow key={summary.id} className="hover:bg-[#f8f9fa] border-b border-[#e9ecef]">
                      <TableCell className="font-medium text-[#1d3557]">{summary.name}</TableCell>
                      <TableCell>{summary.goals}</TableCell>
                      <TableCell>{summary.assists}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {playerStatsSummaries.length === 0 && <p className="text-center text-[#6c757d] py-4">無進球/助攻數據。</p>}
            </div>
            <GoalsAssistsCharts playerStatsSummaries={playerStatsSummaries.filter(s => s.goals > 0 || s.assists > 0)} />
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-[#1d3557] border-b border-[#457b9d]/20 pb-2 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <rect width="7" height="12" x="2" y="6" rx="1"></rect>
                <rect width="7" height="9" x="15" y="9" rx="1"></rect>
              </svg>
              紅黃牌統計
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#f1faee]">
                  <TableRow>
                    <TableHead className="text-[#1d3557] font-semibold">球員姓名</TableHead>
                    <TableHead className="text-[#1d3557] font-semibold">總黃牌</TableHead>
                    <TableHead className="text-[#1d3557] font-semibold">總紅牌</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerStatsSummaries.map((summary) => (
                    <TableRow key={summary.id} className="hover:bg-[#f8f9fa] border-b border-[#e9ecef]">
                      <TableCell className="font-medium text-[#1d3557]">{summary.name}</TableCell>
                      <TableCell>{summary.yellowCards}</TableCell>
                      <TableCell>{summary.redCards}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {playerStatsSummaries.length === 0 && <p className="text-center text-[#6c757d] py-4">無紅黃牌數據。</p>}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-[#1d3557] border-b border-[#457b9d]/20 pb-2 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M17 12a5 5 0 0 0-5-5 5 5 0 0 0-5 5v5a2 2 0 0 1-4 0"></path>
                <path d="M17 7v9a2 2 0 0 1-4 0"></path>
              </svg>
              受傷球員名單
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#f1faee]">
                  <TableRow>
                    <TableHead className="text-[#1d3557] font-semibold">球員姓名</TableHead>
                    <TableHead className="text-[#1d3557] font-semibold">受傷備註</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {injuredPlayersList.map((player) => (
                    <TableRow key={player.id} className="hover:bg-[#f8f9fa] border-b border-[#e9ecef]">
                      <TableCell className="font-medium text-[#1d3557]">{player.name}</TableCell>
                      <TableCell>{player.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {injuredPlayersList.length === 0 && <p className="text-center text-[#6c757d] py-4">無受傷球員。</p>}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
