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
};

export type MatchWithTeams = Match & {
  homeTeam: University;
  awayTeam: University;
}
