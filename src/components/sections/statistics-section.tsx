"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Player, Match, League, AppData } from '@/lib/types';
import { GoalsAssistsCharts } from '@/components/charts/goals-assists-charts';

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
  const [statsLeagueFilter, setStatsLeagueFilter] = useState<string>("all");

  const playerStatsSummaries = useMemo(() => {
    const summaries: { [playerId: string]: PlayerStatsSummary } = {};

    // Initialize with all players matching global filters
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
      ? filteredMatches // Use globally filtered matches
      : filteredMatches.filter(m => m.leagueId === statsLeagueFilter);


    matchesToConsider.forEach(match => {
      if (match.stats) {
        for (const playerId in match.stats) {
          if (summaries[playerId]) { // Only count stats for players in the current global filter scope
            const pStats = match.stats[playerId];
            summaries[playerId].goals += pStats.goals || 0;
            summaries[playerId].assists += pStats.assists || 0;
            summaries[playerId].yellowCards += pStats.yellow || 0;
            summaries[playerId].redCards += pStats.red || 0;
          }
        }
      }
    });
    return Object.values(summaries);
  }, [filteredPlayers, filteredMatches, statsLeagueFilter]);

  const injuredPlayersList = useMemo(() => {
    return filteredPlayers.filter(p => p.injured === '是');
  }, [filteredPlayers]);


  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-6">
        統計數據 <span className="text-xl text-secondary">{globalGroupIndicator}</span>
      </h2>

      <Card className="shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="stats-league-filter">聯賽</Label>
              <Select value={statsLeagueFilter} onValueChange={setStatsLeagueFilter}>
                <SelectTrigger id="stats-league-filter">
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
            <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">進球/助攻統計</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>球員姓名</TableHead>
                    <TableHead>進球總數</TableHead>
                    <TableHead>助攻總數</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerStatsSummaries.map((summary) => (
                    <TableRow key={summary.id}>
                      <TableCell>{summary.name}</TableCell>
                      <TableCell>{summary.goals}</TableCell>
                      <TableCell>{summary.assists}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {playerStatsSummaries.length === 0 && <p className="text-center text-muted-foreground py-4">無進球/助攻數據。</p>}
            </div>
            <GoalsAssistsCharts playerStatsSummaries={playerStatsSummaries.filter(s => s.goals > 0 || s.assists > 0)} />
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">紅黃牌統計</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>球員姓名</TableHead>
                    <TableHead>總黃牌</TableHead>
                    <TableHead>總紅牌</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerStatsSummaries.map((summary) => (
                    <TableRow key={summary.id}>
                      <TableCell>{summary.name}</TableCell>
                      <TableCell>{summary.yellowCards}</TableCell>
                      <TableCell>{summary.redCards}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {playerStatsSummaries.length === 0 && <p className="text-center text-muted-foreground py-4">無紅黃牌數據。</p>}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">受傷球員名單</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>球員姓名</TableHead>
                    <TableHead>受傷備註</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {injuredPlayersList.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {injuredPlayersList.length === 0 && <p className="text-center text-muted-foreground py-4">無受傷球員。</p>}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
