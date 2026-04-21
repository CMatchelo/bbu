import { PlayerGameStats } from "../types/PlayerGameStats";
import { SeasonStats } from "../types/SeasonStats";

export function gameStatsToMatchResults(
  gameStats: Record<string, PlayerGameStats>,
  currentYear: number
): { id: string; statDeltas: Partial<SeasonStats> }[] {
  return Object.values(gameStats).map(({ playerId, points, fgm, fga, tpm, tpa, assists, steals, turnovers, rebounds, blocks }) => ({
    id: playerId,
    statDeltas: {
      year: currentYear,
      matches: 1,
      points,
      fgm,
      fga,
      tpm,
      tpa,
      assists,
      steals,
      turnovers,
      rebounds,
      blocks,
    },
  }));
}