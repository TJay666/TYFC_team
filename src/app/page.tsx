
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GlobalFiltersCard } from '@/components/layout/global-filters-card';
import { MatchesSection } from '@/components/sections/matches-section';
import { LeaguesSection } from '@/components/sections/leagues-section';
import { PlayersSection } from '@/components/sections/players-section';
import { StatisticsSection } from '@/components/sections/statistics-section';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { useToast } from "@/hooks/use-toast";
import { initialDb } from '@/lib/data';
import type { UserRole, SectionName, AppData, AgeGroup, Match, League, Player, MatchConflictInfo, MatchConflicts } from '@/lib/types';
import { USER_ROLES, levelOptions } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger as ShadcnTabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, currentUserRole, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [appData, setAppData] = useState<AppData>(initialDb);
  const [activeTab, setActiveTab] = useState<SectionName>('matches');
  
  const [selectedGroup, setSelectedGroup] = useState<AgeGroup | "all">("all");
  const [selectedLevelU, setSelectedLevelU] = useState<string>("all");
  const [availableLevelUOptions, setAvailableLevelUOptions] = useState<string[]>([]);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] = useState({ title: "", description: "", onConfirm: () => {} });

  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (selectedGroup !== "all") {
      setAvailableLevelUOptions(levelOptions[selectedGroup as Exclude<AgeGroup, "all">] || []);
      if (!levelOptions[selectedGroup as Exclude<AgeGroup, "all">]?.includes(selectedLevelU)) {
        setSelectedLevelU("all");
      }
    } else {
      setAvailableLevelUOptions([]); 
      setSelectedLevelU("all");
    }
  }, [selectedGroup, selectedLevelU]);
  
  const handleOpenConfirmDialog = (title: string, description: string, onConfirm: () => void) => {
    setConfirmDialogProps({ title, description, onConfirm });
    setIsConfirmDialogOpen(true);
  };
  
  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleConfirmDialogConfirm = () => {
    confirmDialogProps.onConfirm();
    setIsConfirmDialogOpen(false);
     toast({ title: "操作成功", description: "項目已更新/刪除。" });
  };
  
  const globalGroupIndicatorText = useMemo(() => {
    let text = "";
    if (selectedGroup !== 'all') {
      text += `(${selectedGroup}`;
      if (selectedLevelU !== 'all') {
        text += ` - ${selectedLevelU}`;
      }
      text += ')';
    } else if (selectedLevelU !== 'all') {
      text += `(${selectedLevelU})`;
    }
    return text;
  }, [selectedGroup, selectedLevelU]);

  const filteredData = useMemo(() => {
    let filteredMatches: Match[] = appData.matches;
    let filteredLeagues: League[] = appData.leagues;
    let filteredPlayers: Player[] = appData.players;

    if (selectedGroup !== 'all') {
      filteredLeagues = appData.leagues.filter(l => l.group === selectedGroup);
      const groupFilteredLeagueIds = filteredLeagues.map(l => l.id);
      
      filteredMatches = appData.matches.filter(m => 
        m.group === selectedGroup || groupFilteredLeagueIds.includes(m.leagueId)
      );
      filteredPlayers = appData.players.filter(p => 
        p.group === selectedGroup || p.participatingLeagueIds.some(plId => groupFilteredLeagueIds.includes(plId))
      );

      if (selectedLevelU !== 'all') {
        filteredLeagues = filteredLeagues.filter(l => l.levelU === selectedLevelU);
        const levelFilteredLeagueIds = filteredLeagues.map(l => l.id);

        filteredMatches = filteredMatches.filter(m => 
          m.levelU === selectedLevelU || levelFilteredLeagueIds.includes(m.leagueId)
        );
        filteredPlayers = filteredPlayers.filter(p => 
          p.levelU === selectedLevelU || p.participatingLeagueIds.some(plId => levelFilteredLeagueIds.includes(plId))
        );
      }
    } else if (selectedLevelU !== 'all') { 
         filteredLeagues = appData.leagues.filter(l => l.levelU === selectedLevelU);
         const levelFilteredLeagueIds = filteredLeagues.map(l => l.id);
         filteredMatches = appData.matches.filter(m => 
            m.levelU === selectedLevelU || levelFilteredLeagueIds.includes(m.leagueId)
          );
         filteredPlayers = appData.players.filter(p => 
            p.levelU === selectedLevelU || p.participatingLeagueIds.some(plId => levelFilteredLeagueIds.includes(plId))
          );
    }
    return { matches: filteredMatches, leagues: filteredLeagues, players: filteredPlayers };
  }, [appData, selectedGroup, selectedLevelU]);

  const matchConflicts = useMemo(() => {
    const conflicts: MatchConflicts = {};
    const dateMap = new Map<string, Array<{ id: string; start: number; end: number }>>();

    function timeToMinutes(timeStr: string): number {
        if (!timeStr || !timeStr.includes(':')) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    filteredData.matches.forEach(match => {
        if (!dateMap.has(match.date)) dateMap.set(match.date, []);
        dateMap.get(match.date)!.push({ 
            id: match.id, 
            start: timeToMinutes(match.startTime), 
            end: timeToMinutes(match.startTime) + (Number(match.durationMinutes) || 0) 
        });
    });

    dateMap.forEach((dailyMatches) => {
        if (dailyMatches.length < 2) return;
        dailyMatches.sort((a, b) => a.start - b.start);
        for (let i = 0; i < dailyMatches.length; i++) {
            for (let j = i + 1; j < dailyMatches.length; j++) {
                const matchA = dailyMatches[i];
                const matchB = dailyMatches[j];
                const isOverlap = matchA.end > matchB.start && matchA.start < matchB.end;

                if (isOverlap) {
                    conflicts[matchA.id] = { type: 'overlap', conflictingWith: [...(conflicts[matchA.id]?.conflictingWith || []), matchB.id] };
                    conflicts[matchB.id] = { type: 'overlap', conflictingWith: [...(conflicts[matchB.id]?.conflictingWith || []), matchA.id] };
                } else {
                    if (!conflicts[matchA.id] || conflicts[matchA.id].type !== 'overlap') {
                         conflicts[matchA.id] = { type: 'sameday', conflictingWith: [...(conflicts[matchA.id]?.conflictingWith || []), matchB.id] };
                    }
                    if (!conflicts[matchB.id] || conflicts[matchB.id].type !== 'overlap') {
                        conflicts[matchB.id] = { type: 'sameday', conflictingWith: [...(conflicts[matchB.id]?.conflictingWith || []), matchA.id] };
                    }
                }
            }
        }
    });
    return conflicts;
  }, [filteredData.matches]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">載入中或重定向...</p>
      </div>
    );
  }
  
  // Ensure currentUserRole is not null before passing to child components
  const validCurrentUserRole = currentUserRole || USER_ROLES.GUEST;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        // currentUserRole is now handled by AuthContext, Header will consume it
      />
      <main className="flex-grow container mx-auto px-4 pt-[120px] md:pt-[80px] pb-8">
        <GlobalFiltersCard
          selectedGroup={selectedGroup}
          selectedLevelU={selectedLevelU}
          onGroupChange={setSelectedGroup}
          onLevelUChange={setSelectedLevelU}
          availableLevelUOptions={availableLevelUOptions}
        />
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SectionName)} className="w-full">
          <TabsContent value="matches">
            <MatchesSection 
              appData={appData} 
              setAppData={setAppData} 
              currentUserRole={validCurrentUserRole} 
              onOpenConfirmDialog={handleOpenConfirmDialog}
              filteredMatches={filteredData.matches}
              filteredLeagues={filteredData.leagues}
              globalGroupIndicator={globalGroupIndicatorText}
              matchConflicts={matchConflicts}
            />
          </TabsContent>
          <TabsContent value="leagues">
            <LeaguesSection 
              appData={appData} 
              setAppData={setAppData} 
              currentUserRole={validCurrentUserRole} 
              onOpenConfirmDialog={handleOpenConfirmDialog}
              filteredLeagues={filteredData.leagues}
              globalGroupIndicator={globalGroupIndicatorText}
            />
          </TabsContent>
          <TabsContent value="players">
            <PlayersSection 
              appData={appData} 
              setAppData={setAppData} 
              currentUserRole={validCurrentUserRole} 
              onOpenConfirmDialog={handleOpenConfirmDialog}
              filteredPlayers={filteredData.players}
              globalGroupIndicator={globalGroupIndicatorText}
            />
          </TabsContent>
          <TabsContent value="statistics">
            <StatisticsSection 
              appData={appData}
              filteredPlayers={filteredData.players}
              filteredMatches={filteredData.matches}
              filteredLeagues={filteredData.leagues}
              globalGroupIndicator={globalGroupIndicatorText}
            />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDialogConfirm}
        title={confirmDialogProps.title}
        description={confirmDialogProps.description}
      />
    </div>
  );
}
