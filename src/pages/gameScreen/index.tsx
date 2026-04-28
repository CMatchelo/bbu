import { useEffect } from "react";
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
    playerTeamId: user!.currentUniversity.id,
    homePoints: homeStats.points,
    awayPoints: awayStats.points,
    playerGameStats: playerStats,
    homeStats,
    awayStats
  });

  // ── CPU timeout side-effect ──────────────────────────────────────────────
  useEffect(() => {
    if (!cpuWantsTimeout) return;
    checkCPUSub();
    openPopup();
    setCpuWantsTimeout(false);
  }, [cpuWantsTimeout, setCpuWantsTimeout, checkCPUSub, openPopup]);

  // ── User timeout handler ─────────────────────────────────────────────────
  const handleCallTimeout = () => {
    setUserTimeouts((prev) => prev - 1);
    checkCPUSub();
    openPopup();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <LineupPopup isOpen={isOpen} canClose={canClose} onClose={closePopup} />
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
        <button onClick={runNextPossession} disabled={isGameOver}>
          Posse
        </button>

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
