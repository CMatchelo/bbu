import { Player } from "../types/Player";
import { SeasonStats } from "../types/SeasonStats";

export type SeasonStatKey = "points" | "steals" | "blocks" | "tpm" | "turnovers" | "rebounds";

export function perGameAverage(stats: SeasonStats | undefined, key: SeasonStatKey): number {
  if (!stats || !stats.matches) return 0;
  return stats[key] / stats.matches;
}

export interface StatLeaderResult {
  player: Player;
  value: number;
}

export function getStatLeader(
  players: Player[],
  season: number,
  key: SeasonStatKey,
): StatLeaderResult | null {
  const eligible = players.filter((p) => (p.stats[season]?.matches ?? 0) > 0);
  if (eligible.length === 0) return null;

  const player = [...eligible].sort(
    (a, b) => perGameAverage(b.stats[season], key) - perGameAverage(a.stats[season], key),
  )[0];

  return { player, value: perGameAverage(player.stats[season], key) };
}
