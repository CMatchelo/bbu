import { TIMEOUTS_QTY } from "../constants/game.constants";
import { Player } from "../types/Player";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { playerAverage, teamOverall } from "./skillsAverage";

export type TimeoutState = {
  used: number;
  usedThisQuarter: number;
};

const QUARTER_LIMITS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 2,
};

const POSITION_COMPATIBILITY: Record<string, string[]> = {
  C: ["C", "PF"],
  PF: ["C", "PF", "PG"],
  SF: ["PF", "SF", "SG"],
  SG: ["SG", "PG", "SF"],
  PG: ["PG", "SG", "SF"],
};

function getStaminaRatio(id: string, stats: Record<string, PlayerGameStats>) {
  return stats[id]?.stamina ?? 100;
}

function shouldSubstitute(
  stamina: number,
  playerAvg: number,
  teamAvg: number,
): boolean {
  const importance = playerAvg / teamAvg; // > 1 = acima da média do time

  const forcedThreshold = 55 - (importance - 1) * 15; // craque: ~40, ruim: ~60
  const probabilisticThreshold = 75 - (importance - 1) * 15; // craque: ~60, ruim: ~80

  if (stamina <= forcedThreshold) return true;
  if (stamina <= probabilisticThreshold) return Math.random() < 0.5;
  return false;
}

export function substituteCPU(
  players: Player[],
  onCourt: Player[],
  stats: Record<string, PlayerGameStats>,
  scoreDiff: number,
): Player[] {
  const newOnCourt = [...onCourt];

  for (let i = 0; i < newOnCourt.length; i++) {
    const stamina = getStaminaRatio(newOnCourt[i].id, stats);
    if (
      !shouldSubstitute(
        stamina,
        playerAverage(newOnCourt[i]),
        teamOverall(newOnCourt),
      )
    ) {
      continue;
    }

    const compatiblePositions =
      POSITION_COMPATIBILITY[newOnCourt[i].inCourtPosition];

    // Bench players only
    const benchPlayers = players.filter(
      (p) =>
        !newOnCourt.some((c) => c.id === p.id) &&
        compatiblePositions.includes(p.inCourtPosition) &&
        getStaminaRatio(p.id, stats) >= 80 &&
        p.injured === false,
    );

    if (benchPlayers.length === 0) continue;

    // If winning big, allow weaker players
    let candidates = benchPlayers;
    if (scoreDiff >= 17) {
      candidates = benchPlayers.sort(
        (a, b) => playerAverage(a) - playerAverage(b),
      );
    } else {
      candidates = benchPlayers.sort(
        (a, b) => playerAverage(b) - playerAverage(a),
      );
    }

    const subIn = candidates[0];

    newOnCourt[i] = subIn;
  }
  return newOnCourt;
}

export function shouldCallTimeout(
  quarter: number,
  timeLeft: number,
  timeoutState: TimeoutState,
  playerStats: Record<string, PlayerGameStats>,
  onCourt: Player[],
  scoreDiff: number,
): boolean {
  if (timeoutState.used >= TIMEOUTS_QTY) return false;
  if (timeoutState.usedThisQuarter >= QUARTER_LIMITS[quarter]) return false;

  if (timeLeft >= 300) return false;

  let chance = 0;
  let avgStamina = 0;

  for (let i = 0; i < onCourt.length; i++) {
    const stamina = getStaminaRatio(onCourt[i].id, playerStats);
    avgStamina += stamina;
  }

  avgStamina = avgStamina / onCourt.length;

  if (avgStamina < 65) chance += 0.3;
  if (avgStamina < 50) chance += 0.2;

  if (scoreDiff < -8) chance += 0.25;
  if (scoreDiff < -15) chance += 0.15;

  if (timeLeft < 180) chance += 0.2;

  chance = Math.min(chance, 0.9);

  return Math.random() < chance;
}
