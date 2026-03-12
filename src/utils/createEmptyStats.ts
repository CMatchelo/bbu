import { TeamGameStats } from "../types/TeamGameStats";

export const createEmptyTeamStats = (teamId: string): TeamGameStats => ({
  teamId,
  points: 0,
  fgm: 0,
  fga: 0,
  tpm: 0,
  tpa: 0,
  assists: 0,
  steals: 0,
  turnovers: 0,
  rebounds: 0,
  blocks: 0,
  stamina: 0,
});
