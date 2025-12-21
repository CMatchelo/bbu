import { Player } from "../types/Player";
import { PlayType } from "../types/PlayType";
import { PossessionResult } from "../types/PossessionResult";
import {
  calcOffAvg,
  calculateTurnoverChance,
  checkIfBlocked,
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
  // Pick play (50%, 35%, 15%)
  // ====================================================

  const r = Math.random() * 100;
  let playType: PlayType;

  if (r < 50) playType = playOrder[0];
  else if (r < 85) playType = playOrder[1];
  else playType = playOrder[2];

  // Skill used
  const skillKey =
    playType === "THREE" ? "threept" : playType === "TWO" ? "twopt" : "layup";

  // ====================================================
  // 2. Pick shooter
  // ====================================================

  if (!offenseTeam) throw new Error("University missing players");
  const weights = offenseTeam.map(
    (p) => p.skills[skillKey] * (0.8 + Math.random() * 0.4)
  );
  const shooter = weightedRandom(offenseTeam, weights);

  // ====================================================
  // 3. Base Accuracy
  // ====================================================
  const skillValue = shooter.skills[skillKey] / 100;

  const baseMultiplier =
    playType === "THREE" ? 0.42 : playType === "TWO" ? 0.65 : 0.92; // layup

  const baseAccuracy = skillValue * baseMultiplier;
  // ====================================================
  // 4. Shooter skill influence
  // ====================================================
  const shooterFactor = 0.65 + skillValue * 0.65;

  // ====================================================
  // 4. ATK Average
  // ====================================================
  const offAvg = calcOffAvg(offenseTeam) / 100;
  const offFactor = 0.9 + offAvg * 0.3; // 0.9 – 1.2

  // ====================================================
  // 5. DEF Average
  // ====================================================
  const defAvg = calcOffAvg(defenseTeam) / 100;
  const defFactor =
    playType === "THREE"
      ? 0.92 - defAvg * 0.15
      : playType === "TWO"
      ? 1.0 - defAvg * 0.20
      : 1.05 - defAvg * 0.25

  // ====================================================
  // 5. Check if turnover
  // ====================================================
  const turnover = Math.random() < calculateTurnoverChance(offAvg, defAvg);

  if (turnover) {
    const weightsSteal = offenseTeam.map(
      (p) => p.skills["steal"] * (0.8 + Math.random() * 0.4)
    );
    const stealer = weightedRandom(defenseTeam, weightsSteal);

    const weightsTurnover = offenseTeam.map(
      (p) => p.skills["dribble"] * (0.8 + Math.random() * 0.4)
    );
    const turnoverBy = weightedRandom(offenseTeam, weightsTurnover);

    return {
      result: "turnover",
      shotType: playType,
      selectedPlayer: shooter,
      stolenBy: stealer,
      turnoverBy: turnoverBy,
      success: false,
      points: getPoints(playType),
      log: `turnover`,
    };
  }

  // ====================================================
  // 6. Home advantage
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
  // 8. Final Prov
  // ====================================================
  let finalProb =
    baseAccuracy * shooterFactor * offFactor * defFactor * rng + homeAdv;
  finalProb = clamp(finalProb, 0.12, 0.92);

  // ====================================================
  // 9. Check if points
  // ====================================================
  let blockBy;
  if (Math.random() <= finalProb) {
    const weightsBlock = defenseTeam.map(
      (p) => p.skills["block"] * (0.8 + Math.random() * 0.4)
    );
    blockBy = weightedRandom(defenseTeam, weightsBlock);
    const isBlocked =
      Math.random() < checkIfBlocked(shooter, blockBy, playType);

    if (!isBlocked) {
      const weightsAssist = offenseTeam.map(
        (p) => p.skills["pass"] * (0.8 + Math.random() * 0.4)
      );
      const filteredPlayers = offenseTeam.filter((p) => p.id !== shooter.id);
      const filteredWeights = weightsAssist.filter(
        (_, i) => offenseTeam[i].id !== shooter.id
      );
      const assistBy = weightedRandom(filteredPlayers, filteredWeights);
      return {
        result: "points",
        shotType: playType,
        assistBy: assistBy,
        selectedPlayer: shooter,
        success: true,
        points: getPoints(playType),
        log: "Points made",
      };
    }
  }

  // ====================================================
  // 10. Rebound if not points
  // ====================================================
  const bestAtkReb = get2Best(offenseTeam, "rebound");
  const bestDefReb = get2Best(defenseTeam, "rebound");

  const atkRebScore = (bestAtkReb[0] + bestAtkReb[1]) / 2;
  const defRebScore = ((bestDefReb[0] + bestDefReb[1]) / 2) * 1.15; // vantagem defensiva

  const atkFinalReb = atkRebScore * randomFloat(0.85, 1.15);
  const defFinalReb = defRebScore * randomFloat(0.85, 1.15);

  if (atkFinalReb > defFinalReb) {
    const weightsRebOff = offenseTeam.map(
      (p) => p.skills["rebound"] * (0.8 + Math.random() * 0.4)
    );
    const reboundBy = weightedRandom(offenseTeam, weightsRebOff);
    return {
      result: "off_rebound",
      shotType: playType,
      selectedPlayer: shooter,
      success: false,
      points: 0,
      reboundWinnerPlayer: reboundBy,
      blockBy: blockBy,
      log: "Offense rebound",
    };
  }
  const weightsRebDef = defenseTeam.map(
    (p) => p.skills["rebound"] * (0.8 + Math.random() * 0.4)
  );
  const reboundBy = weightedRandom(defenseTeam, weightsRebDef);
  return {
    result: "def_rebound",
    shotType: playType,
    selectedPlayer: shooter,
    success: false,
    points: 0,
    reboundWinnerPlayer: reboundBy,
    blockBy: blockBy,
    log: `Defense rebound`,
  };
}
