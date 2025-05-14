"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AgeGroup } from "@/lib/types";
import { ageGroups, levelOptions } from "@/lib/types";
import React from "react";

interface GlobalFiltersCardProps {
  selectedGroup: AgeGroup | "all";
  selectedLevelU: string;
  onGroupChange: (group: AgeGroup | "all") => void;
  onLevelUChange: (levelU: string) => void;
  availableLevelUOptions: string[];
}

export function GlobalFiltersCard({ 
  selectedGroup, 
  selectedLevelU, 
  onGroupChange, 
  onLevelUChange,
  availableLevelUOptions
}: GlobalFiltersCardProps) {
  
  const handleGroupChange = (value: string) => {
    onGroupChange(value as AgeGroup | "all");
  };

  const handleLevelUChange = (value: string) => {
    onLevelUChange(value);
  };

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">全域篩選</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="global-group-filter">組別</Label>
            <Select value={selectedGroup} onValueChange={handleGroupChange}>
              <SelectTrigger id="global-group-filter">
                <SelectValue placeholder="所有組別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有組別</SelectItem>
                {ageGroups.map((group) => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="global-level-filter">級別U</Label>
            <Select value={selectedLevelU} onValueChange={handleLevelUChange} disabled={selectedGroup === "all" && availableLevelUOptions.length === 0}>
              <SelectTrigger id="global-level-filter">
                <SelectValue placeholder="所有級別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有級別</SelectItem>
                {availableLevelUOptions.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
