import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { useUser } from "../../Context/UserContext";
import { selectGameContext } from "../../selectors/inGameTeam.selector";
import { useGameSimulation } from "../../game/runGameSimulation";
import { PlayerTable } from "./components/PlayersTable";
import { TeamPlayCol } from "./components/playLine";
import { TeamStats } from "./components/TeamStats";
import { Scoreboard } from "./components/Scoreboard";
import { LineupPopup } from "./components/LineupPopup";
import { TimeoutRow } from "./components/TimeoutRow";
import { useLineupPopup } from "./hooks/useLineupPopup";
import { useSaveGame } from "./hooks/useSaveGame";
import { useInGameMusic } from "../../hooks/useInGameMusic";

export default function GameScreen() {
  const { user } = useUser();
  const gameContext = useAppSelector((state) =>
    selectGameContext(state, user?.currentUniversity.id),
  );

  if (!gameContext) return <Navigate to="/team" replace />;

  return <GameScreenInner />;
}

// ─── Inner component ──────────────────────────────────────────────────────────

function GameScreenInner() {
  const { user } = useUser();
  useInGameMusic();

  const gameContext = useAppSelector((state) =>
    // Non-null assertion is safe: the guard above guarantees context exists
    selectGameContext(state, user!.currentUniversity.id),
  )!;

  const { homeUniversity, awayUniversity, match } = gameContext;

  // ── Game engine ──────────────────────────────────────────────────────────
  const {
    quarter,
    timeLeft,
    isGameOver,
    homeStats,
    awayStats,
    logPlays,
    playerStats,
    homeLineup,
    awayLineup,
    isPlayerHome,
    userTimeouts,
    cpuTimeouts,
    setUserTimeouts,
    cpuWantsTimeout,
    setCpuWantsTimeout,
    checkCPUSub,
    callCpuTimeout,
    runNextPossession,
  } = useGameSimulation({
    homeUniversity,
    awayUniversity,
    playerTeamId: user!.currentUniversity.id,
  });

  // ── Lineup popup ─────────────────────────────────────────────────────────
  const { isOpen, canClose, open: openPopup, close: closePopup } = useLineupPopup();

  // ── Save / exit ──────────────────────────────────────────────────────────
  const { isSaving, saveError, saveGame } = useSaveGame({
    user: user!,
    matchId: match.id,
    week: match.week,
    currentSeason: user!.currentSeason,
    playerTeamId: user!.currentUniversity.id,
    homePoints: homeStats.points,
    awayPoints: awayStats.points,
    playerGameStats: playerStats,
    homeStats,
    awayStats
  });

  // ── Auto-run possessions ─────────────────────────────────────────────────
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [speed, setSpeed] = useState<'fast' | 'normal' | 'slow'>('normal');
  const speedMs = speed === 'fast' ? 330 : speed === 'normal' ? 500 : 1000;
  const runNextPossessionRef = useRef(runNextPossession);
  useEffect(() => { runNextPossessionRef.current = runNextPossession; }, [runNextPossession]);

  useEffect(() => {
    if (!isAutoRunning || isGameOver) return;
    const interval = setInterval(() => runNextPossessionRef.current(), speedMs);
    return () => clearInterval(interval);
  }, [isAutoRunning, isGameOver, speedMs]);

  useEffect(() => {
    if (isGameOver) setIsAutoRunning(false);
  }, [isGameOver]);

  // ── Pause auto-run while popup is open ───────────────────────────────────
  const autoWasPausedForPopup = useRef(false);
  useEffect(() => {
    if (isOpen) {
      if (isAutoRunning) {
        autoWasPausedForPopup.current = true;
        setIsAutoRunning(false);
      }
    } else {
      if (autoWasPausedForPopup.current) {
        autoWasPausedForPopup.current = false;
        setIsAutoRunning(true);
      }
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── CPU timeout side-effect ──────────────────────────────────────────────
  useEffect(() => {
    if (!cpuWantsTimeout) return;
    callCpuTimeout();
    openPopup();
    setCpuWantsTimeout(false);
  }, [cpuWantsTimeout, setCpuWantsTimeout, callCpuTimeout, openPopup]);

  // ── User timeout handler ─────────────────────────────────────────────────
  const handleCallTimeout = () => {
    setUserTimeouts((prev) => prev - 1);
    checkCPUSub();
    openPopup();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <LineupPopup isOpen={isOpen} canClose={canClose} onClose={closePopup} playerStats={playerStats} />
      <div className="flex flex-col flex-1 pt-10 overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          <TimeoutRow
            isPlayerHome={isPlayerHome}
            userTimeouts={userTimeouts}
            cpuTimeouts={cpuTimeouts}
            onCallTimeout={handleCallTimeout}
          >
            <Scoreboard
              quarter={quarter}
              timeLeft={timeLeft}
              homeNickname={homeUniversity.nickname}
              awayNickname={awayUniversity.nickname}
              homePoints={homeStats.points}
              awayPoints={awayStats.points}
            />
          </TimeoutRow>
        </div>

        {/* TODO: replace with a proper styled button */}
        <div className="flex items-center justify-center gap-2 py-1">
          <button onClick={runNextPossession} disabled={isGameOver || isAutoRunning}>
            Posse
          </button>
          <button onClick={() => setIsAutoRunning((v) => !v)} disabled={isGameOver}>
            {isAutoRunning ? "Pausar" : "Play"}
          </button>
          <div className="flex gap-1 ml-2">
            {(['fast', 'normal', 'slow'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border transition-colors ${
                  speed === s
                    ? 'bg-highlights1/20 text-highlights1 border-highlights1/40'
                    : 'text-text2 border-white/10 hover:text-text1 hover:border-white/20'
                }`}
              >
                {s === 'fast' ? 'Rápido' : s === 'normal' ? 'Normal' : 'Lento'}
              </button>
            ))}
          </div>
        </div>

        <button onClick={saveGame} disabled={isSaving}>
          {isSaving ? "Saving…" : "Voltar"}
        </button>

        {saveError && (
          <p className="text-red-400 text-sm text-center mt-1" role="alert">
            {saveError}
          </p>
        )}

        {/* ── Play log + stats ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-20 scrollbar-hide">
          <div className="flex flex-row justify-center gap-8">
            <TeamStats stats={homeStats} />
            <TeamPlayCol logPlays={logPlays} team="HOME" />
            <TeamPlayCol logPlays={logPlays} team="AWAY" />
            <TeamStats stats={awayStats} isAway />
          </div>
        </div>
      </div>

      {/* ── Player tables footer ─────────────────────────────────────────── */}
      <div className="flex flex-row justify-center p-4 gap-5 border-t border-highlights2 w-full bg-mainbglight">
        <PlayerTable players={homeLineup} playerStats={playerStats} />
        <PlayerTable players={awayLineup} playerStats={playerStats} />
      </div>
    </div>
  );
}
