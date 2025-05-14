"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import type * as z from "zod";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Player, MatchRosterItem, PlayerMatchStats, UserRole } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form"; // Import main Form component

interface PlayerStatsInput {
  playerId: string;
  playerName: string; // For display
  playerPosition: string; // For display
  goals: number;
  assists: number;
  yellow: number;
  red: number;
}

interface MatchStatsFormValues {
  matchId: string;
  playersStats: PlayerStatsInput[];
}

interface MatchStatsFormProps {
  matchId: string;
  rosteredPlayersWithDetails: Array<Player & { position: string }>; // Players in roster with their assigned position
  initialStats: { [playerId: string]: PlayerMatchStats };
  onSubmit: (matchId: string, stats: { [playerId: string]: PlayerMatchStats }) => void;
  userRole: UserRole;
}

export function MatchStatsForm({
  matchId,
  rosteredPlayersWithDetails,
  initialStats,
  onSubmit,
  userRole
}: MatchStatsFormProps) {
  const form = useForm<MatchStatsFormValues>({
    defaultValues: {
      matchId: matchId,
      playersStats: rosteredPlayersWithDetails.map(player => {
        const playerStat = initialStats[player.id] || { goals: 0, assists: 0, yellow: 0, red: 0 };
        return {
          playerId: player.id,
          playerName: player.name,
          playerPosition: player.position,
          goals: playerStat.goals,
          assists: playerStat.assists,
          yellow: playerStat.yellow,
          red: playerStat.red,
        };
      }),
    },
  });
  
  const { fields } = useFieldArray({
    control: form.control,
    name: "playersStats",
  });

  const handleSubmit = (data: MatchStatsFormValues) => {
    const processedStats: { [playerId: string]: PlayerMatchStats } = {};
    data.playersStats.forEach(ps => {
      processedStats[ps.playerId] = {
        goals: Number(ps.goals) || 0,
        assists: Number(ps.assists) || 0,
        yellow: Number(ps.yellow) || 0,
        red: Number(ps.red) || 0,
      };
    });
    onSubmit(data.matchId, processedStats);
  };

  const isReadOnly = userRole === 'player' || userRole === 'guest';

  if (rosteredPlayersWithDetails.length === 0) {
    return <p className="text-muted-foreground text-center py-4">此比賽尚無球員陣容，請先設定陣容。</p>;
  }

  return (
    <Form {...form}> {/* Wrap with ShadCN Form for context */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ScrollArea className="h-[350px] border rounded-md p-1">
          <div className="space-y-3 p-3">
            {fields.map((item, index) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-3 bg-muted/50 border-b">
                  <CardTitle className="text-sm font-medium">
                    {item.playerName} <span className="text-xs text-muted-foreground">({item.playerPosition})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                  {(['goals', 'assists', 'yellow', 'red'] as const).map((statName) => (
                    <div key={statName} className="space-y-1">
                      <Label htmlFor={`stats-${item.playerId}-${statName}`} className="text-xs">
                        { {goals: '進球', assists: '助攻', yellow: '黄牌', red: '紅牌'}[statName] }:
                      </Label>
                      <Controller
                        name={`playersStats.${index}.${statName}`}
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            id={`stats-${item.playerId}-${statName}`}
                            type="number"
                            min="0"
                            className="h-8 text-sm"
                            {...field}
                            value={field.value || 0} // Ensure value is not undefined
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                            readOnly={isReadOnly}
                          />
                        )}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        {!isReadOnly && (
          <Button type="submit" className="w-full">儲存數據</Button>
        )}
      </form>
    </Form>
  );
}
