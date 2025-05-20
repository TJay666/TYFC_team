"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Player, League, AppData } from '@/lib/types';
import { USER_ROLES } from '@/lib/types';
import { PlayerForm } from '@/components/forms/player-form';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from "@/hooks/use-toast";

// 導入API服務
import {
  createPlayer,
  updatePlayer,
  deletePlayer,
  updatePlayerLeagues
} from '@/lib/api/players-api';

interface PlayersSectionProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  currentUserRole: typeof USER_ROLES[keyof typeof USER_ROLES];
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
  const { authToken } = useAuth();
  const { toast } = useToast();
  
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

  const handlePlayerFormSubmit = async (data: any) => {
    try {
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
      let updatedPlayer;
      
      if (editingPlayer) {
        // 更新球員
        const response = await updatePlayer(editingPlayer.id, completePlayerData, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (response.data) {
          updatedPlayer = response.data;
          
          // 更新球員參與的聯賽
          if (playerData.participatingLeagueIds && playerData.participatingLeagueIds.length > 0) {
            const leagueResponse = await updatePlayerLeagues(
              updatedPlayer.id, 
              playerData.participatingLeagueIds, 
              authToken || undefined
            );
            
            if (leagueResponse.error) {
              console.warn('更新球員聯賽時出錯：', leagueResponse.error);
            }
          }
          
          toast({
            title: "更新成功",
            description: `球員「${updatedPlayer.name}」已更新`,
          });
        }
      } else {
        // 創建新球員
        const response = await createPlayer(completePlayerData, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (response.data) {
          updatedPlayer = response.data;
          
          // 設定球員參與的聯賽
          if (playerData.participatingLeagueIds && playerData.participatingLeagueIds.length > 0) {
            const leagueResponse = await updatePlayerLeagues(
              updatedPlayer.id, 
              playerData.participatingLeagueIds, 
              authToken || undefined
            );
            
            if (leagueResponse.error) {
              console.warn('設定球員聯賽時出錯：', leagueResponse.error);
            }
          }
          
          toast({
            title: "創建成功",
            description: `球員「${updatedPlayer.name}」已添加`,
          });
        }
      }
      
      // 更新本地狀態
      if (updatedPlayer) {
        setAppData(prev => ({
          ...prev,
          players: editingPlayer
            ? prev.players.map(p => p.id === editingPlayer.id ? updatedPlayer : p)
            : [...prev.players, updatedPlayer],
        }));
      }
      
      setIsPlayerModalOpen(false);
      setEditingPlayer(undefined);
    } catch (error) {
      console.error('處理球員表單提交時出錯：', error);
      toast({
        variant: "destructive",
        title: "操作失敗",
        description: error instanceof Error ? error.message : "發生未知錯誤",
      });
    }
  };

  const handleDeletePlayer = (playerId: string) => {
    onOpenConfirmDialog("確認刪除球員", `您確定要刪除此球員嗎？此操作無法復原。`, async () => {
      try {
        const response = await deletePlayer(playerId, authToken || undefined);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // 從本地狀態中移除
        setAppData(prev => ({
          ...prev,
          players: prev.players.filter(p => p.id !== playerId),
          // 同時從名單和統計數據中移除該球員
          matchRosters: Object.entries(prev.matchRosters).reduce((acc, [matchId, roster]) => {
            acc[matchId] = roster.filter(r => r.playerId !== playerId);
            return acc;
          }, {} as typeof prev.matchRosters),
          matches: prev.matches.map(match => ({
            ...match,
            stats: Object.fromEntries(Object.entries(match.stats || {}).filter(([pId]) => pId !== playerId))
          }))
        }));
        
        toast({
          title: "刪除成功",
          description: `球員已刪除`,
        });
      } catch (error) {
        console.error('刪除球員時出錯：', error);
        toast({
          variant: "destructive",
          title: "刪除失敗",
          description: error instanceof Error ? error.message : "發生未知錯誤",
        });
      }
    });
  };

  const isActionDisabled = currentUserRole === USER_ROLES.PLAYER || currentUserRole === USER_ROLES.GUEST;

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
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingPlayer ? '編輯球員' : '新增球員'}</DialogTitle>
              </DialogHeader>
              <PlayerForm 
                onSubmit={handlePlayerFormSubmit} 
                initialData={editingPlayer} 
                userRole={currentUserRole}
                leagues={appData.leagues}
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
                  <TableHead>姓名</TableHead>
                  <TableHead>號碼</TableHead>
                  <TableHead>位置</TableHead>
                  <TableHead>參與聯賽</TableHead>
                  <TableHead>狀態</TableHead>
                  {!isActionDisabled && <TableHead className="text-right">操作</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.id.split('_')[1] || '-'}</TableCell>
                    <TableCell>{player.positions && player.positions.length > 0 ? player.positions[0] : '-'}</TableCell>
                    <TableCell>
                      {player.participatingLeagueIds?.map(leagueId => {
                        const league = appData.leagues.find(l => l.id === leagueId);
                        return league ? (
                          <Badge key={leagueId} variant="secondary" className="mr-1 mb-1">
                            {league.name}
                          </Badge>
                        ) : null;
                      })}
                    </TableCell>
                    <TableCell>
                      {player.injured === '是' && (
                        <Badge variant="destructive">受傷</Badge>
                      )}
                    </TableCell>
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
