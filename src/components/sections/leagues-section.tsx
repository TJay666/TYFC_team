"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { League, Team, UserRole, AppData } from '@/lib/types';
import { LeagueForm } from '@/components/forms/league-form';
import { TeamForm } from '@/components/forms/team-form';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

interface LeaguesSectionProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  currentUserRole: UserRole;
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
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<League | undefined>(undefined);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);

  const handleAddLeague = () => {
    setEditingLeague(undefined);
    setIsLeagueModalOpen(true);
  };

  const handleEditLeague = (league: League) => {
    setEditingLeague(league);
    setIsLeagueModalOpen(true);
  };

  const handleLeagueFormSubmit = (data: any) => {
    const leagueData = data as League;
    if (editingLeague) {
      setAppData(prev => ({
        ...prev,
        leagues: prev.leagues.map(l => l.id === editingLeague.id ? { ...leagueData, id: editingLeague.id } : l),
      }));
    } else {
      setAppData(prev => ({
        ...prev,
        leagues: [...prev.leagues, { ...leagueData, id: `league_${Date.now()}` }],
      }));
    }
    setIsLeagueModalOpen(false);
    setEditingLeague(undefined);
  };

  const handleDeleteLeague = (leagueId: string) => {
     onOpenConfirmDialog("確認刪除聯賽", `您確定要刪除此聯賽嗎？相關比賽的聯賽資訊將會遺失。`, () => {
        setAppData(prev => {
            const newLeagues = prev.leagues.filter(l => l.id !== leagueId);
            // Also update matches that reference this league (optional: or prevent deletion if in use)
            const newMatches = prev.matches.map(m => m.leagueId === leagueId ? {...m, leagueId: ""} : m);
             // Also update players participating in this league
            const newPlayers = prev.players.map(p => ({
                ...p,
                participatingLeagueIds: p.participatingLeagueIds.filter(id => id !== leagueId)
            }));
            return { ...prev, leagues: newLeagues, matches: newMatches, players: newPlayers };
        });
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

  const handleTeamFormSubmit = (data: any) => {
    const teamData = data as Team;
    if (editingTeam) {
      setAppData(prev => ({
        ...prev,
        teams: prev.teams.map(t => t.id === editingTeam.id ? { ...teamData, id: editingTeam.id } : t),
      }));
    } else {
      setAppData(prev => ({
        ...prev,
        teams: [...prev.teams, { ...teamData, id: `team_${Date.now()}` }],
      }));
    }
    setIsTeamModalOpen(false);
    setEditingTeam(undefined);
  };

  const handleDeleteTeam = (teamId: string) => {
    onOpenConfirmDialog("確認刪除球隊", `您確定要刪除此對手球隊嗎？相關比賽的對手資訊將會遺失。`, () => {
        setAppData(prev => {
            const newTeams = prev.teams.filter(t => t.id !== teamId);
            const newMatches = prev.matches.map(m => m.opponentTeamId === teamId ? {...m, opponentTeamId: ""} : m);
            return { ...prev, teams: newTeams, matches: newMatches };
        });
    });
  };
  
  const isActionDisabled = currentUserRole === 'player' || currentUserRole === 'guest';

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-6">
        聯賽及球隊管理 <span className="text-xl text-secondary">{globalGroupIndicator}</span>
      </h2>

      <Tabs defaultValue="leagues-content-panel" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="leagues-content-panel">聯賽管理</TabsTrigger>
          <TabsTrigger value="teams-content-panel">對手球隊管理</TabsTrigger>
        </TabsList>

        <TabsContent value="leagues-content-panel">
          <Card className="shadow-lg">
            <CardContent className="p-4 md:p-6">
              {!isActionDisabled && (
                <Dialog open={isLeagueModalOpen} onOpenChange={setIsLeagueModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddLeague} className="mb-4 bg-primary hover:bg-primary/90">
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
                  <TableHeader>
                    <TableRow>
                      <TableHead>聯賽名稱</TableHead>
                      <TableHead>組別-級別U</TableHead>
                      <TableHead>比賽賽制</TableHead>
                      <TableHead>備註</TableHead>
                      {!isActionDisabled && <TableHead className="text-right">操作</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeagues.map((league) => (
                      <TableRow key={league.id}>
                        <TableCell>{league.name}</TableCell>
                        <TableCell>{league.group} - {league.levelU}</TableCell>
                        <TableCell>{league.format}</TableCell>
                        <TableCell>{league.notes}</TableCell>
                        {!isActionDisabled && (
                          <TableCell className="text-right">
                             <div className="flex justify-end space-x-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEditLeague(league)} className="hover:text-primary">
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteLeague(league.id)} className="hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 {filteredLeagues.length === 0 && <p className="text-center text-muted-foreground py-4">無符合條件的聯賽。</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams-content-panel">
          <Card className="shadow-lg">
            <CardContent className="p-4 md:p-6">
              {!isActionDisabled && (
                <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddTeam} className="mb-4 bg-primary hover:bg-primary/90">
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
                  <TableHeader>
                    <TableRow>
                      <TableHead>球隊名稱</TableHead>
                      <TableHead>對戰筆記</TableHead>
                     {!isActionDisabled && <TableHead className="text-right">操作</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appData.teams.map((team) => ( // Teams are not globally filtered in the original HTML
                      <TableRow key={team.id}>
                        <TableCell>{team.name}</TableCell>
                        <TableCell>{team.notes}</TableCell>
                        {!isActionDisabled && (
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEditTeam(team)} className="hover:text-primary">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteTeam(team.id)} className="hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {appData.teams.length === 0 && <p className="text-center text-muted-foreground py-4">無球隊資料。</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
