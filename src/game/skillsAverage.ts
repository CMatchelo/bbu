import { Player } from "../types/Player";

export const teamAverage = (players: Player[]) => {
  console.log("oi", players)
  let average = 0
  players.map((p) => {
    average += Object.values(p.skills).reduce((total, n) => total + n, 0);
  });
  console.log(average/(players.length*10));
};

export const playerAverage = (player: Player) => {
  const average = Object.values(player.skills).reduce(
    (total, n) => total + n,
    0
  );
  return Math.round(average/10)
};
