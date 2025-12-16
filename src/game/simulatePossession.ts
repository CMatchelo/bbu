import { Player } from "../types/Player";
import { PlayType } from "../types/PlayType";
import { PossessionResult } from "../types/PossessionResult";
import {
  calcOffAvg,
  clamp,
  get2Best,
  getPoints,
  randomFloat,
  weightedRandom,
} from "./matchAuxFunctions";

export function simulatePossession(
  offenseTeam: Player[],
  defenseTeam: Player[],
  isHomeTeam: boolean,
  fanbase: number,
  playOrder: PlayType[] = ["THREE", "TWO", "LAYUP"]
): PossessionResult {
  // ====================================================
  // 1. Escolher jogada (50%, 35%, 15%)
  // ====================================================

  const r = Math.random() * 100;
  let playType: PlayType;

  if (r < 50) playType = playOrder[0];
  else if (r < 85) playType = playOrder[1];
  else playType = playOrder[2];

  console.log("Tipo de jogada:", playType);

  // Skill que importa
  const skillKey =
    playType === "THREE" ? "threept" : playType === "TWO" ? "twopt" : "layup";

  // ====================================================
  // 2. Escolher o jogador que arremessa
  // ====================================================
  const players = offenseTeam;
  if (!players) throw new Error("University missing players");
  const weights = players.map(
    (p) => p.skills[skillKey] * (0.8 + Math.random() * 0.4)
  );
  const shooter = weightedRandom(players, weights);

  // ====================================================
  // 3. Base Accuracy
  // ====================================================
  const skillValue = shooter.skills[skillKey] / 100;

  const baseMultiplier =
    playType === "THREE" ? 0.38 : playType === "TWO" ? 0.55 : 0.85; // layup

  const baseAccuracy = skillValue * baseMultiplier;

  // ====================================================
  // 4. Bonus de ataque
  // ====================================================
  const offAvg = calcOffAvg(offenseTeam)
  const teamOffNorm = offAvg / 100;
  const offBonus = (teamOffNorm - 0.5) * 0.08;

  // ====================================================
  // 5. Penalidade da defesa
  // ====================================================
  const defAvg = calcOffAvg(defenseTeam)

  const oppDefNorm = defAvg / 100;
  const difference = oppDefNorm - 0.5;

  const defWeight = playType === "THREE" ? 0.6 : playType === "TWO" ? 0.9 : 1.1; // layup

  const defPenalty = difference * defWeight;

  // ====================================================
  // 6. Fator casa
  // ====================================================
  let homeAdv = 0;
  if (isHomeTeam) {
    homeAdv = (fanbase / 100) * 0.1; // até +10%
  }

  // ====================================================
  // 7. RNG
  // ====================================================
  const rng = randomFloat(-0.02, 0.02);

  // ====================================================
  // 8. Probabilidade final
  // ====================================================
  let finalProb = baseAccuracy + offBonus - defPenalty + homeAdv + rng;

  finalProb = clamp(finalProb, 0.02, 0.95);

  // ====================================================
  // 9. Verificar se caiu
  // ====================================================
  if (Math.random() <= finalProb) {
    return {
      result: 'points',
      shotType: playType,
      selectedPlayerId: shooter.id,
      success: true,
      points: getPoints(playType),
      log: `Points made`
    };
  }

  // ====================================================
  // 10. Rebote
  // ====================================================
  const bestAtk = get2Best(offenseTeam, "rebound");
  const bestDef = get2Best(defenseTeam, "rebound");

  const atkRebScore = (bestAtk[0] + bestAtk[1]) / 2;
  const defRebScore = ((bestDef[0] + bestDef[1]) / 2) * 1.15; // vantagem defensiva

  const atkFinal = atkRebScore * randomFloat(0.95, 1.05);
  const defFinal = defRebScore * randomFloat(0.95, 1.05);

  if (atkFinal > defFinal) {
    return { 
      result: "off_rebound",
      shotType: playType,
      selectedPlayerId: shooter.id,
      success: false,
      points: 0, 
      log: `Offense rebound`
    };
  }

  return { 
      result: "def_rebound",
      shotType: playType,
      selectedPlayerId: shooter.id,
      success: false,
      points: 0, 
      log: `Defense rebound`
    };
}

export type PossessionResult2 = {
  result: string;
  
  shotType: PlayType;
  selectedPlayerId?: string;

  success: boolean;
  points: number;

  reboundWonBy?: string;
  reboundWinnerPlayerId?: string;

  log: string;
};
