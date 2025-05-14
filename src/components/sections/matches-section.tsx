"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import type { Match, League, Team, UserRole, MatchConflictInfo, AppData } from '@/lib/types';
import { MatchForm } from '@/components/forms/match-form';
import { MatchRosterForm } from '@/components/forms/match-roster-form';
import { MatchStatsForm } from '@/components/forms/match-stats-form';
import { PlusCircle, Edit3, Users, BarChart2, Trash2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchesSectionProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  currentUserRole: UserRole;
  onOpenConfirmDialog: (title: string, description: string, onConfirm: () => void) => void;
  filteredMatches: Match[];
  filteredLeagues: League[];
  globalGroupIndicator: string;
  matchConflicts: { [matchId: string]: MatchConflictInfo };
}

export function MatchesSection({
  appData,
  setAppData,
  currentUserRole,
  onOpenConfirmDialog,
  filteredMatches,
  filteredLeagues,
  globalGroupIndicator,
  matchConflicts,
}: MatchesSectionProps) {
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | undefined>(undefined);
  const [currentMatchForModal, setCurrentMatchForModal] = useState<Match | undefined>(undefined);

  const [matchLeagueFilter, setMatchLeagueFilter] = useState<string>("all");
  const [matchMonthFilter, setMatchMonthFilter] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const handleAddMatch = () => {
    setEditingMatch(undefined);
    setIsMatchModalOpen(true);
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    setIsMatchModalOpen(true);
  };

  const handleMatchFormSubmit = (data: any) => {
    const matchData = { ...data } as Omit<Match, 'group' | 'levelU' | 'stats'>;
    const league = appData.leagues.find(l => l.id === matchData.leagueId);
    
    const completeMatchData: Match = {
      ...matchData,
      id: editingMatch?.id || `match_${Date.now()}`,
      group: league?.group || 'N/A',
      levelU: league?.levelU || 'N/A',
      stats: editingMatch?.stats || {},
    };

    if (editingMatch) {
      setAppData(prev => ({
        ...prev,
        matches: prev.matches.map(m => m.id === editingMatch.id ? completeMatchData : m),
      }));
    } else {
      setAppData(prev => ({
        ...prev,
        matches: [...prev.matches, completeMatchData],
      }));
    }
    setIsMatchModalOpen(false);
    setEditingMatch(undefined);
  };

  const handleDeleteMatch = (matchId: string) => {
    onOpenConfirmDialog("確認刪除比賽", `您確定要刪除此比賽嗎？此操作無法復原。`, () => {
      setAppData(prev => ({
        ...prev,
        matches: prev.matches.filter(m => m.id !== matchId),
        matchRosters: { ...prev.matchRosters, [matchId]: undefined! } // Remove roster too
      }));
    });
  };

  const openRosterModal = (match: Match) => {
    setCurrentMatchForModal(match);
    setIsRosterModalOpen(true);
  };

  const handleRosterFormSubmit = (data: { matchId: string; roster: Array<{ playerId: string; position: string }> }) => {
    setAppData(prev => ({
      ...prev,
      matchRosters: {
        ...prev.matchRosters,
        [data.matchId]: data.roster,
      }
    }));
    setIsRosterModalOpen(false);
  };

  const openStatsModal = (match: Match) => {
    setCurrentMatchForModal(match);
    setIsStatsModalOpen(true);
  };

  const handleStatsFormSubmit = (matchId: string, stats: { [playerId: string]: any }) => {
    setAppData(prev => ({
      ...prev,
      matches: prev.matches.map(m => m.id === matchId ? { ...m, stats } : m),
    }));
    setIsStatsModalOpen(false);
  };
  
  const isActionDisabled = currentUserRole === 'player' || currentUserRole === 'guest';

  const displayedMatches = useMemo(() => {
    return filteredMatches.filter(match => {
      const leagueFilterMatch = matchLeagueFilter === 'all' || match.leagueId === matchLeagueFilter;
      const monthFilterMatch = !matchMonthFilter || match.date.startsWith(matchMonthFilter);
      return leagueFilterMatch && monthFilterMatch;
    });
  }, [filteredMatches, matchLeagueFilter, matchMonthFilter]);

  const getEligiblePlayersForRoster = (match: Match | undefined) => {
    if (!match) return [];
    return appData.players.filter(p => 
      (match.group === 'all' || p.group === match.group) &&
      (match.levelU === 'all' || p.levelU === match.levelU) ||
      (p.participatingLeagueIds.includes(match.leagueId))
    );
  };

  const getRosteredPlayersWithDetails = (match: Match | undefined) => {
    if (!match) return [];
    const rosterItems = appData.matchRosters[match.id] || [];
    return rosterItems.map(item => {
      const player = appData.players.find(p => p.id === item.playerId);
      return { ...player!, position: item.position }; // Assume player exists
    }).filter(Boolean);
  };

  const getRequiredPlayersForFormat = (format: string | undefined): number => {
    if (!format) return 0;
    if (format.includes("5人制")) return 5;
    if (format.includes("8人制")) return 8;
    if (format.includes("11人制")) return 11;
    return 0;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary">
          比賽管理 <span className="text-xl text-secondary">{globalGroupIndicator}</span>
        </h2>
        {!isActionDisabled && (
          <Dialog open={isMatchModalOpen} onOpenChange={setIsMatchModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddMatch} className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-5 w-5" /> 新增比賽
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingMatch ? '編輯比賽' : '新增比賽'}</DialogTitle>
              </DialogHeader>
              <MatchForm
                leagues={appData.leagues}
                teams={appData.teams}
                onSubmit={handleMatchFormSubmit}
                initialData={editingMatch}
                userRole={currentUserRole}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="mb-6 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="match-league-filter">聯賽</Label>
              <Select value={matchLeagueFilter} onValueChange={setMatchLeagueFilter}>
                <SelectTrigger id="match-league-filter">
                  <SelectValue placeholder="所有聯賽" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有聯賽</SelectItem>
                  {filteredLeagues.map((league) => ( // Use filteredLeagues for consistency with global filter
                    <SelectItem key={league.id} value={league.id}>{league.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="match-month-filter">月份</Label>
              <Input
                type="month"
                id="match-month-filter"
                value={matchMonthFilter}
                onChange={(e) => setMatchMonthFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px] p-1 text-center"></TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>時間</TableHead>
                  <TableHead>聯賽</TableHead>
                  <TableHead>對手</TableHead>
                  <TableHead>地點</TableHead>
                  {!isActionDisabled && <TableHead className="text-right">操作</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedMatches.map((match) => {
                  const league = appData.leagues.find(l => l.id === match.leagueId);
                  const opponent = appData.teams.find(t => t.id === match.opponentTeamId);
                  const conflict = matchConflicts[match.id] || { type: 'none' };
                  
                  const currentRosterCount = (appData.matchRosters[match.id] || []).length;
                  const matchFormat = league?.format;
                  const requiredPlayers = getRequiredPlayersForFormat(matchFormat);
                  const showRosterWarning = currentRosterCount < requiredPlayers && requiredPlayers > 0;

                  return (
                    <TableRow key={match.id} 
                      className={cn({
                        'bg-[var(--conflict-error-bg)]': conflict.type === 'overlap',
                        'bg-[var(--conflict-warning-bg)]': conflict.type === 'sameday',
                      })}
                    >
                      <TableCell className="p-1 text-center">
                        {conflict.type === 'overlap' && <XCircle className="h-5 w-5 text-destructive inline-block" />}
                        {conflict.type === 'sameday' && <AlertTriangle className="h-5 w-5 text-yellow-500 inline-block" />}
                      </TableCell>
                      <TableCell>{match.date}</TableCell>
                      <TableCell>{match.startTime}</TableCell>
                      <TableCell>{league ? league.name : 'N/A'}</TableCell>
                      <TableCell>{opponent ? opponent.name : 'N/A'}</TableCell>
                      <TableCell>{match.location}</TableCell>
                      {!isActionDisabled && (
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditMatch(match)} className="hover:text-primary">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openRosterModal(match)} 
                              className="hover:text-yellow-500 relative"
                              title={`管理陣容 (${currentRosterCount} / ${requiredPlayers > 0 ? requiredPlayers : 'N/A'})`}
                            >
                              <Users className="h-4 w-4" />
                              {currentRosterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center border border-background">
                                  {currentRosterCount}
                                </span>
                              )}
                              {showRosterWarning && (
                                <AlertTriangle className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-destructive fill-destructive/70" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openStatsModal(match)} className="btn-success hover:text-green-600">
                              <BarChart2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteMatch(match.id)} className="hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {displayedMatches.length === 0 && <p className="text-center text-muted-foreground py-4">無符合條件的比賽。</p>}
          </div>
        </CardContent>
      </Card>

      {/* Roster Modal */}
      {currentMatchForModal && (
        <Dialog open={isRosterModalOpen} onOpenChange={setIsRosterModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>比賽陣容管理</DialogTitle>
            </DialogHeader>
            <div className="p-1 mb-2 bg-muted rounded-md text-sm">
              <p><strong>日期:</strong> {currentMatchForModal.date}</p>
              <p><strong>對手:</strong> {appData.teams.find(t => t.id === currentMatchForModal.opponentTeamId)?.name || 'N/A'}</p>
            </div>
            <MatchRosterForm
              matchId={currentMatchForModal.id}
              availablePlayers={getEligiblePlayersForRoster(currentMatchForModal)}
              initialRoster={appData.matchRosters[currentMatchForModal.id] || []}
              onSubmit={handleRosterFormSubmit}
              userRole={currentUserRole}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Stats Modal */}
      {currentMatchForModal && (
         <Dialog open={isStatsModalOpen} onOpenChange={setIsStatsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>比賽數據輸入</DialogTitle>
            </DialogHeader>
            <div className="p-1 mb-2 bg-muted rounded-md text-sm">
              <p><strong>日期:</strong> {currentMatchForModal.date}</p>
              <p><strong>對手:</strong> {appData.teams.find(t => t.id === currentMatchForModal.opponentTeamId)?.name || 'N/A'}</p>
            </div>
            <MatchStatsForm
              matchId={currentMatchForModal.id}
              rosteredPlayersWithDetails={getRosteredPlayersWithDetails(currentMatchForModal)}
              initialStats={currentMatchForModal.stats || {}}
              onSubmit={handleStatsFormSubmit}
              userRole={currentUserRole}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
