import { PlayerSeasonStats, TeamSeasonStats } from "../types/SeasonStats";

export function createEmptyPlayerSeasonStats(currentYear: number): PlayerSeasonStats {
  return {
    year: currentYear,
    matches: 0,
    wins: 0,
    points: 0,
    teamPoints: 0,
    teamPointsAllowed: 0,
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

export function createEmptyTeamSeasonStats(currentYear: number): TeamSeasonStats {
  return {
    year: currentYear,
    matches: 0,
    wins: 0,
    points: 0,
    pointsAllowed: 0,
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