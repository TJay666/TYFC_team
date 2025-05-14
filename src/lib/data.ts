import type { AppData } from './types';

export const initialDb: AppData = {
  matches: [
    { id: "match1", date: "2025-05-15", startTime: "10:00", durationMinutes: 90, leagueId: "league1", opponentTeamId: "team1", location: "青埔足球場", group: "國小組", levelU: "U10", stats: {"player1": {goals:1, assists:0, yellow:1, red:0}} },
    { id: "match2", date: "2025-05-15", startTime: "11:00", durationMinutes: 90, leagueId: "league1", opponentTeamId: "team2", location: "市立體育場", group: "國小組", levelU: "U10", stats: {"player2": {goals:0, assists:1, yellow:0, red:1}} },
    { id: "match3", date: "2025-05-16", startTime: "14:00", durationMinutes: 70, leagueId: "league2", opponentTeamId: "team2", location: "中壢運動公園", group: "幼兒組", levelU: "U6", stats: {} },
    { id: "match4", date: "2025-05-17", startTime: "09:00", durationMinutes: 120, leagueId: "league3", opponentTeamId: "team1", location: "大學足球場", group: "大學組", levelU: "甲組", stats: {} }
  ],
  leagues: [
    { id: "league1", name: "桃園市國小U10春季聯賽", group: "國小組", levelU: "U10", format: "8人制", notes: "重點賽事" },
    { id: "league2", name: "幼兒足球體驗賽", group: "幼兒組", levelU: "U6", format: "5人制", notes: "趣味為主" },
    { id: "league3", name: "大專足球甲級聯賽", group: "大學組", levelU: "甲組", format: "11人制", notes: "校際最高殿堂" }
  ],
  teams: [ 
    { id: "team1", name: "中壢火箭隊", notes: "速度快" },
    { id: "team2", name: "八德猛虎隊", notes: "防守穩固" }
  ],
  players: [
    { id: "player1", name: "林志明", participatingLeagueIds: ["league1"], positions: ["中鋒 (CF)", "進攻中場 (AMF)"], injured: "否", notes: "隊長", group: "國小組", levelU: "U10" },
    { id: "player2", name: "陳小安", participatingLeagueIds: ["league1", "league2"], positions: ["中後衛 (CB)"], injured: "是", notes: "腳踝扭傷", group: "國小組", levelU: "U10" },
    { id: "player3", name: "王大勇", participatingLeagueIds: ["league3"], positions: ["防守中場 (DMF)"], injured: "否", notes: "", group: "大學組", levelU: "甲組" },
    { id: "player4", name: "李小美", participatingLeagueIds: ["league2"], positions: ["左邊鋒 (LWF)"], injured: "否", notes: "", group: "幼兒組", levelU: "U6" }
  ],
  matchRosters: { 
    "match1": [{playerId: "player1", position: "中鋒 (CF)"}, {playerId: "player2", position: "中後衛 (CB)"}]
  }
};
