"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Player, League, UserRole, AppData } from '@/lib/types';
import { PlayerForm } from '@/components/forms/player-form';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

interface PlayersSectionProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  currentUserRole: UserRole;
  onOpenConfirmDialog: (title: string, description: string, onConfirm: () => void) => void;
  filteredPlayers: Player[]; // Players filtered by global filters
  globalGroupIndicator: string;
}

export function PlayersSection({
  appData,
  setAppData,
  currentUserRole,
  onOpenConfirmDialog,
  filteredPlayers,
  globalGroupIndicator,
}: PlayersSectionProps) {
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>(undefined);

  const handleAddPlayer = () => {
    setEditingPlayer(undefined);
    setIsPlayerModalOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsPlayerModalOpen(true);
  };

  const handlePlayerFormSubmit = (data: any) => {
    const playerData = data as Player;
     // Derive group/levelU from first participating league if not directly set
    let group = playerData.group;
    let levelU = playerData.levelU;
    if (playerData.participatingLeagueIds && playerData.participatingLeagueIds.length > 0) {
        const firstLeagueId = playerData.participatingLeagueIds[0];
        const league = appData.leagues.find(l => l.id === firstLeagueId);
        if (league) {
            group = league.group;
            levelU = league.levelU;
        }
    }
    
    const completePlayerData = { ...playerData, group, levelU };

    if (editingPlayer) {
      setAppData(prev => ({
        ...prev,
        players: prev.players.map(p => p.id === editingPlayer.id ? { ...completePlayerData, id: editingPlayer.id } : p),
      }));
    } else {
      setAppData(prev => ({
        ...prev,
        players: [...prev.players, { ...completePlayerData, id: `player_${Date.now()}` }],
      }));
    }
    setIsPlayerModalOpen(false);
    setEditingPlayer(undefined);
  };

  const handleDeletePlayer = (playerId: string) => {
     onOpenConfirmDialog("確認刪除球員", `您確定要刪除此球員嗎？此操作無法復原。`, () => {
        setAppData(prev => ({
            ...prev,
            players: prev.players.filter(p => p.id !== playerId),
            // Also remove player from rosters and stats
            matchRosters: Object.entries(prev.matchRosters).reduce((acc, [matchId, roster]) => {
                acc[matchId] = roster.filter(r => r.playerId !== playerId);
                return acc;
            }, {} as typeof prev.matchRosters),
            matches: prev.matches.map(match => ({
                ...match,
                stats: Object.fromEntries(Object.entries(match.stats).filter(([pId]) => pId !== playerId))
            }))
        }));
    });
  };

  const isActionDisabled = currentUserRole === 'player' || currentUserRole === 'guest';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary">
          球員管理 <span className="text-xl text-secondary">{globalGroupIndicator}</span>
        </h2>
        {!isActionDisabled && (
          <Dialog open={isPlayerModalOpen} onOpenChange={setIsPlayerModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddPlayer} className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-5 w-5" /> 新增球員
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingPlayer ? '編輯球員' : '新增球員'}</DialogTitle>
              </DialogHeader>
              <PlayerForm
                leagues={appData.leagues} // Pass all leagues for selection
                onSubmit={handlePlayerFormSubmit}
                initialData={editingPlayer}
                userRole={currentUserRole}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>球員姓名</TableHead>
                  <TableHead>參加聯賽</TableHead>
                  <TableHead>可能位置</TableHead>
                  <TableHead>受傷</TableHead>
                  <TableHead>備註</TableHead>
                  {!isActionDisabled && <TableHead className="text-right">操作</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {player.participatingLeagueIds.map(leagueId => {
                          const league = appData.leagues.find(l => l.id === leagueId);
                          return league ? <Badge key={leagueId} variant="secondary" className="text-xs">{league.name}</Badge> : null;
                        })}
                        {player.participatingLeagueIds.length === 0 && '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {player.positions.map(pos => <Badge key={pos} variant="outline" className="text-xs">{pos}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell>{player.injured}</TableCell>
                    <TableCell className="max-w-xs truncate">{player.notes}</TableCell>
                    {!isActionDisabled && (
                      <TableCell className="text-right">
                         <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditPlayer(player)} className="hover:text-primary">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePlayer(player.id)} className="hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredPlayers.length === 0 && <p className="text-center text-muted-foreground py-4">無符合條件的球員。</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
