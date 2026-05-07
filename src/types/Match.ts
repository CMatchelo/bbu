import { University } from "./University";

export type Match = {
  id: string;
  championship: string;
  home: string;
  away: string;
  week: number;
  played?: boolean;
  result?: {
    homeScore: number;
    awayScore: number;
  };
  playoffRound?: 1 | 2 | 3 | 4 | 5;
  playoffMatchupId?: string;
  seriesGame?: number;
};

export type MatchWithTeams = Match & {
  homeTeam: University;
  awayTeam: University;
}
