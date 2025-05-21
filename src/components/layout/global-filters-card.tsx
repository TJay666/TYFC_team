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
    <Card className="mb-6 shadow-lg bg-gradient-to-br from-white to-[#f1faee]/50 border border-[#457b9d]/20 overflow-hidden rounded-xl">
      <CardHeader className="bg-[#1d3557] border-b border-[#1d3557]/10 py-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          全域篩選
        </CardTitle>
      </CardHeader>
      <CardContent className="py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="global-group-filter" className="text-[#1d3557] font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              組別
            </Label>
            <Select value={selectedGroup} onValueChange={handleGroupChange}>
              <SelectTrigger id="global-group-filter" className="border-[#457b9d]/30 focus:ring-[#457b9d]/30 bg-white/90 hover:bg-white transition-colors">
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
            <Label htmlFor="global-level-filter" className="text-[#1d3557] font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              級別U
            </Label>            <Select value={selectedLevelU} onValueChange={handleLevelUChange} disabled={selectedGroup === "all" && availableLevelUOptions.length === 0}>
              <SelectTrigger id="global-level-filter" className="border-[#457b9d]/30 focus:ring-[#457b9d]/30 bg-white/90 hover:bg-white transition-colors">
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
        
        <div className="mt-4 pt-3 border-t border-[#457b9d]/10 text-xs text-[#1d3557]/70 flex justify-between items-center">
          <span>當前篩選: {selectedGroup === "all" ? "所有組別" : selectedGroup}{selectedLevelU === "all" ? "" : ` - ${selectedLevelU}`}</span>
          <span className="text-xs bg-[#457b9d]/10 px-2 py-1 rounded-md">使用篩選器來縮小數據範圍</span>
        </div>
      </CardContent>
    </Card>
  );
}
