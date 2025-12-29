import { Player } from "../types/Player";
import { PlayerGameStats } from "../types/PlayerGameStats";
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

export function calcOffAvg(
  players: Player[],
  playerStats: Record<string, PlayerGameStats> | null
): number {
  let total = 0;

  players.forEach((p) => {
    const base = p.skills.dribble + p.skills.pass + p.skills.speedBall;
    const stamina = playerStats?.[p.id]?.stamina ?? 100;
    const staminaFactor = 0.95 + stamina / 2000;
    total += base * (1 + (staminaFactor - 1));
  });
  const avg = total / (players.length * 3);
  return Math.round(avg);
}

/* export function calcDefAvg(
  players: Player[],
  playerStats: Record<string, PlayerGameStats> | null
): number {
  let total = 0;

  players.forEach((p) => {
    const base = p.skills.block + p.skills.defense + p.skills.steal;

    const stamina = playerStats?.[p.id]?.stamina ?? 100;

    // Defense suffers more from fatigue
    const staminaFactor = 0.94 + stamina / 1666; // 100 → 1.0

    total += base * staminaFactor;
  });

  const avg = total / (players.length * 3);
  return Math.round(avg);
} */

export function calculateTurnoverChance(offAvg: number, defAvg: number) {
  const base = 0.12;
  const impact = (defAvg - offAvg) * 0.01;

  return clamp(base + impact, 0.05, 0.35);
}

export function checkIfBlocked(
  shooter: Player,
  blockBy: Player,
  playType: PlayType,
  blockerStamina: number
) {
  const skill =
    playType === "THREE"
      ? shooter.skills.threept
      : playType === "TWO"
      ? shooter.skills.twopt
      : shooter.skills.layup;

  const staminaFactor = Math.max(
    0.85,
    0.9 + blockerStamina / 1000
  );
  const penalizedBlockSkill =
    blockBy.skills.block * staminaFactor;
  const diff = skill - penalizedBlockSkill;
  const chance = 0.04 + 0.08 / (1 + Math.exp(-diff / 8));
  return Math.min(Math.max(chance, 0.01), 0.12);
}

const randomFactor = (min = 0.95, max = 1.05) =>
  1 + Math.random() * (max - min) - (1 - min);

export const calculateStaminaSpent = (
  duration: number,
  staminaSkill: number
) => {
  const baseCostPerSecond = 0.08;
  const fatigueFactor = (100 - staminaSkill) / 100;

  const base = duration * baseCostPerSecond * (1 + fatigueFactor);

  return base * randomFactor(0.95, 1.05);
};

export const calculateBenchRecovery = (duration: number) => {
  const recoveryPerSecond = 0.12;

  const base = duration * recoveryPerSecond;

  return base * randomFactor(0.9, 1.1);
};
