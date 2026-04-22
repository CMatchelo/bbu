import { SeasonStats } from "../types/SeasonStats";

export function createEmptySeasonStats(currentYear: number): SeasonStats {
  return {
    year: currentYear,
    matches: 0,
    points: 0,
    fgm: 0,
    fga: 0,
    tpm: 0,
    tpa: 0,
    turnovers: 0,
    blocks: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
  };
}