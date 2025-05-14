"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import type * as z from "zod";
import React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MatchRosterSchema } from "@/lib/schemas";
import type { Player, MatchRosterItem, UserRole } from "@/lib/types";
import { playerPositionOptions } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MatchRosterFormValues {
  matchId: string;
  roster: Array<{
    playerId: string;
    playerName: string; // For display
    selected: boolean;
    position: string;
  }>;
}

interface MatchRosterFormProps {
  matchId: string;
  availablePlayers: Player[]; // Players eligible for this match's group/level
  initialRoster: MatchRosterItem[];
  onSubmit: (data: z.infer<typeof MatchRosterSchema>) => void;
  userRole: UserRole;
}

export function MatchRosterForm({
  matchId,
  availablePlayers,
  initialRoster,
  onSubmit,
  userRole
}: MatchRosterFormProps) {
  const form = useForm<MatchRosterFormValues>({
    defaultValues: {
      matchId: matchId,
      roster: availablePlayers.map(player => {
        const rosteredPlayer = initialRoster.find(rp => rp.playerId === player.id);
        return {
          playerId: player.id,
          playerName: player.name,
          selected: !!rosteredPlayer,
          position: rosteredPlayer?.position || playerPositionOptions[0],
        };
      }),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "roster",
  });

  const handleSubmit = (data: MatchRosterFormValues) => {
    const submittedRoster = data.roster
      .filter(p => p.selected)
      .map(p => ({ playerId: p.playerId, position: p.position }));
    onSubmit({ matchId: data.matchId, roster: submittedRoster });
  };
  
  const isReadOnly = userRole === 'player' || userRole === 'guest';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ScrollArea className="h-[300px] border rounded-md p-4">
          <div className="space-y-3">
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-4 p-2 border-b">
                <Controller
                  name={`roster.${index}.selected`}
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      id={`roster-select-${item.playerId}`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isReadOnly}
                    />
                  )}
                />
                <Label htmlFor={`roster-select-${item.playerId}`} className="flex-grow">{item.playerName}</Label>
                <Controller
                  name={`roster.${index}.position`}
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isReadOnly || !form.watch(`roster.${index}.selected`)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="選擇位置" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {playerPositionOptions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        {!isReadOnly && (
           <Button type="submit" className="w-full">儲存陣容</Button>
        )}
      </form>
    </Form>
  );
}
