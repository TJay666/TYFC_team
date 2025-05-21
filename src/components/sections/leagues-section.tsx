"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { League, Team, AppData } from '@/lib/types';
import { USER_ROLES } from '@/lib/types';
import { useToast } from "@/hooks/use-simple-toast";
import { useAuth } from '@/contexts/auth-context';

// 導入API服務
import { 
  createLeague, 
  updateLeague, 
  deleteLeague,
  fetchLeagues
} from '@/lib/api/leagues-api';
import {
  createTeam,
  updateTeam,
  deleteTeam,
  fetchTeams
} from '@/lib/api/teams-api';
import { LeagueForm } from '@/components/forms/league-form';
import { TeamForm } from '@/components/forms/team-form';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

interface LeaguesSectionProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  currentUserRole: typeof USER_ROLES[keyof typeof USER_ROLES];
  onOpenConfirmDialog: (title: string, description: string, onConfirm: () => void) => void;
  filteredLeagues: League[]; // Leagues filtered by global filters
  globalGroupIndicator: string;
}

export function LeaguesSection({
  appData,
  setAppData,
  currentUserRole,
  onOpenConfirmDialog,
  filteredLeagues,
  globalGroupIndicator,
}: LeaguesSectionProps) {
  const { authToken } = useAuth();
  const { addToast } = useToast();
  
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<League | undefined>(undefined);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);
  const [teams, setTeams] = useState<Team[]>(appData.teams);

  useEffect(() => {
    // 確保球隊列表與 appData 保持同步
    setTeams(appData.teams);
  }, [appData.teams]);

  const handleAddLeague = () => {
    setEditingLeague(undefined);
    setIsLeagueModalOpen(true);
  };

  const handleEditLeague = (league: League) => {
    setEditingLeague(league);
    setIsLeagueModalOpen(true);
  };

  const handleLeagueFormSubmit = async (data: any) => {
    try {
      const leagueData = data as League;
      let updatedLeague;
      
      if (editingLeague) {
        // 更新聯賽
        const response = await updateLeague(editingLeague.id, leagueData, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (response.data) {
          updatedLeague = response.data;          addToast({
            title: "更新成功",
            message: `聯賽「${updatedLeague.name}」已更新`,
            type: "success"
          });
        }
      } else {
        // 創建新聯賽
        const response = await createLeague(leagueData, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (response.data) {
          updatedLeague = response.data;          addToast({
            title: "創建成功",
            message: `聯賽「${updatedLeague.name}」已添加`,
            type: "success"
          });
        }
      }
      
      // 更新本地狀態
      if (updatedLeague) {
        setAppData(prev => ({
          ...prev,
          leagues: editingLeague
            ? prev.leagues.map(l => l.id === editingLeague.id ? updatedLeague : l)
            : [...prev.leagues, updatedLeague],
        }));
      }
      
      setIsLeagueModalOpen(false);
      setEditingLeague(undefined);
        } catch (error) {
      console.error('處理聯賽表單提交時出錯：', error);
      addToast({
        type: "error",
        title: "操作失敗",
        message: error instanceof Error ? error.message : "發生未知錯誤",
      });
    }
  };

  const handleDeleteLeague = (leagueId: string) => {
    onOpenConfirmDialog("確認刪除聯賽", `您確定要刪除此聯賽嗎？相關比賽的聯賽資訊將會遺失。`, async () => {
      try {
        const response = await deleteLeague(leagueId, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // 從本地狀態中移除
        setAppData(prev => {
          const newLeagues = prev.leagues.filter(l => l.id !== leagueId);
          // 同時更新參考此聯賽的比賽（可選：如果正在使用則阻止刪除）
          const newMatches = prev.matches.map(m => m.leagueId === leagueId ? {...m, leagueId: ""} : m);
          // 同時更新參與此聯賽的球員
          const newPlayers = prev.players.map(p => ({
            ...p,
            participatingLeagueIds: p.participatingLeagueIds.filter(id => id !== leagueId)
          }));
          return { ...prev, leagues: newLeagues, matches: newMatches, players: newPlayers };
        });
          addToast({
          title: "刪除成功",
          message: `聯賽已刪除`,
          type: "success"
        });
      } catch (error) {
        console.error('刪除聯賽時出錯：', error);
        addToast({
          type: "error",
          title: "刪除失敗",
          message: error instanceof Error ? error.message : "發生未知錯誤",
        });
      }
    });
  };

  const handleAddTeam = () => {
    setEditingTeam(undefined);
    setIsTeamModalOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setIsTeamModalOpen(true);
  };

  const handleTeamFormSubmit = async (data: any) => {
    try {
      const teamData = data as Team;
      let updatedTeam;
      
      if (editingTeam) {
        // 更新球隊
        const response = await updateTeam(editingTeam.id, teamData, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (response.data) {
          updatedTeam = response.data;          addToast({
            title: "更新成功",
            message: `球隊「${updatedTeam.name}」已更新`,
            type: "success"
          });
        }
      } else {
        // 創建新球隊
        const response = await createTeam(teamData, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (response.data) {
          updatedTeam = response.data;          addToast({
            title: "創建成功",
            message: `球隊「${updatedTeam.name}」已添加`,
            type: "success"
          });
        }
      }
      
      // 更新本地狀態
      if (updatedTeam) {
        setAppData(prev => ({
          ...prev,
          teams: editingTeam
            ? prev.teams.map(t => t.id === editingTeam.id ? updatedTeam : t)
            : [...prev.teams, updatedTeam],
        }));
      }
      
      setIsTeamModalOpen(false);
      setEditingTeam(undefined);
        } catch (error) {
      console.error('處理球隊表單提交時出錯：', error);
      addToast({
        type: "error",
        title: "操作失敗",
        message: error instanceof Error ? error.message : "發生未知錯誤",
      });
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    onOpenConfirmDialog("確認刪除球隊", `您確定要刪除此對手球隊嗎？相關比賽的對手資訊將會遺失。`, async () => {
      try {
        const response = await deleteTeam(teamId, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // 從本地狀態中移除
        setAppData(prev => {
          const newTeams = prev.teams.filter(t => t.id !== teamId);
          // 同時更新參考此隊伍的比賽
          const newMatches = prev.matches.map(m => 
            m.opponentTeamId === teamId ? {...m, opponentTeamId: ""} : m
          );
          return { ...prev, teams: newTeams, matches: newMatches };
        });
          addToast({
          title: "刪除成功",
          message: `球隊已刪除`,
          type: "success"
        });
      } catch (error) {
        console.error('刪除球隊時出錯：', error);
        addToast({
          type: "error",
          title: "刪除失敗",
          message: error instanceof Error ? error.message : "發生未知錯誤",
        });
      }
    });
  };
  
  const isActionDisabled = currentUserRole === USER_ROLES.PLAYER || currentUserRole === USER_ROLES.GUEST;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#1d3557] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M18 8a5 5 0 0 0-10 0v4a5 5 0 0 0 10 0V8Z"></path>
            <path d="M10 8v4a3 3 0 1 0 6 0V8a5 5 0 0 0-10 0v4a7 7 0 1 0 14 0V8h-2"></path>
          </svg>
          聯賽管理 <span className="text-xl text-[#457b9d] ml-2">{globalGroupIndicator}</span>
        </h2>
      </div>

      <Tabs defaultValue="leagues-content-panel">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#f1faee] p-1 rounded-lg border border-[#457b9d]/20">
          <TabsTrigger value="leagues-content-panel" className="data-[state=active]:bg-[#1d3557] data-[state=active]:text-[#f1faee]">聯賽管理</TabsTrigger>
          <TabsTrigger value="teams-content-panel" className="data-[state=active]:bg-[#1d3557] data-[state=active]:text-[#f1faee]">對手球隊管理</TabsTrigger>
        </TabsList>

        <TabsContent value="leagues-content-panel">
          <Card className="shadow-lg bg-white border border-[#457b9d]/20 overflow-hidden">
            <CardContent className="p-4 md:p-6">
              {!isActionDisabled && (
                <Dialog open={isLeagueModalOpen} onOpenChange={setIsLeagueModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddLeague} className="mb-4 bg-[#1d3557] hover:bg-[#457b9d] text-white shadow-md transition-colors duration-200">
                      <PlusCircle className="mr-2 h-5 w-5" /> 新增聯賽
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingLeague ? '編輯聯賽' : '新增聯賽'}</DialogTitle>
                    </DialogHeader>
                    <LeagueForm onSubmit={handleLeagueFormSubmit} initialData={editingLeague} userRole={currentUserRole} />
                  </DialogContent>
                </Dialog>
              )}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#f1faee]">
                    <TableRow>
                      <TableHead className="text-[#1d3557] font-semibold">聯賽名稱</TableHead>
                      <TableHead className="text-[#1d3557] font-semibold">組別-級別U</TableHead>
                      <TableHead className="text-[#1d3557] font-semibold">比賽賽制</TableHead>
                      <TableHead className="text-[#1d3557] font-semibold">備註</TableHead>
                      {!isActionDisabled && <TableHead className="text-right text-[#1d3557] font-semibold">操作</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeagues.map((league) => (
                      <TableRow key={league.id} className="hover:bg-[#f8f9fa] border-b border-[#e9ecef]">
                        <TableCell className="font-medium text-[#1d3557]">{league.name}</TableCell>
                        <TableCell>{league.group} - {league.levelU}</TableCell>
                        <TableCell>{league.format}</TableCell>
                        <TableCell>{league.notes}</TableCell>
                        {!isActionDisabled && (
                          <TableCell className="text-right">
                             <div className="flex justify-end space-x-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEditLeague(league)} className="hover:text-[#457b9d] hover:bg-[#f1faee] transition-colors duration-200">
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteLeague(league.id)} className="hover:text-[#e63946] hover:bg-[#f1faee] transition-colors duration-200">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredLeagues.length === 0 && <p className="text-center text-[#6c757d] py-4">無符合條件的聯賽。</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams-content-panel">
          <Card className="shadow-lg bg-white border border-[#457b9d]/20 overflow-hidden">
            <CardContent className="p-4 md:p-6">
              {!isActionDisabled && (
                <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddTeam} className="mb-4 bg-[#1d3557] hover:bg-[#457b9d] text-white shadow-md transition-colors duration-200">
                     <PlusCircle className="mr-2 h-5 w-5" /> 新增對手球隊
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingTeam ? '編輯對手球隊' : '新增對手球隊'}</DialogTitle>
                    </DialogHeader>
                    <TeamForm onSubmit={handleTeamFormSubmit} initialData={editingTeam} userRole={currentUserRole} />
                  </DialogContent>
                </Dialog>
              )}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#f1faee]">
                    <TableRow>
                      <TableHead className="text-[#1d3557] font-semibold">球隊名稱</TableHead>
                      <TableHead className="text-[#1d3557] font-semibold">對戰筆記</TableHead>
                      {!isActionDisabled && <TableHead className="text-right text-[#1d3557] font-semibold">操作</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appData.teams.map((team) => (
                      <TableRow key={team.id} className="hover:bg-[#f8f9fa] border-b border-[#e9ecef]">
                        <TableCell className="font-medium text-[#1d3557]">{team.name}</TableCell>
                        <TableCell>{team.notes}</TableCell>
                        {!isActionDisabled && (
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEditTeam(team)} className="hover:text-[#457b9d] hover:bg-[#f1faee] transition-colors duration-200">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteTeam(team.id)} className="hover:text-[#e63946] hover:bg-[#f1faee] transition-colors duration-200">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {appData.teams.length === 0 && <p className="text-center text-[#6c757d] py-4">無球隊資料。</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
