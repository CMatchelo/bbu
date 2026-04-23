import {
  calculateBenchRecovery,
  calculateStaminaSpent,
} from "./matchAuxFunctions";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { PossessionResult } from "../types/PossessionResult";
import { University } from "../types/University";
import { Player } from "../types/Player";
import { TeamGameStats } from "../types/TeamGameStats";

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
) {
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

  updatedStats = updateStamina(
    updatedStats,
    duration,
    interval,
    homeUniversity,
    awayUniversity,
    homeLineup,
    awayLineup,
  );

  return updatedStats;
}

function applyShotStats(
  stats: Record<string, PlayerGameStats>,
  possession: PossessionResult,
  homeLineup: Player[],
  awayLineup: Player[],
) {
  if (!possession.success) return stats;

  const shooterId = possession.selectedPlayer.id;
  const shooter = stats[shooterId];
  if (!shooter) return stats;

  const isThree = possession.shotType === "THREE";

  const scoringTeamId = possession.selectedPlayer.currentUniversity;

  const updated = { ...stats };

  updated[shooterId] = {
    ...shooter,
    fga: shooter.fga + 1,
    fgm: shooter.fgm + 1,
    tpa: shooter.tpa + (isThree ? 1 : 0),
    tpm: shooter.tpm + (isThree ? 1 : 0),
    points: shooter.points + possession.points,
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

  console.log(updated)

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

  const updated = { ...stats };

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
) {
  const updatedStats = { ...stats };

  const allPlayers = [
    ...(homeUniversity.players || []),
    ...(awayUniversity.players || []),
  ];

  const onCourtIds = new Set([
    ...homeLineup.map((p) => p.id),
    ...awayLineup.map((p) => p.id),
  ]);

  allPlayers.forEach((player) => {
    const playerStats = updatedStats[player.id];
    if (!playerStats) return;

    const intervalRest = interval ? calculateBenchRecovery(150) : 0;

    if (onCourtIds.has(player.id)) {
      const staminaSpent = calculateStaminaSpent(duration, player.stamina);

      updatedStats[player.id] = {
        ...playerStats,
        stamina: Number(
          Math.min(
            100,
            Math.max(0, playerStats.stamina - staminaSpent + intervalRest),
          ).toFixed(1),
        ),
      };

      return;
    }

    const recovery = calculateBenchRecovery(duration);

    updatedStats[player.id] = {
      ...playerStats,
      stamina: Number(
        Math.min(100, playerStats.stamina + recovery + intervalRest).toFixed(1),
      ),
    };
  });

  return updatedStats;
}
