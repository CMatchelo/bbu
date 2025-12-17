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
    playType === "THREE" ? 0.35 : playType === "TWO" ? 0.52 : 0.75; // layup

  const baseAccuracy = skillValue * baseMultiplier;
  // ====================================================
  // 4. Shooter skill influence
  // ====================================================
  const shooterFactor = 0.6 + skillValue * 0.8;

  // ====================================================
  // 4. Bonus de ataque
  // ====================================================
  const offAvg = calcOffAvg(offenseTeam) / 100;
  const offFactor = 0.9 + offAvg * 0.3; // 0.9 – 1.2

  // ====================================================
  // 5. Penalidade da defesa
  // ====================================================
  const defAvg = calcOffAvg(defenseTeam) / 100;
  const defFactor =
    playType === "THREE"
      ? 1.05 - defAvg * 0.25
      : playType === "TWO"
      ? 1.1 - defAvg * 0.35
      : 1.2 - defAvg * 0.5;

  // ====================================================
  // 6. Fator casa
  // ====================================================
  let homeAdv = 0;
  if (isHomeTeam) {
    homeAdv = isHomeTeam ? (fanbase / 100) * 0.05 : 0;
  }

  // ====================================================
  // 7. RNG
  // ====================================================
  const rng = randomFloat(0.95, 1.05);

  // ====================================================
  // 8. Probabilidade final
  // ====================================================
  let finalProb =
    baseAccuracy * shooterFactor * offFactor * defFactor * rng + homeAdv;
  finalProb = clamp(finalProb, 0.05, 0.92);

  // ====================================================
  // 9. Verificar se caiu
  // ====================================================
  if (Math.random() <= finalProb) {
    const weightsAssist = offenseTeam.map(
      (p) => p.skills["pass"] * (0.8 + Math.random() * 0.4)
    );
    const assistBy = weightedRandom(players, weightsAssist);
    return {
      result: "points",
      shotType: playType,
      assistBy: assistBy,
      selectedPlayer: shooter,
      success: true,
      points: getPoints(playType),
      log: `Points made`,
    };
  }

  // ====================================================
  // 10. Rebote
  // ====================================================
  const bestAtk = get2Best(offenseTeam, "rebound");
  const bestDef = get2Best(defenseTeam, "rebound");

  const atkRebScore = (bestAtk[0] + bestAtk[1]) / 2;
  const defRebScore = ((bestDef[0] + bestDef[1]) / 2) * 1.15; // vantagem defensiva

  const atkFinal = atkRebScore * randomFloat(0.85, 1.15);
  const defFinal = defRebScore * randomFloat(0.85, 1.15);

  if (atkFinal > defFinal) {
    const weightsRebOff = offenseTeam.map(
      (p) => p.skills["rebound"] * (0.8 + Math.random() * 0.4)
    );
    const reboundBy = weightedRandom(players, weightsRebOff);
    return {
      result: "off_rebound",
      shotType: playType,
      selectedPlayer: shooter,
      success: false,
      points: 0,
      reboundWinnerPlayer: reboundBy,
      log: `Offense rebound`,
    };
  }
  const weightsRebDef = defenseTeam.map(
      (p) => p.skills["rebound"] * (0.8 + Math.random() * 0.4)
    );
    const reboundBy = weightedRandom(players, weightsRebDef);
  return {
    result: "def_rebound",
    shotType: playType,
    selectedPlayer: shooter,
    success: false,
    points: 0,
    reboundWinnerPlayer: reboundBy,
    log: `Defense rebound`,
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
