import {
  calculateBenchRecovery,
  calculateStaminaSpent,
} from "./matchAuxFunctions";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { PossessionResult } from "../types/PossessionResult";
import { University } from "../types/University";
import { Player } from "../types/Player";
import { TeamGameStats } from "../types/TeamGameStats";
import { store } from "../store";
import { selectPlayersFromUniversity } from "../selectors/data.selectors";
import { updatePlayer } from "../store/slices/dataSlice";
import { toRecord } from "../utils/toRecord";

export function updateTeamStats(
  homeStats: TeamGameStats,
  awayStats: TeamGameStats,
  possession: PossessionResult,
) {
  const isThree = possession.shotType === "THREE";

  const homeIsAttacking =
    homeStats.id === possession.selectedPlayer.currentUniversity;

  const atkStats = { ...(homeIsAttacking ? homeStats : awayStats) };
  const defStats = { ...(homeIsAttacking ? awayStats : homeStats) };
  if (possession.success) {
    atkStats.points += possession.points;
    atkStats.assists += 1;
    atkStats.fgm += 1;
    atkStats.fga += 1;
    atkStats.tpa += isThree ? 1 : 0;
    atkStats.tpm += isThree ? 1 : 0;
    defStats.pointsAllowed += possession.points;
  }

  if (!possession.success && !possession.turnoverBy && !possession.blockBy) {
    atkStats.fga += 1;
    atkStats.tpa += isThree ? 1 : 0;
  }

  if (possession.blockBy) {
    atkStats.fga += 1;
    atkStats.tpa += isThree ? 1 : 0;
    defStats.blocks += 1;
  }

  if (possession.turnoverBy) {
    atkStats.turnovers += 1;
    defStats.steals += 1;
  }

  if (possession.reboundWinnerPlayer?.currentUniversity === atkStats.id) {
    atkStats.rebounds += 1;
  }
  if (possession.reboundWinnerPlayer?.currentUniversity === defStats.id) {
    defStats.rebounds += 1;
  }

  return homeIsAttacking
    ? { newHomeStats: atkStats, newAwayStats: defStats }
    : { newHomeStats: defStats, newAwayStats: atkStats };
}

export function updateStats(
  stats: Record<string, PlayerGameStats>,
  possession: PossessionResult,
  duration: number,
  interval: boolean,
  homeUniversity: University,
  awayUniversity: University,
  homeLineup: Player[],
  awayLineup: Player[],
): {
  updatedStats: Record<string, PlayerGameStats>;
  newlyInjuredIds: string[];
} {
  let updatedStats = { ...stats };

  updatedStats = applyShotStats(
    updatedStats,
    possession,
    homeLineup,
    awayLineup,
  );
  updatedStats = applyTurnoverStats(updatedStats, possession);
  updatedStats = applyAssistStats(updatedStats, possession);
  updatedStats = applyReboundStats(updatedStats, possession);
  updatedStats = applyBlockStats(updatedStats, possession);

  const { stats: staminaStats, newlyInjuredIds } = updateStamina(
    updatedStats,
    duration,
    interval,
    homeUniversity,
    awayUniversity,
    homeLineup,
    awayLineup,
  );

  return { updatedStats: staminaStats, newlyInjuredIds };
}

function applyShotStats(
  stats: Record<string, PlayerGameStats>,
  possession: PossessionResult,
  homeLineup: Player[],
  awayLineup: Player[],
) {
  if (possession.stolenBy || possession.turnoverBy) return stats;
  const shooterId = possession.selectedPlayer.id;
  const shooter = stats[shooterId];
  if (!shooter) return stats;

  const isThree = possession.shotType === "THREE";

  const scoringTeamId = possession.selectedPlayer.currentUniversity;

  const updated = { ...stats };

  updated[shooterId] = {
    ...shooter,
    fga: shooter.fga + 1,
    fgm: shooter.fgm + (possession.success ? 1 : 0),
    tpa: shooter.tpa + (isThree ? 1 : 0),
    tpm: shooter.tpm + (isThree && possession.success ? 1 : 0),
    points: shooter.points + (possession.success ? possession.points : 0),
  };

  const homeIsScoring = homeLineup.some(
    (p) => p.currentUniversity === scoringTeamId,
  );

  const scoringLineup = homeIsScoring ? homeLineup : awayLineup;
  const defendingLineup = homeIsScoring ? awayLineup : homeLineup;

  scoringLineup.forEach((player) => {
    const pStats = updated[player.id];
    if (!pStats) return;

    updated[player.id] = {
      ...pStats,
      teamPoints: pStats.teamPoints + possession.points,
    };
  });

  defendingLineup.forEach((player) => {
    const pStats = updated[player.id];
    if (!pStats) return;

    updated[player.id] = {
      ...pStats,
      teamPointsAllowed: pStats.teamPointsAllowed + possession.points,
    };
  });

  return updated;
}

function applyTurnoverStats(
  stats: Record<string, PlayerGameStats>,
  possession: PossessionResult,
) {
  if (!possession.turnoverBy || !possession.stolenBy) return stats;

  const turnoverId = possession.turnoverBy.id;
  const stealId = possession.stolenBy.id;

  const turnover = stats[turnoverId];
  const stealer = stats[stealId];

  const updated = { ...stats };

  if (turnover) {
    updated[turnoverId] = {
      ...turnover,
      turnovers: turnover.turnovers + 1,
    };
  }

  if (stealer) {
    updated[stealId] = {
      ...stealer,
      steals: stealer.steals + 1,
    };
  }

  return updated;
}

function applyAssistStats(
  stats: Record<string, PlayerGameStats>,
  possession: PossessionResult,
) {
  if (!possession.assistBy) return stats;

  const assistId = possession.assistBy.id;

  const assister = stats[assistId];

  const updated = { ...stats };

  if (assister) {
    updated[assistId] = {
      ...assister,
      assists: assister.assists + 1,
    };
  }

  return updated;
}

function applyReboundStats(
  stats: Record<string, PlayerGameStats>,
  possession: PossessionResult,
) {
  if (!possession.reboundWinnerPlayer) return stats;

  const rebounderId = possession.reboundWinnerPlayer.id;
  const rebounder = stats[rebounderId];

  const updated = { ...stats };

  if (rebounder) {
    updated[rebounderId] = {
      ...rebounder,
      rebounds: rebounder.rebounds + 1,
    };
  }

  return updated;
}

function applyBlockStats(
  stats: Record<string, PlayerGameStats>,
  possession: PossessionResult,
) {
  if (!possession.blockBy) return stats;

  const blockId = possession.blockBy.id;
  const blocker = stats[blockId];

  const shooterId = possession.selectedPlayer.id;
  const shooter = stats[shooterId];

  const isThree = possession.shotType === "THREE";

  const updated = { ...stats };

  if (shooter) {
    updated[shooterId] = {
      ...shooter,
      fga: shooter.fga + 1,
      tpa: shooter.tpa + (isThree ? 1 : 0),
    };
  }

  if (blocker) {
    updated[blockId] = {
      ...blocker,
      blocks: blocker.blocks + 1,
    };
  }

  return updated;
}

function updateStamina(
  stats: Record<string, PlayerGameStats>,
  duration: number,
  interval: boolean,
  homeUniversity: University,
  awayUniversity: University,
  homeLineup: Player[],
  awayLineup: Player[],
): { stats: Record<string, PlayerGameStats>; newlyInjuredIds: string[] } {
  const updatedStats = { ...stats };

  const homePlayers = selectPlayersFromUniversity(
    store.getState(),
    homeUniversity.id,
  );
  const awayPlayers = selectPlayersFromUniversity(
    store.getState(),
    awayUniversity.id,
  );

  const allPlayers = [...(homePlayers || []), ...(awayPlayers || [])];

  const onCourtIds = new Set([
    ...homeLineup.map((p) => p.id),
    ...awayLineup.map((p) => p.id),
  ]);

  const newlyInjuredIds: string[] = [];

  allPlayers.forEach((player) => {
    const playerStats = updatedStats[player.id];
    if (!playerStats) return;

    const physioLevel =
      player.currentUniversity === homeUniversity.id
        ? homeUniversity.physioLevel
        : awayUniversity.physioLevel;
    const intervalRest = interval
      ? calculateBenchRecovery(150, physioLevel)
      : 0;

    if (onCourtIds.has(player.id)) {
      const staminaSpent = calculateStaminaSpent(
        duration,
        player.stamina,
        physioLevel,
      );

      const newStamina = Number(
        Math.min(
          100,
          Math.max(0, playerStats.stamina - staminaSpent + intervalRest),
        ).toFixed(1),
      );

      const isInjured = verifyIfInjured(player, newStamina);

      if (isInjured) {
        newlyInjuredIds.push(player.id);
        store.dispatch(
          updatePlayer({
            id: player.id,
            changes: { injured: true },
          }),
        );
      }

      updatedStats[player.id] = {
        ...playerStats,
        minutes: playerStats.minutes + duration,
        stamina: newStamina,
        injured: isInjured,
      };

      return;
    }

    const recovery = calculateBenchRecovery(duration, physioLevel);

    updatedStats[player.id] = {
      ...playerStats,
      stamina: Number(
        Math.min(100, playerStats.stamina + recovery + intervalRest).toFixed(1),
      ),
    };
  });

  return { stats: updatedStats, newlyInjuredIds };
}

function verifyIfInjured(player: Player, stamina: number): boolean {
  if (stamina > 90) return false;
  if (player.id === "p00130") return true;

  const BASE_CHANCE = 0.00005;

  const fatigueFactor = (100 - stamina) / 100;
  const staminaModifier = 1 + fatigueFactor;

  const injuryProneModifier = 1 + player.injuryProne / 100;

  const finalChance = BASE_CHANCE * staminaModifier * injuryProneModifier;

  return Math.random() < finalChance;
}
