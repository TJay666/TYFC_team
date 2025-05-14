"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MatchSchema } from "@/lib/schemas";
import type { League, Team, Match, UserRole } from "@/lib/types";

interface MatchFormProps {
  leagues: League[];
  teams: Team[];
  onSubmit: (data: z.infer<typeof MatchSchema>) => void;
  initialData?: Partial<Match>;
  userRole: UserRole;
}

export function MatchForm({ leagues, teams, onSubmit, initialData, userRole }: MatchFormProps) {
  const form = useForm<z.infer<typeof MatchSchema>>({
    resolver: zodResolver(MatchSchema),
    defaultValues: {
      id: initialData?.id,
      date: initialData?.date || "",
      startTime: initialData?.startTime || "",
      durationMinutes: initialData?.durationMinutes || 90,
      leagueId: initialData?.leagueId || "",
      opponentTeamId: initialData?.opponentTeamId || "",
      location: initialData?.location || "",
    },
  });

  const isReadOnly = userRole === 'player' || userRole === 'guest';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比賽日期</FormLabel>
              <FormControl>
                <Input type="date" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比賽時間 (HH:MM)</FormLabel>
              <FormControl>
                <Input type="time" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="durationMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比賽時長 (分鐘)</FormLabel>
              <FormControl>
                <Input type="number" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="leagueId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>聯賽</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇聯賽" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leagues.map((league) => (
                    <SelectItem key={league.id} value={league.id}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="opponentTeamId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>對手球隊</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇對手球隊" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比賽地點 (地址)</FormLabel>
              <FormControl>
                <Input placeholder="例如：桃園市中壢區青埔路一段123號 青埔足球場" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isReadOnly && (
          <Button type="submit" className="w-full">儲存</Button>
        )}
      </form>
    </Form>
  );
}
