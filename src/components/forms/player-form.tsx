"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { PlayerSchema } from "@/lib/schemas";
import type { Player, League, UserRole } from "@/lib/types";
import { playerPositionOptions } from "@/lib/types";

interface PlayerFormProps {
  leagues: League[];
  onSubmit: (data: z.infer<typeof PlayerSchema>) => void;
  initialData?: Partial<Player>;
  userRole: UserRole;
}

export function PlayerForm({ leagues, onSubmit, initialData, userRole }: PlayerFormProps) {
  const form = useForm<z.infer<typeof PlayerSchema>>({
    resolver: zodResolver(PlayerSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || "",
      positions: initialData?.positions || [],
      injured: initialData?.injured || "否",
      notes: initialData?.notes || "",
      participatingLeagueIds: initialData?.participatingLeagueIds || [],
    },
  });

  const isReadOnly = userRole === 'player' || userRole === 'guest';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>球員姓名</FormLabel>
              <FormControl>
                <Input {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="positions"
          render={() => (
            <FormItem>
              <FormLabel>可能位置</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {playerPositionOptions.map((position) => (
                  <FormField
                    key={position}
                    control={form.control}
                    name="positions"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(position)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), position])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== position
                                      )
                                    );
                              }}
                              disabled={isReadOnly}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {position}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="injured"
          render={({ field }) => (
            <FormItem>
              <FormLabel>受傷</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇受傷狀態" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="否">否</SelectItem>
                  <SelectItem value="是">是</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備註</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="participatingLeagueIds"
          render={() => (
            <FormItem>
              <FormLabel>參加聯賽</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {leagues.map((league) => (
                  <FormField
                    key={league.id}
                    control={form.control}
                    name="participatingLeagueIds"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(league.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), league.id])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== league.id
                                      )
                                    );
                              }}
                              disabled={isReadOnly}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {league.name} ({league.group} - {league.levelU})
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
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
