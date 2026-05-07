export interface SeriesState {
  matchupId: string;
  homeId: string;
  awayId: string;
  round: 1 | 2 | 3 | 4 | 5;
  homeWins: number;
  awayWins: number;
  gamesPlayed: number;
  totalCreated: number;
  decided: boolean;
  winnerId: string | null;
  loserId: string | null;
}
