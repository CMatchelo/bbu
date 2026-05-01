import { Player } from "../types/Player";

export const teamOverall = (players: Player[], pos?: string): number => {
  const filtered = pos
    ? players.filter((p) => p.inCourtPosition === pos)
    : players;

  if (filtered.length === 0) return 0;

  const total = filtered.reduce((acc, p) => acc + playerAverage(p), 0);

  return Math.round(total / filtered.length);
};

export const playerAverage = (player: Player): number => {
  const average = Object.values(player.skills).reduce(
    (total, n) => total + n,
    0,
  );
  return Math.round(average / 10);
};
