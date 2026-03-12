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
import { shouldCallTimeout, substituteCPU, TimeoutState } from "./cpuSubs";
import { Player } from "../types/Player";
import { TeamGameStats } from "../types/TeamGameStats";
import { updateStats, updateTeamStats } from "./updateGameStats";
import { createEmptyTeamStats } from "../utils/createEmptyStats";

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

  const [homeStats, setHomeStats] = useState<TeamGameStats>(
    createEmptyTeamStats(homeUniversity.id),
  );

  const [awayStats, setAwayStats] = useState<TeamGameStats>(
    createEmptyTeamStats(awayUniversity.id),
  );
  const [userTimeouts, setUserTimeouts] = useState<number>(8);
  const [cpuTimeouts, setCpuTimeouts] = useState<number>(8);
  const [cpuTimeoutsOnQrt, setCpuTimeoutsOnQrt] = useState<number>(0);
  const [quarter, setQuarter] = useState(1);
  const [timeLeft, setTimeLeft] = useState(QUARTER_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentPoss, setCurrentPoss] = useState<string | null>(null);
  const [logPlays, setLogPlays] = useState<PlayLog[]>([]);
  const [cpuWantsTimeout, setCpuWantsTimeout] = useState(false);
  const [playerStats, setPlayerStats] = useState<Record<
    string,
    PlayerGameStats
  > | null>(null);

  const isPlayerHome = homeUniversity.id === playerTeamId;

  const playerTeam = isPlayerHome ? homeUniversity : awayUniversity;
  const cpuTeam = isPlayerHome ? awayUniversity : homeUniversity;

  const [cpuOnCourt, setCpuOnCourt] = useState<Player[]>(() =>
    selectCpuStarters(cpuTeam.players || []),
  );

  const playerStarters = useAppSelector(
    (state: RootState) => state.gameSettings.starters,
  );

  const homeLineup = isPlayerHome ? playerStarters : cpuOnCourt;
  const awayLineup = isPlayerHome ? cpuOnCourt : playerStarters;

  const quarterAdvancedRef = useRef(false);

  useEffect(() => {
    console.log(homeStats, awayStats);
  }, [homeStats, awayStats]);

  // ─────────────────────────────────────────────
  // Initialization
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!homeUniversity.players || !awayUniversity.players) return;

    setQuarter(1);
    setTimeLeft(QUARTER_DURATION);
    setIsGameOver(false);
    setLogPlays([]);

    setPlayerStats(
      initializePlayerStats(
        homeUniversity.id,
        awayUniversity.id,
        homeUniversity.players,
        awayUniversity.players,
      ),
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
      playerStats,
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

    let interval = false;

    // Clock + quarter
    setTimeLeft((prev) => {
      const next = prev - duration;

      if (next <= 0) {
        interval = true;
        setCpuTimeoutsOnQrt(0);
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
      prev
        ? updateStats(
            prev,
            possessionResult,
            duration,
            interval,
            homeUniversity,
            awayUniversity,
            homeLineup,
            awayLineup,
          )
        : prev,
    );

    const result = updateTeamStats(homeStats, awayStats, possessionResult);

    setHomeStats(result.newHomeStats);
    setAwayStats(result.newAwayStats);

    // Switch possession
    if (
      possessionResult.success ||
      possessionResult.result === "def_rebound" ||
      possessionResult.result === "turnover"
    ) {
      setCurrentPoss((prev) => (prev ? getNextPossession(prev) : prev));
    }

    const timeoutState: TimeoutState = {
      used: 8 - cpuTimeouts,
      usedThisQuarter: cpuTimeoutsOnQrt,
    };
    const diffPoints = isPlayerHome
      ? awayStats.points - homeStats.points
      : homeStats.points - awayStats.points;
    const shouldCPUTimeout = shouldCallTimeout(
      quarter,
      timeLeft,
      timeoutState,
      playerStats,
      cpuOnCourt,
      diffPoints,
    );
    if (shouldCPUTimeout) {
      setCpuWantsTimeout(true);
    }
  }

  const checkCPUSub = () => {
    if (!playerStats) return;

    const diffPoints = isPlayerHome
      ? awayStats.points - homeStats.points
      : homeStats.points - awayStats.points;
    const updateCpuOnCourt =
      substituteCPU(cpuTeam.players || [], cpuOnCourt, playerStats, diffPoints)
        .slice()
        .sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition)) ||
      [];

    setCpuOnCourt(updateCpuOnCourt);
    setCpuTimeouts((prev) => prev - 1);
    setCpuTimeoutsOnQrt((prev) => prev + 1);
  };

  // ─────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────
  return {
    quarter,
    timeLeft,
    isGameOver,

    awayStats,
    homeStats,

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

    cpuWantsTimeout,
    setCpuWantsTimeout,

    checkCPUSub,

    currentPoss,
    playerStats,
    logPlays,
    runNextPossession,
  };
}
