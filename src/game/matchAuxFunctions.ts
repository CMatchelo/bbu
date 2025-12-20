import { Player } from "../types/Player";
import { PlayType } from "../types/PlayType";

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

export function get2Best(
  players: Player[],
  stat: keyof Player["skills"]
): number[] {
  const sorted = [...players].sort((a, b) => b.skills[stat] - a.skills[stat]);
  return [sorted[0].skills[stat] || 0, sorted[1].skills[stat] || 0];
}

export function getPoints(play: PlayType): number {
  if (play === "THREE") return 3;
  if (play === "TWO") return 2;
  return 2;
}

export function calcOffAvg(players: Player[]): number {
  let avg = 0;
  players.forEach((p) => {
    avg = avg + p.skills.dribble + p.skills.pass + p.skills.speedBall;
  });
  avg = avg / (players.length * 3);
  return Math.round(avg);
}

export function calcDefAvg(players: Player[]): number {
  let avg = 0;
  players.forEach((p) => {
    avg = avg + p.skills.block + p.skills.defense + p.skills.steal;
  });
  avg = avg / (players.length * 3);
  return Math.round(avg);
}

export function calculateTurnoverChance(offAvg: number, defAvg: number) {
  const base = 0.12;
  const impact = (defAvg - offAvg) * 0.01;

  return clamp(base + impact, 0.05, 0.35);
}

export function checkIfBlocked(
  shooter: Player,
  blockBy: Player,
  playType: PlayType
) {
  const skill =
    playType === "THREE"
      ? shooter.skills.threept
      : playType === "TWO"
      ? shooter.skills.twopt
      : shooter.skills.layup;

  const diff = skill - blockBy.skills.block;
  const chance = 0.04 + 0.08 / (1 + Math.exp(-diff / 8));
  return Math.min(Math.max(chance, 0.01), 0.12);
}
