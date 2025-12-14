export type Match = {
  id: string;
  home: string;
  away: string;
  round: number;
  played?: boolean;
  result?: {
    homeScore: number;
    awayScore: number;
  };
};