
export type UserRole = 'guest' | 'player' | 'coach';

export interface Match {
  id: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  leagueId: string;
  opponentTeamId: string;
  location: string;
  group: string; // Should match keys in levelOptions
  levelU: string;
  stats: { [playerId: string]: PlayerMatchStats };
}

export interface PlayerMatchStats {
  goals: number;
  assists: number;
  yellow: number;
  red: number;
}

export interface League {
  id: string;
  name: string;
  group: string;
  levelU: string;
  format: '5人制' | '8人制' | '11人制' | '';
  notes: string;
}

export interface Team {
  id: string;
  name: string;
  notes: string;
}

export interface Player {
  id: string;
  name: string;
  participatingLeagueIds: string[];
  positions: string[]; // Array of position strings
  injured: '是' | '否';
  notes: string;
  group: string; // Should match keys in levelOptions
  levelU: string;
}

export interface MatchRosterItem {
  playerId: string;
  position: string;
}

export interface MatchRoster {
  [matchId: string]: MatchRosterItem[];
}

export type MatchAvailability = {
  [matchId: string]: { [playerId: string]: boolean };
};

export interface AppData {
  matches: Match[];
  leagues: League[];
  teams: Team[];
  players: Player[];
  matchRosters: MatchRoster;
  matchAvailability: MatchAvailability; // Added
}

export type PlayerPosition = 
  | "守門員 (GK)" | "右後衛 (RB)" | "左後衛 (LB)" | "中後衛 (CB)" 
  | "防守中場 (DMF)" | "右中場 (RMF)" | "左中場 (LMF)" | "進攻中場 (AMF)"
  | "右邊鋒 (RWF)" | "左邊鋒 (LWF)" | "中鋒 (CF)"
  | "左前鋒" | "右前鋒" | "中前鋒";

export const playerPositionOptions: PlayerPosition[] = [
  "守門員 (GK)", "右後衛 (RB)", "左後衛 (LB)", "中後衛 (CB)", 
  "防守中場 (DMF)", "右中場 (RMF)", "左中場 (LMF)", "進攻中場 (AMF)",
  "右邊鋒 (RWF)", "左邊鋒 (LWF)", "中鋒 (CF)",
  "左前鋒", "右前鋒", "中前鋒"
];

export type AgeGroup = "幼兒組" | "國小組" | "國中組" | "高中組" | "大學組" | "成人組" | "all";

export const ageGroups: Exclude<AgeGroup, "all">[] = ["幼兒組", "國小組", "國中組", "高中組", "大學組", "成人組"];

export const levelOptions: Record<Exclude<AgeGroup, "all">, string[]> = { 
  "幼兒組": ["U6"], 
  "國小組": ["U8", "U10", "U12"], 
  "國中組": ["U14", "U15"], 
  "高中組": ["U16", "U18"], 
  "大學組": ["甲組", "乙組", "其他組"], 
  "成人組": ["企業組", "家長組"]
};

export const USER_ROLES: Record<string, UserRole> = {
  GUEST: 'guest',
  PLAYER: 'player',
  COACH: 'coach'
};

export type SectionName = "matches" | "leagues" | "players" | "statistics";

export type MatchConflictInfo = {
  type: 'none' | 'sameday' | 'overlap';
  conflictingWith?: string[];
};

export type MatchConflicts = {
  [matchId: string]: MatchConflictInfo;
};

