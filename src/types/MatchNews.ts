export type MatchNews = {
  id: string;
  matchId: string;
  week: number;
  year: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  winnerTeamId: string;
  mostPointsPlayerId: string;
  mostPointsValue: number;
  mostReboundsPlayerId: string;
  mostReboundsValue: number;
  mostAssistsPlayerId: string;
  mostAssistsValue: number;
  mostStealsPlayerId: string;
  mostStealsValue: number;
  titleId: number;
  subtitleId: number;
  textId: number;
  ptsTextId: number;
  rebTextId: number;
  astTextId: number;
  stlTextId: number;
};

export type WeeklyNews = MatchNews[];
