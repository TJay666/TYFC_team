"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Added for availability
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Match, League, Team, MatchConflictInfo, AppData } from '@/lib/types';
import { USER_ROLES } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context'; // Added
import { MatchForm } from '@/components/forms/match-form';
import { MatchRosterForm } from '@/components/forms/match-roster-form';
import { MatchStatsForm } from '@/components/forms/match-stats-form';
import { PlusCircle, Edit3, Users, BarChart2, Trash2, AlertTriangle, XCircle, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useToast } from "@/hooks/use-toast"; // 舊版 toast 系統，有問題
import { useToast } from "@/hooks/use-simple-toast"; // 使用新的簡化 toast 系統

// 導入API服務
import { 
  createMatch, 
  updateMatch, 
  deleteMatch,
  updateMatchAvailability
} from '@/lib/api/matches-api';

// 獲取特定賽制需要的球員數量
function getRequiredPlayersForFormat(format: string | undefined): number {
  switch (format) {
    case '5人制': return 5;
    case '8人制': return 8;
    case '11人制': return 11;
    default: return 0;
  }
}

interface MatchesSectionProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  currentUserRole: typeof USER_ROLES[keyof typeof USER_ROLES]; // 改成使用 USER_ROLES 類型 
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
  const { currentUserId, authToken } = useAuth(); // Get current logged-in player's ID
  const { addToast } = useToast(); // 新版 toast 系統使用 addToast 而不是 toast

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

  const handleMatchFormSubmit = async (data: any) => {
    try {
      let updatedMatch;
      
      if (data.id) {
        // 更新比賽
        const response = await updateMatch(data.id, data, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (response.data) {
          updatedMatch = response.data;          addToast({
            title: "更新成功",
            message: `比賽資訊已更新`,
            type: "success"
          });
        }
      } else {
        // 創建新比賽
        const response = await createMatch(data, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (response.data) {
          updatedMatch = response.data;          addToast({
            title: "創建成功",
            message: `新比賽已添加`,
            type: "success"
          });
        }
      }
      
      // 更新本地狀態
      if (updatedMatch) {
        setAppData(prev => ({
          ...prev,
          matches: data.id 
            ? prev.matches.map(m => m.id === data.id ? updatedMatch : m)
            : [...prev.matches, updatedMatch]
        }));
      }
      
      setIsMatchModalOpen(false);
      setEditingMatch(undefined);
      
    } catch (error) {
      console.error('處理比賽表單提交時出錯：', error);      addToast({
        title: "操作失敗",
        message: error instanceof Error ? error.message : "發生未知錯誤",
        type: "error"
      });
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    try {
      const response = await deleteMatch(matchId, authToken || undefined);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // 從本地狀態中移除
      setAppData(prev => ({
        ...prev,
        matches: prev.matches.filter(m => m.id !== matchId)
      }));
        addToast({
        title: "刪除成功",
        message: `比賽已刪除`,
        type: "success"
      });
    } catch (error) {
      console.error('刪除比賽時出錯：', error);      addToast({
        title: "刪除失敗",
        message: error instanceof Error ? error.message : "發生未知錯誤",
        type: "error"
      });
    }
  };

  const handleAvailabilityChange = async (matchId: string, playerId: string, isAvailable: boolean) => {
    try {
      // 先更新本地狀態提供即時反饋
      setAppData(prev => {
        const newAvailability = { ...prev.matchAvailability };
        if (!newAvailability[matchId]) {
          newAvailability[matchId] = {};
        }
        newAvailability[matchId][playerId] = isAvailable;
        return { ...prev, matchAvailability: newAvailability };
      });
      
      // 調用 API 更新伺服器數據
      const response = await updateMatchAvailability(
        matchId, 
        playerId, 
        isAvailable, 
        authToken || undefined
      );
      
      if (response.error) {
        // 如果 API 調用失敗，回滾本地狀態
        setAppData(prev => {
          const newAvailability = { ...prev.matchAvailability };
          if (!newAvailability[matchId]) {
            newAvailability[matchId] = {};
          }
          // 還原為先前值或默認值
          newAvailability[matchId][playerId] = !isAvailable;
          return { ...prev, matchAvailability: newAvailability };
        });
        
        throw new Error(response.error);
      }
    } catch (error) {      console.error('更新出席狀態時出錯：', error);
      addToast({
        title: "更新出席狀態失敗",
        message: error instanceof Error ? error.message : "發生未知錯誤",
        type: "error"
      });
    }
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

  const isCoachOrAdmin = currentUserRole === USER_ROLES.COACH; 

  const displayedMatches = useMemo(() => {
    return filteredMatches.filter(match => {
      const leagueFilterMatch = matchLeagueFilter === 'all' || match.leagueId === matchLeagueFilter;
      const monthFilterMatch = !matchMonthFilter || match.date_time.startsWith(matchMonthFilter);
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
      return { ...player!, position: item.position }; 
    }).filter(p => p && p.id); // Ensure player exists and has an ID
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#1d3557] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10 8 16 12 10 16 10 8"></polygon>
          </svg>
          比賽管理 <span className="text-xl text-[#457b9d] ml-2">{globalGroupIndicator}</span>
        </h2>
        {isCoachOrAdmin && (
          <Dialog open={isMatchModalOpen} onOpenChange={setIsMatchModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddMatch} className="bg-[#1d3557] hover:bg-[#457b9d] text-white shadow-md transition-colors duration-200">
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

      <Card className="mb-6 shadow-lg bg-white border border-[#457b9d]/20 overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="match-league-filter" className="text-[#1d3557] font-medium">聯賽</Label>
              <Select value={matchLeagueFilter} onValueChange={setMatchLeagueFilter}>
                <SelectTrigger id="match-league-filter" className="border-[#457b9d]/30 focus:ring-[#457b9d]/20 bg-white">
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
            <div className="space-y-2">
              <Label htmlFor="match-month-filter" className="text-[#1d3557] font-medium">月份</Label>
              <Input
                type="month"
                id="match-month-filter"
                value={matchMonthFilter}
                onChange={(e) => setMatchMonthFilter(e.target.value)}
                className="border-[#457b9d]/30 focus:ring-[#457b9d]/20 focus:border-[#457b9d] bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#f1faee]">
                <TableRow>
                  <TableHead className="w-[30px] p-1 text-center text-[#1d3557] font-semibold"></TableHead>
                  <TableHead className="text-[#1d3557] font-semibold">日期</TableHead>
                  <TableHead className="text-[#1d3557] font-semibold">時間</TableHead>
                  <TableHead className="text-[#1d3557] font-semibold">聯賽</TableHead>
                  <TableHead className="text-[#1d3557] font-semibold">對手</TableHead>
                  <TableHead className="text-[#1d3557] font-semibold">地點</TableHead>
                  {currentUserRole === USER_ROLES.PLAYER && <TableHead className="text-center w-[80px] text-[#1d3557] font-semibold">出席</TableHead>}
                  {isCoachOrAdmin && <TableHead className="text-right text-[#1d3557] font-semibold">操作</TableHead>}
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

                  const isPlayerAvailable = currentUserId ? appData.matchAvailability[match.id]?.[currentUserId] || false : false;

                  return (
                    <TableRow key={match.id} 
                      className={cn({
                        'bg-[var(--conflict-error-bg)]': conflict.type === 'overlap',
                        'bg-[var(--conflict-warning-bg)]': conflict.type === 'sameday',
                        'hover:bg-[#f8f9fa] border-b border-[#e9ecef]': true
                      })}
                    >
                      <TableCell className="p-1 text-center">
                        {conflict.type === 'overlap' && <XCircle className="h-5 w-5 text-destructive inline-block" />}
                        {conflict.type === 'sameday' && <AlertTriangle className="h-5 w-5 text-yellow-500 inline-block" />}
                      </TableCell>
                      <TableCell className="font-medium text-[#1d3557]">{match.date}</TableCell>
                      <TableCell>{match.startTime}</TableCell>
                      <TableCell>{league ? league.name : 'N/A'}</TableCell>
                      <TableCell>{opponent ? opponent.name : 'N/A'}</TableCell>
                      <TableCell>{match.location}</TableCell>
                      
                      {currentUserRole === USER_ROLES.PLAYER && (
                        <TableCell className="text-center">
                          {currentUserId && (
                            <Checkbox
                              id={`availability-${match.id}-${currentUserId}`}
                              checked={isPlayerAvailable}
                              onCheckedChange={(checked) => handleAvailabilityChange(match.id, currentUserId, !!checked)}
                              aria-label={`Mark availability for match on ${match.date}`}
                              className="border-[#457b9d]/50 text-[#1d3557] focus:ring-[#457b9d]/30 data-[state=checked]:bg-[#1d3557] data-[state=checked]:border-[#1d3557]"
                            />
                          )}
                        </TableCell>
                      )}

                      {isCoachOrAdmin && (
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditMatch(match)} 
                              className="hover:text-[#457b9d] hover:bg-[#457b9d]/10 rounded-full transition-colors duration-200"
                              title="編輯比賽"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openRosterModal(match)} 
                              className={cn(
                                "hover:text-[#e9c46a] hover:bg-[#e9c46a]/10 relative rounded-full transition-colors duration-200", 
                                { "text-[#e63946]": showRosterWarning }
                              )}
                              title={`管理陣容 (${currentRosterCount} / ${requiredPlayers > 0 ? requiredPlayers : 'N/A'})`}
                            >
                              <Users className="h-4 w-4" />
                              {currentRosterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-[#e9c46a] text-[#1d3557] text-xs w-4 h-4 rounded-full flex items-center justify-center border border-white font-medium">
                                  {currentRosterCount}
                                </span>
                              )}
                              {showRosterWarning && (
                                <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-white rounded-full flex items-center justify-center">
                                  <AlertTriangle className="h-3 w-3 text-[#e63946]" />
                                </span>
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openStatsModal(match)} 
                              className="hover:text-[#2a9d8f] hover:bg-[#2a9d8f]/10 rounded-full transition-colors duration-200"
                              title="比賽統計"
                            >
                              <BarChart2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                onOpenConfirmDialog(
                                  "確認刪除比賽", 
                                  `確定要刪除 ${match.date} 與 ${opponent?.name || 'N/A'} 的比賽嗎？此操作無法撤銷。`, 
                                  () => handleDeleteMatch(match.id)
                                );
                              }} 
                              className="hover:text-[#e63946] hover:bg-[#e63946]/10 rounded-full transition-colors duration-200"
                              title="刪除比賽"
                            >
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
              matchAvailabilityForCurrentMatch={appData.matchAvailability[currentMatchForModal.id]}
            />
          </DialogContent>
        </Dialog>
      )}

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

