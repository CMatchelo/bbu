export type PlayerGameStats = {
  playerId: string,
  name: string
  teamId: string,
  opponentId: string,
  teamPoints: number;
  teamPointsAllowed: number;
  points: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  assists: number;
  steals: number;
  turnovers: number;
  rebounds: number;
  blocks: number;
  stamina: number;
  minutes: number;
};