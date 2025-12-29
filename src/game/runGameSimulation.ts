import { useEffect, useRef, useState } from "react";
import { University } from "../types/University";
import { PlayLog } from "../types/PlayLog";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { simulatePossession } from "./simulatePossession";
import { initializePlayerStats } from "./initializePlayersState";
import { PossessionResult } from "../types/PossessionResult";
import { selectCpuStarters } from "./selectCpuStarters";
import { useAppSelector } from "../hooks/useAppDispatch";
import { RootState } from "../store";
import {
  calculateBenchRecovery,
  calculateStaminaSpent,
} from "./matchAuxFunctions";
import { shouldCallTimeout, substituteCPU, TimeoutState } from "./cpuSubs";
import { Player } from "../types/Player";

const QUARTER_DURATION = 10 * 60;

interface UseGameSimulationParams {
  homeUniversity: University;
  awayUniversity: University;
  playerTeamId: string;
}

export function useGameSimulation({
  homeUniversity,
  awayUniversity,
  playerTeamId,
}: UseGameSimulationParams) {
  // ─────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [userTimeouts, setUserTimeouts] = useState<number>(8);
  const [cpuTimeouts, setCpuTimeouts] = useState<number>(8);
  const [cpuTimeoutsOnQrt, setCpuTimeoutsOnQrt] = useState<number>(0);
  const [quarter, setQuarter] = useState(1);
  const [timeLeft, setTimeLeft] = useState(QUARTER_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentPoss, setCurrentPoss] = useState<string | null>(null);
  const [logPlays, setLogPlays] = useState<PlayLog[]>([]);
  const [playerStats, setPlayerStats] = useState<Record<
    string,
    PlayerGameStats
  > | null>(null);

  const isPlayerHome = homeUniversity.id === playerTeamId;

  const playerTeam = isPlayerHome ? homeUniversity : awayUniversity;
  const cpuTeam = isPlayerHome ? awayUniversity : homeUniversity;

  const [cpuOnCourt, setCpuOnCourt] = useState<Player[]>(() =>
    selectCpuStarters(cpuTeam.players || [])
  );

  const playerStarters = useAppSelector(
    (state: RootState) => state.gameSettings.starters
  );

  const homeLineup = isPlayerHome ? playerStarters : cpuOnCourt;
  const awayLineup = isPlayerHome ? cpuOnCourt : playerStarters;

  const quarterAdvancedRef = useRef(false);

  // ─────────────────────────────────────────────
  // Initialization
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!homeUniversity.players || !awayUniversity.players) return;

    setHomeScore(0);
    setAwayScore(0);
    setQuarter(1);
    setTimeLeft(QUARTER_DURATION);
    setIsGameOver(false);
    setLogPlays([]);

    setPlayerStats(
      initializePlayerStats(
        homeUniversity.id,
        awayUniversity.id,
        homeUniversity.players,
        awayUniversity.players
      )
    );

    setCurrentPoss(Math.random() < 0.5 ? homeUniversity.id : awayUniversity.id);
  }, [homeUniversity, awayUniversity]);

  // ─────────────────────────────────────────────
  // Helpers (private)
  // ─────────────────────────────────────────────
  function getPossessionDuration() {
    return Math.floor(Math.random() * 10) + 15;
  }

  function getNextPossession(current: string) {
    return current === homeUniversity.id
      ? awayUniversity.id
      : homeUniversity.id;
  }

  function updateStats(
    stats: Record<string, PlayerGameStats>,
    possession: PossessionResult,
    duration: number
  ) {
    const shooterId = possession.selectedPlayer.id;
    const shooter = stats[shooterId];

    if (!shooter) return stats;

    const isThree = possession.shotType === "THREE";

    const updatedStats: Record<string, PlayerGameStats> = { ...stats };

    // If shot
    if (!possession.turnoverBy) {
      updatedStats[shooterId] = {
        ...shooter,
        fga: shooter.fga + 1,
        fgm: shooter.fgm + (possession.success ? 1 : 0),
        tpa: shooter.tpa + (isThree ? 1 : 0),
        tpm: shooter.tpm + (possession.success && isThree ? 1 : 0),
        points: shooter.points + possession.points,
      };
    }

    // Block
    if (possession.blockBy) {
      const blockerId = possession.blockBy.id;
      const blocker = stats[blockerId];
      updatedStats[blockerId] = {
        ...blocker,
        blocks: shooter.blocks + 1,
      };
    }

    // Turnover
    if (possession.turnoverBy && possession.stolenBy) {
      const turnoverId = possession.turnoverBy.id;
      const stealId = possession.stolenBy.id;
      const turnover = stats[turnoverId];
      const stealer = stats[stealId];

      if (turnover) {
        updatedStats[turnoverId] = {
          ...turnover,
          turnovers: turnover.turnovers + 1,
        };
      }
      if (stealer) {
        updatedStats[stealId] = {
          ...stealer,
          steals: stealer.steals + 1,
        };
      }
    }

    // Assist
    if (possession.assistBy) {
      const assistId = possession.assistBy.id;
      const assister = stats[assistId];

      if (assister) {
        updatedStats[assistId] = {
          ...assister,
          assists: assister.assists + 1,
        };
      }
    }

    // Rebound
    if (possession.reboundWinnerPlayer) {
      const rebounderId = possession.reboundWinnerPlayer.id;
      const rebounder = stats[rebounderId];

      if (rebounder) {
        updatedStats[rebounderId] = {
          ...rebounder,
          rebounds: rebounder.rebounds + 1,
        };
      }
    }

    const allPlayers = [
      ...(homeUniversity.players || []),
      ...(awayUniversity.players || []),
    ];

    const onCourtIds = new Set<string>([
      ...homeLineup.map((p) => p.id),
      ...awayLineup.map((p) => p.id),
    ]);

    allPlayers.forEach((currentPlayer) => {
      const playerStats = updatedStats[currentPlayer.id];
      if (!playerStats) return;

      if (onCourtIds.has(currentPlayer.id)) {
        const staminaSpent = calculateStaminaSpent(
          duration,
          currentPlayer.stamina
        );

        updatedStats[currentPlayer.id] = {
          ...playerStats,
          stamina: Number(
            Math.max(0, playerStats.stamina - staminaSpent).toFixed(1)
          ),
        };
        return;
      }
      const recovery = calculateBenchRecovery(duration);

      updatedStats[currentPlayer.id] = {
        ...playerStats,
        stamina: Number(
          Math.min(100, playerStats.stamina + recovery).toFixed(1)
        ),
      };
    });

    return updatedStats;
  }

  // ─────────────────────────────────────────────
  // Game loop
  // ─────────────────────────────────────────────
  function runNextPossession() {
    if (isGameOver || !currentPoss || !playerStats || timeLeft <= 0) {
      return;
    }

    const offenseIsHome = currentPoss === homeUniversity.id;

    const offensePlayers = offenseIsHome ? homeLineup! : awayLineup!;

    const defensePlayers = offenseIsHome ? awayLineup! : homeLineup!;

    const possessionResult = simulatePossession(
      offensePlayers,
      defensePlayers,
      offenseIsHome,
      80,
      playerStats
    );

    const duration = getPossessionDuration();

    // Log play
    setLogPlays((prev) => [
      ...prev,
      {
        team: offenseIsHome ? "HOME" : "AWAY",
        result: possessionResult,
      },
    ]);

    // Update score
    if (possessionResult.success) {
      if (offenseIsHome) {
        setHomeScore((s) => s + possessionResult.points);
      } else {
        setAwayScore((s) => s + possessionResult.points);
      }
    }

    // Clock + quarter
    setTimeLeft((prev) => {
      const next = prev - duration;

      if (next <= 0) {
        setCpuTimeoutsOnQrt(0)
        if (quarter === 4) {
          setIsGameOver(true);
          return 0;
        }
        if (!quarterAdvancedRef.current) {
          quarterAdvancedRef.current = true;
          setQuarter((q) => q + 1);
        }
        return QUARTER_DURATION;
      }
      quarterAdvancedRef.current = false;
      return next;
    });

    // Update player stats
    setPlayerStats((prev) =>
      prev ? updateStats(prev, possessionResult, duration) : prev
    );

    // Switch possession
    if (
      possessionResult.success ||
      possessionResult.result === "def_rebound" ||
      possessionResult.result === "turnover"
    ) {
      setCurrentPoss((prev) => (prev ? getNextPossession(prev) : prev));
    }

    const timeoutState: TimeoutState = {used: 8 - cpuTimeouts, usedThisQuarter: cpuTimeoutsOnQrt}
    const diffPoints = isPlayerHome
        ? awayScore - homeScore
        : homeScore - awayScore;
    const shouldCPUTimeout = shouldCallTimeout(quarter, timeLeft, timeoutState, playerStats, cpuOnCourt, diffPoints)
    if (shouldCPUTimeout) checkCPUSub(playerStats)
  }

  const checkCPUSub = (playerStats: Record<string, PlayerGameStats>) => {
      const diffPoints = isPlayerHome
        ? awayScore - homeScore
        : homeScore - awayScore;
      const updateCpuOnCourt =
        substituteCPU(
          cpuTeam.players || [],
          cpuOnCourt,
          playerStats,
          diffPoints
        )
          .slice()
          .sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition)) ||
        [];

      setCpuOnCourt(updateCpuOnCourt);
      setCpuTimeouts((prev) => prev - 1)
      setCpuTimeoutsOnQrt((prev) => prev + 1)
    };

  // ─────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────
  return {
    quarter,
    timeLeft,
    isGameOver,

    homeScore,
    awayScore,

    playerTeam,
    cpuTeam,
    cpuOnCourt,
    playerStarters,
    homeLineup,
    awayLineup,
    isPlayerHome,

    userTimeouts,
    cpuTimeouts,
    setUserTimeouts,

    currentPoss,
    playerStats,
    logPlays,
    runNextPossession,
  };
}
