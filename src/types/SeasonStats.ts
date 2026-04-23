export type SeasonStats = {
  year: number;
  matches: number;
  wins: number;
  points: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  turnovers: number;
  blocks: number;
  rebounds: number;
  assists: number;
  steals: number;
};

export type PlayerSeasonStats = SeasonStats & {
  teamPoints: number;
  teamPointsAllowed: number;
};

export type TeamSeasonStats = SeasonStats & {
  pointsAllowed: number;
};