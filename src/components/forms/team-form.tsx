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
import { Textarea } from "@/components/ui/textarea";
import { TeamSchema } from "@/lib/schemas";
import type { Team, UserRole } from "@/lib/types";

interface TeamFormProps {
  onSubmit: (data: z.infer<typeof TeamSchema>) => void;
  initialData?: Partial<Team>;
  userRole: UserRole;
}

export function TeamForm({ onSubmit, initialData, userRole }: TeamFormProps) {
  const form = useForm<z.infer<typeof TeamSchema>>({
    resolver: zodResolver(TeamSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || "",
      notes: initialData?.notes || "",
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
              <FormLabel>球隊名稱</FormLabel>
              <FormControl>
                <Input {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>對戰筆記</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} readOnly={isReadOnly} />
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
