import { z } from 'zod';
import { playerPositionOptions, ageGroups, levelOptions } from './types';

const nonOptionalAgeGroups = ageGroups.filter(g => g !== "all");

export const MatchSchema = z.object({
  id: z.string().optional(),
  date: z.string().min(1, "比賽日期為必填"),
  startTime: z.string().min(1, "比賽時間為必填"),
  durationMinutes: z.coerce.number().min(1, "比賽時長必須大於0"),
  leagueId: z.string().min(1, "聯賽為必選"),
  opponentTeamId: z.string().min(1, "對手球隊為必選"),
  location: z.string().min(1, "比賽地點為必填"),
  // group and levelU will be derived or set based on selected league
});

export const LeagueSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "聯賽名稱為必填"),
  group: z.enum(nonOptionalAgeGroups, { errorMap: () => ({ message: "組別為必選" }) }),
  levelU: z.string().min(1, "級別U為必選"),
  format: z.enum(["5人制", "8人制", "11人制", ""], { errorMap: () => ({ message: "比賽賽制為必選" }) }).refine(val => val !== "", { message: "比賽賽制為必選" }),
  notes: z.string().optional(),
});

export const TeamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "球隊名稱為必填"),
  notes: z.string().optional(),
});

const validPositions = playerPositionOptions as [string, ...string[]]; // Zod enum needs at least one value

export const PlayerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "球員姓名為必填"),
  positions: z.array(z.enum(validPositions)).min(1, "至少選擇一個可能位置"),
  injured: z.enum(["是", "否"]),
  notes: z.string().optional(),
  participatingLeagueIds: z.array(z.string()).optional(),
  // group and levelU will be derived or set based on participating leagues
});

export const MatchRosterSchema = z.object({
  matchId: z.string(),
  roster: z.array(z.object({
    playerId: z.string(),
    position: z.enum(validPositions),
  })),
});

export const PlayerMatchStatsSchema = z.object({
  goals: z.coerce.number().min(0).optional().default(0),
  assists: z.coerce.number().min(0).optional().default(0),
  yellow: z.coerce.number().min(0).optional().default(0),
  red: z.coerce.number().min(0).optional().default(0),
});

export const MatchStatsSchema = z.object({
  matchId: z.string(),
  playerStats: z.record(z.string(), PlayerMatchStatsSchema), // playerId as key
});

// Schema for global filters
export const GlobalFiltersSchema = z.object({
  group: z.string().default("all"), // or use z.enum([...ageGroups, "all"])
  levelU: z.string().default("all"),
});
