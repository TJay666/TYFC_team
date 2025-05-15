
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
  // FormLabel, // No longer needed here as Label is imported directly
} from "@/components/ui/form";
import { Label } from "@/components/ui/label"; 
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
import { CheckCircle2, XCircle } from "lucide-react"; // For availability icons

interface MatchRosterFormValues {
  matchId: string;
  roster: Array<{
    playerId: string;
    playerName: string; // For display
    selected: boolean;
    position: string;
    isAvailable?: boolean; // For display
  }>;
}

interface MatchRosterFormProps {
  matchId: string;
  availablePlayers: Player[]; 
  initialRoster: MatchRosterItem[];
  onSubmit: (data: z.infer<typeof MatchRosterSchema>) => void;
  userRole: UserRole;
  matchAvailabilityForCurrentMatch?: { [playerId: string]: boolean }; // Added
}

export function MatchRosterForm({
  matchId,
  availablePlayers,
  initialRoster,
  onSubmit,
  userRole,
  matchAvailabilityForCurrentMatch
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
          isAvailable: matchAvailabilityForCurrentMatch?.[player.id] // Set availability
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
              <div key={item.id} className="flex items-center space-x-2 p-2 border-b">
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
                <Label htmlFor={`roster-select-${item.playerId}`} className="flex-grow flex items-center">
                  {item.playerName}
                  {item.isAvailable === true && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" title="可出席" />}
                  {item.isAvailable === false && <XCircle className="ml-2 h-4 w-4 text-red-500" title="無法出席"/>}
                  {item.isAvailable === undefined && <span className="ml-2 text-xs text-muted-foreground">(未表態)</span>}
                </Label>
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
                        <SelectTrigger className="w-[150px] text-xs">
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
             {fields.length === 0 && <p className="text-center text-muted-foreground py-4">無符合資格的球員可加入此比賽陣容。</p>}
          </div>
        </ScrollArea>
        {!isReadOnly && (
           <Button type="submit" className="w-full">儲存陣容</Button>
        )}
      </form>
    </Form>
  );
}
