export type Match = {
  id: string;
  homeId: string;
  awayId: string;
  round: number;
  played: boolean;
  result?: {
    homeScore: number;
    awayScore: number;
  };
};