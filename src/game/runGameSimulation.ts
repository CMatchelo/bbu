import { useRef, useState } from "react";
import { University } from "../types/University";
import { PlayLog } from "../types/PlayLog";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { simulatePossession } from "./simulatePossession";
import { initializePlayerStats } from "./initializePlayersState";
import { selectCpuStarters } from "./selectCpuStarters";
import { useAppSelector } from "../hooks/useAppDispatch";
import { RootState, store } from "../store";
import { shouldCallTimeout, substituteCPU, TimeoutState } from "./cpuSubs";
import { Player } from "../types/Player";
import { TeamGameStats } from "../types/TeamGameStats";
import { updateStats, updateTeamStats } from "./updateGameStats";
import { createEmptyTeamStats } from "../utils/createEmptyStats";
import { quarterDuration } from "../constants/quarterDuration";
import { TIMEOUTS_QTY } from "../constants/game.constants";
import { selectPlayersFromUniversity } from "../selectors/data.selectors";
import { setStarters } from "../store/slices/gameSettingsSlice";

const QUARTER_DURATION = quarterDuration;

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
  const [userTimeouts, setUserTimeouts] = useState<number>(TIMEOUTS_QTY);
  const [cpuTimeouts, setCpuTimeouts] = useState<number>(TIMEOUTS_QTY);
  const [cpuTimeoutsOnQrt, setCpuTimeoutsOnQrt] = useState<number>(0);
  const [quarter, setQuarter] = useState(1);
  const [timeLeft, setTimeLeft] = useState(QUARTER_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentPoss, setCurrentPoss] = useState<string>(() =>
    Math.random() < 0.5 ? homeUniversity.id : awayUniversity.id,
  );
  const [logPlays, setLogPlays] = useState<PlayLog[]>([]);
  const [cpuWantsTimeout, setCpuWantsTimeout] = useState(false);

  const [injuredUserPlayerIds, setInjuredUserPlayerIds] = useState<string[]>([]);
  const homePlayers = selectPlayersFromUniversity(
    store.getState(),
    homeUniversity.id,
  );
  const awayPlayers = selectPlayersFromUniversity(
    store.getState(),
    awayUniversity.id,
  );
  const [playerStats, setPlayerStats] = useState<
    Record<string, PlayerGameStats>
  >(() =>
    initializePlayerStats(
      homeUniversity.id,
      awayUniversity.id,
      homePlayers ?? [],
      awayPlayers ?? [],
    ),
  );

  const isPlayerHome = homeUniversity.id === playerTeamId;

  const playerTeam = isPlayerHome ? homeUniversity : awayUniversity;
  const cpuTeam = isPlayerHome ? awayUniversity : homeUniversity;

  const [cpuOnCourt, setCpuOnCourt] = useState<Player[]>(() =>
    selectCpuStarters(isPlayerHome ? awayPlayers : homePlayers || []),
  );

  const playerStarters = useAppSelector(
    (state: RootState) => state.gameSettings.starters,
  );

  const homeLineup = isPlayerHome ? playerStarters : cpuOnCourt;
  const awayLineup = isPlayerHome ? cpuOnCourt : playerStarters;

  const quarterAdvancedRef = useRef(false);

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
    const { updatedStats: newPlayerStats, newlyInjuredIds } = updateStats(
      playerStats,
      possessionResult,
      duration,
      interval,
      homeUniversity,
      awayUniversity,
      homeLineup,
      awayLineup,
    );
    setPlayerStats(newPlayerStats);

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

    if (newlyInjuredIds.length > 0) {
      const userLineup = isPlayerHome ? homeLineup : awayLineup;
      const cpuLineup = isPlayerHome ? awayLineup : homeLineup;

      const injuredUserIds = newlyInjuredIds.filter((id) =>
        userLineup.some((p) => p.id === id),
      );
      const injuredCpuIds = newlyInjuredIds.filter((id) =>
        cpuLineup.some((p) => p.id === id),
      );


      if (injuredUserIds.length > 0) {
        const currentStarters = store.getState().gameSettings.starters;
        const healthyStarters = currentStarters.filter(
          (p) => !injuredUserIds.includes(p.id),
        );
        store.dispatch(setStarters(healthyStarters));
        setInjuredUserPlayerIds(injuredUserIds);
        setCpuWantsTimeout(true); // pause game flow
      }

      
      if (injuredCpuIds.length > 0) {
        const cpuPlayers = isPlayerHome ? awayPlayers : homePlayers || [];
        const diffPoints = isPlayerHome
          ? awayStats.points - homeStats.points
          : homeStats.points - awayStats.points;
        const updatedCpuLineup = substituteCPU(
          cpuPlayers,
          cpuLineup,
          newPlayerStats,
          diffPoints,
        )
          .slice()
          .sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition));
        setCpuOnCourt(updatedCpuLineup);
      }
    }


    const timeoutState: TimeoutState = {
      used: TIMEOUTS_QTY - cpuTimeouts,
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
      substituteCPU(
        isPlayerHome ? awayPlayers : homePlayers || [],
        cpuOnCourt,
        playerStats,
        diffPoints,
      )
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

    injuredUserPlayerIds,
    setInjuredUserPlayerIds,

    checkCPUSub,

    currentPoss,
    playerStats,
    logPlays,
    runNextPossession,
  };
}