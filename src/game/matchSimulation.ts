/* import { PlayType, SimPlayer } from "../types/PlayType";

export function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;

  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
  return items[items.length - 1];
}

export function get2Best(players: SimPlayer[], stat: keyof SimPlayer["skills"]): number[] {
  const sorted = [...players].sort(
    (a, b) => b.skills[stat] - a.skills[stat]
  );
  return [
    sorted[0].skills[stat] || 0,
    sorted[1].skills[stat] || 0
  ];
}

export function getPoints(play: PlayType): number {
  if (play === "THREE") return 3;
  if (play === "TWO") return 2;
  return 2; // layup
} */