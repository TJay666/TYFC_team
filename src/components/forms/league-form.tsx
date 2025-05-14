"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import React, { useEffect, useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { LeagueSchema } from "@/lib/schemas";
import type { League, AgeGroup, UserRole } from "@/lib/types";
import { ageGroups, levelOptions } from "@/lib/types";


interface LeagueFormProps {
  onSubmit: (data: z.infer<typeof LeagueSchema>) => void;
  initialData?: Partial<League>;
  userRole: UserRole;
}

export function LeagueForm({ onSubmit, initialData, userRole }: LeagueFormProps) {
  const [currentLevelUOptions, setCurrentLevelUOptions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof LeagueSchema>>({
    resolver: zodResolver(LeagueSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || "",
      group: initialData?.group as Exclude<AgeGroup, "all"> | undefined,
      levelU: initialData?.levelU || "",
      format: initialData?.format || "",
      notes: initialData?.notes || "",
    },
  });

  const selectedGroup = form.watch("group");

  useEffect(() => {
    if (selectedGroup && selectedGroup !== "all") {
      setCurrentLevelUOptions(levelOptions[selectedGroup as Exclude<AgeGroup, "all">] || []);
      if (initialData?.group !== selectedGroup) { // Reset levelU if group changes from initial
         form.setValue("levelU", "");
      }
    } else {
      setCurrentLevelUOptions([]);
      form.setValue("levelU", "");
    }
  }, [selectedGroup, form, initialData?.group]);
  
  // Set initial levelU options if initialData is present
   useEffect(() => {
    if (initialData?.group && initialData.group !== "all") {
      setCurrentLevelUOptions(levelOptions[initialData.group as Exclude<AgeGroup, "all">] || []);
      // form.setValue("levelU", initialData.levelU || ""); // This is handled by defaultValues
    }
  }, [initialData, form]);


  const isReadOnly = userRole === 'player' || userRole === 'guest';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>聯賽名稱</FormLabel>
              <FormControl>
                <Input {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="group"
          render={({ field }) => (
            <FormItem>
              <FormLabel>組別</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value as Exclude<AgeGroup, "all">);
                }} 
                defaultValue={field.value} 
                disabled={isReadOnly}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇組別" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ageGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
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
          name="levelU"
          render={({ field }) => (
            <FormItem>
              <FormLabel>級別U</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value} // Controlled component
                disabled={isReadOnly || !selectedGroup || currentLevelUOptions.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedGroup ? "請先選擇組別" : "請選擇級別U"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currentLevelUOptions.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
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
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比賽賽制</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇比賽賽制" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5人制">5人制</SelectItem>
                  <SelectItem value="8人制">8人制</SelectItem>
                  <SelectItem value="11人制">11人制</SelectItem>
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
        {!isReadOnly && (
          <Button type="submit" className="w-full">儲存</Button>
        )}
      </form>
    </Form>
  );
}
