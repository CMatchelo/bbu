import { useEffect, useMemo, useRef, useState } from "react";
import { University } from "../types/University";
import { PlayLog } from "../types/PlayLog";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { simulatePossession } from "./simulatePossession";
import { initializePlayerState } from "./initializePlayersState";
import { PossessionResult } from "../types/PossessionResult";
import { selectCpuStarters } from "./selectCpuStarters";
import { useAppSelector } from "../hooks/useAppDispatch";
import { RootState } from "../store";

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
  const [quarter, setQuarter] = useState(1);
  const [timeLeft, setTimeLeft] = useState(QUARTER_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentPoss, setCurrentPoss] = useState<string | null>(null);
  const [logPlays, setLogPlays] = useState<PlayLog[]>([]);
  const [playerState, setPlayerState] = useState<Record<
    string,
    PlayerGameStats
  > | null>(null);

  const isPlayerHome = homeUniversity.id === playerTeamId;

  const playerTeam = isPlayerHome ? homeUniversity : awayUniversity;
  const cpuTeam = isPlayerHome ? awayUniversity : homeUniversity;

  const cpuStarters = useMemo(
    () => selectCpuStarters(cpuTeam.players || []),
    [cpuTeam.players]
  );

  const playerStarters = useAppSelector(
    (state: RootState) => state.gameSettings.starters
  );

  const homeLineup = isPlayerHome ? playerStarters : cpuStarters;
  const awayLineup = isPlayerHome ? cpuStarters : playerStarters;

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

    setPlayerState(
      initializePlayerState(
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
    return Math.floor(Math.random() * 20) + 5;
  }

  function getNextPossession(current: string) {
    return current === homeUniversity.id
      ? awayUniversity.id
      : homeUniversity.id;
  }

  function updateStats(
    stats: Record<string, PlayerGameStats>,
    possession: PossessionResult
  ) {
    const shooterId = possession.selectedPlayer.id;
    const shooter = stats[shooterId];

    if (!shooter) return stats;

    const isThree = possession.shotType === "THREE";

    const updatedStats: Record<string, PlayerGameStats> = { ...stats };

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

    if (possession.blockBy) {
      const blockerId = possession.blockBy.id;
      const blocker = stats[blockerId]
      updatedStats[blockerId] = {
        ...blocker,
        blocks: shooter.blocks + 1,
      };
    }

    if (possession.turnoverBy && possession.stealedBy) {
      const turnoverId = possession.turnoverBy.id;
      const stealId = possession.stealedBy.id;
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

    return updatedStats;
  }

  // ─────────────────────────────────────────────
  // Game loop
  // ─────────────────────────────────────────────
  function runNextPossession() {
    if (isGameOver || !currentPoss || !playerState || timeLeft <= 0) {
      return;
    }

    const offenseIsHome = currentPoss === homeUniversity.id;

    const offensePlayers = offenseIsHome ? homeLineup! : awayLineup!;

    const defensePlayers = offenseIsHome ? awayLineup! : homeLineup!;

    const possessionResult = simulatePossession(
      offensePlayers,
      defensePlayers,
      offenseIsHome,
      80
    );

    const duration = getPossessionDuration();

    // 1️⃣ Log play
    setLogPlays((prev) => [
      ...prev,
      {
        team: offenseIsHome ? "HOME" : "AWAY",
        result: possessionResult,
      },
    ]);

    // 2️⃣ Update score
    if (possessionResult.points > 0) {
      if (offenseIsHome) {
        setHomeScore((s) => s + possessionResult.points);
      } else {
        setAwayScore((s) => s + possessionResult.points);
      }
    }

    // 3️⃣ Update player stats
    setPlayerState((prev) =>
      prev ? updateStats(prev, possessionResult) : prev
    );

    // 4️⃣ Clock + quarter
    setTimeLeft((prev) => {
      const next = prev - duration;

      if (next <= 0) {
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

    // 5️⃣ Switch possession
    if (
      possessionResult.success ||
      possessionResult.result === "def_rebound" ||
      possessionResult.result === "turnover"
    ) {
      setCurrentPoss((prev) => (prev ? getNextPossession(prev) : prev));
    }
  }

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
    cpuStarters,
    playerStarters,
    homeLineup,
    awayLineup,
    isPlayerHome,

    currentPoss,
    playerState,
    logPlays,
    runNextPossession,
  };
}
