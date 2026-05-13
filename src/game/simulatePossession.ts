import { Player } from "../types/Player";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { PlayType } from "../types/PlayType";
import { PossessionResult } from "../types/PossessionResult";
import { DefensivePlaySystem, OffensivePlaySystem } from "../types/PlaySystem";
import { clamp, randomFloat } from "../utils/mathFunc";
import {
  calcDefAvg,
  calcOffAvg,
  calculateTurnoverChance,
  checkIfBlocked,
  get2Best,
  getPoints,
  sigmoid,
  weightedRandom,
} from "./matchAuxFunctions";
import { MATCHUP_TABLE, SHOT_DIST } from "./playSelection";

export function simulatePossession(
  offenseTeam: Player[],
  defenseTeam: Player[],
  isHomeTeam: boolean,
  fanbase: number,
  playerStats: Record<string, PlayerGameStats> | null,
  offensivePlay: keyof OffensivePlaySystem = "PickAndRoll",
  defensivePlay: keyof DefensivePlaySystem = "ManToMan",
  offenseFamiliarity: number = 50,
  defenseFamiliarity: number = 50,
): PossessionResult {
  // ====================================================
  // 1. Shot type distribution by offensive play
  // ====================================================
  const [threePct, twoPct] = SHOT_DIST[offensivePlay];
  const r = Math.random() * 100;
  let playType: PlayType;
  if (r < threePct) playType = "THREE";
  else if (r < threePct + twoPct) playType = "TWO";
  else playType = "LAYUP";

  // Skill used
  const skillKey =
    playType === "THREE" ? "threept" : playType === "TWO" ? "twopt" : "layup";

  // ====================================================
  // 2. Pick shooter
  // ====================================================
  if (offenseTeam.length === 0) throw new Error("University missing players");
  const weights = offenseTeam.map(
    (p) => p.skills[skillKey] * (0.8 + Math.random() * 0.4),
  );
  const shooter = weightedRandom(offenseTeam, weights);
  const shooterStamina = playerStats?.[shooter.id].stamina ?? 100;
  const staminaFactor = clamp(
    0.5 + Math.pow(shooterStamina / 100, 1.5) * 0.5,
    0.5,
    1,
  );
  const staminaDelta = (staminaFactor - 1) * 0.25;

  // ====================================================
  // 3. Base Accuracy
  // ====================================================
  const skillValue = shooter.skills[skillKey] / 100;
  const skillDelta = (skillValue - 0.5) * 0.24;

  const baseMultiplier =
    playType === "THREE" ? 0.6 : playType === "TWO" ? 0.7 : 0.95;

  // ====================================================
  // 4. Team averages
  // ====================================================
  const offAvg = calcOffAvg(offenseTeam, playerStats) / 100;
  const defAvg = calcDefAvg(defenseTeam, playerStats) / 100;
  const matchupDelta = (offAvg - defAvg) * 0.16;

  // ====================================================
  // 5. Turnover check
  // ====================================================
  const turnover = Math.random() < calculateTurnoverChance(offAvg, defAvg);

  if (turnover) {
    const weightsSteal = defenseTeam.map(
      (p) => p.skills["steal"] * (0.8 + Math.random() * 0.4),
    );
    const stealer = weightedRandom(defenseTeam, weightsSteal);

    const weightsTurnover = offenseTeam.map(
      (p) => p.skills["ballHandling"] * (0.8 + Math.random() * 0.4),
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
  const homeDelta = isHomeTeam ? (fanbase / 100) * 0.04 : 0;

  // ====================================================
  // 7. RNG
  // ====================================================
  const rngDelta = randomFloat(-0.015, 0.015);

  // ====================================================
  // 8. Play system bonus/penalty (clamped to ±0.1 total)
  // ====================================================
  const matchupBonus = MATCHUP_TABLE[offensivePlay][defensivePlay] / 100;
  const familiarityBonus = (offenseFamiliarity - defenseFamiliarity) / 2000;
  const playSystemDelta = clamp(matchupBonus + familiarityBonus, -0.1, 0.1);

  // ====================================================
  // 9. Final probability
  // ====================================================
  const rawProb =
    baseMultiplier +
    skillDelta +
    matchupDelta +
    staminaDelta +
    homeDelta +
    rngDelta +
    playSystemDelta;
  
  console.log(playSystemDelta, rawProb)

  const finalProb = clamp(sigmoid(rawProb), 0.15, 0.92);

  // ====================================================
  // 10. Check if points
  // ====================================================
  let blockBy: Player | undefined = undefined;
  const randomN = Math.random();
  if (randomN <= finalProb) {
    const weightsBlock = defenseTeam.map(
      (p) => p.skills["block"] * (0.8 + Math.random() * 0.4),
    );
    blockBy = weightedRandom(defenseTeam, weightsBlock);
    const isBlocked =
      Math.random() <
      checkIfBlocked(
        shooter,
        blockBy,
        playType,
        playerStats?.[blockBy.id].stamina ?? 100,
      );

    if (!isBlocked) {
      const weightsAssist = offenseTeam.map(
        (p) => p.skills["pass"] * (0.8 + Math.random() * 0.4),
      );
      const filteredPlayers = offenseTeam.filter((p) => p.id !== shooter.id);
      const filteredWeights = weightsAssist.filter(
        (_, i) => offenseTeam[i].id !== shooter.id,
      );
      const assistBy =
        Math.random() < 0.68
          ? weightedRandom(filteredPlayers, filteredWeights)
          : undefined;
      return {
        result: "points",
        shotType: playType,
        ...(assistBy && { assistBy }),
        selectedPlayer: shooter,
        success: true,
        points: getPoints(playType),
        log: "Points made",
      };
    }
  }

  // ====================================================
  // 11. Rebound if not points
  // ====================================================
  const bestAtkReb = get2Best(offenseTeam, "rebound");
  const bestDefReb = get2Best(defenseTeam, "rebound");

  const atkRebScore = (bestAtkReb[0] + bestAtkReb[1]) / 2;
  const defRebScore = ((bestDefReb[0] + bestDefReb[1]) / 2) * 1.15;

  const atkFinalReb = atkRebScore * randomFloat(0.85, 1.15);
  const defFinalReb = defRebScore * randomFloat(0.85, 1.15);

  if (atkFinalReb > defFinalReb) {
    const weightsRebOff = offenseTeam.map(
      (p) => p.skills["rebound"] * (0.8 + Math.random() * 0.4),
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
    (p) => p.skills["rebound"] * (0.8 + Math.random() * 0.4),
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
