export type PlayerGameStats = {
  playerId: string,
  name: string
  teamId: string,
  opponentId: string,
  points: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  assists: number;
  steals: number;
  turnovers: number;
  rebounds: number;
};