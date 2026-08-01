import { Player } from "../types/Player";
import { PlayerSeasonStats } from "../types/SeasonStats";

export function getBestStat(
  players: Player[],
  n1: keyof PlayerSeasonStats,
  n2: keyof PlayerSeasonStats,
  currentSeason: number,
) {
  const bestPlayers = [...players]
  .filter((p) => (p.stats[currentSeason][n2]?? 0) >= 10)
  .sort((a, b) => {
    const aP =
      (a.stats[currentSeason][n1] ?? 0) / (a.stats[currentSeason][n2] ?? 1);
    const bP =
      (b.stats[currentSeason][n1] ?? 0) / (b.stats[currentSeason][n2] ?? 1);
    return bP - aP;
  });

  return bestPlayers[0];
}
