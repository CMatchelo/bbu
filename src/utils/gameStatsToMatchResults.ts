import { PlayerGameStats } from "../types/PlayerGameStats";
import { SeasonStats } from "../types/SeasonStats";
import { TeamGameStats } from "../types/TeamGameStats";

export function gameStatsToMatchResults({
  currentYear,
  playerGameStats,
  uniGameStats,
}: {
  currentYear: number;
  playerGameStats?: Record<string, PlayerGameStats>;
  uniGameStats?: Record<string, TeamGameStats>;
}): { id: string; statDeltas: Partial<SeasonStats> }[] {
  if (!playerGameStats && !uniGameStats) {
    throw new Error("Either playerGameStats or uniGameStats must be provided");
  }
  if (playerGameStats) {
    return Object.values(playerGameStats).map(
      ({
        playerId,
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
      }) => ({
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
      }),
    );
  }
  if (uniGameStats) {
    return Object.values(uniGameStats).map(
      ({
        id,
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
      }) => ({
        id: id,
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
      }),
    );
  }
  return []
}
