import { PlayerGameStats } from "../types/PlayerGameStats";
import { PlayerSeasonStats, TeamSeasonStats } from "../types/SeasonStats";
import { TeamGameStats } from "../types/TeamGameStats";

export function playerGameStatsToDeltas(
  currentYear: number,
  playerGameStats: Record<string, PlayerGameStats>,
): { id: string; statDeltas: Partial<PlayerSeasonStats> }[] {
  return Object.values(playerGameStats).map(
    ({ playerId, name, teamId, opponentId, ...stats }) => ({
      id: playerId,
      statDeltas: { year: currentYear, matches: 1, ...stats },
    }),
  );
}

export function teamGameStatsToDeltas(
  currentYear: number,
  uniGameStats: Record<string, TeamGameStats>,
): { id: string; statDeltas: Partial<TeamSeasonStats> }[] {
  return Object.values(uniGameStats).map(
    ({ id, points, pointsAllowed, ...rest }) => ({
      id,
      statDeltas: {
        year: currentYear,
        matches: 1,
        wins: points > pointsAllowed ? 1 : 0,
        points,
        pointsAllowed,
        ...rest,
      },
    }),
  );
}
