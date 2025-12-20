import { useAppSelector } from "../../hooks/useAppDispatch";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import formatTime from "../../utils/formatTime";
import { TeamPlayCol } from "./components/playLine";
import { selectGameContext } from "../../selectors/inGameTeam.selector";
import { useGameSimulation } from "../../game/runGameSimulation";
import { PlayerTable } from "./components/PlayersTable";
import { useState } from "react";

export default function GameScreen() {
  const { user } = useUser();
  const navigate = useNavigate();

  const gameContext = useAppSelector((state) =>
    selectGameContext(state, user?.currentUniversity.id)
  );

  const [userTimeouts, setUserTimeouts] = useState<number>(8);
  const [cpuTimeouts, setCpuTimeouts] = useState<number>(8);

  if (!gameContext) return null;

  const { homeUniversity, awayUniversity } = gameContext;

  // 🔑 GAME ENGINE
  const {
    quarter,
    timeLeft,
    isGameOver,

    homeScore,
    awayScore,

    logPlays,
    playerState,
    homeLineup,
    awayLineup,
    isPlayerHome,
    runNextPossession,
  } = useGameSimulation({
    homeUniversity,
    awayUniversity,
    playerTeamId: user?.currentUniversity.id || "",
  });

  return (
    <div className="flex flex-col h-screen pt-10 overflow-hidden">
      <div className="flex flex-col flex-1 pt-10 overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          {/* Quarter + Clock */}
          <h2 className="text-lg font-semibold tracking-wide text-gray-300">
            Q{quarter} –{" "}
            <span className="font-mono text-white">{formatTime(timeLeft)}</span>
          </h2>

          {/* Scoreboard */}
          <div className="grid grid-cols-7 items-center w-1/2 rounded-xl border border-highlights1 mb-5 bg-white/5 px-6 py-4 backdrop-blur-sm shadow-md">
            {/* Home */}
            <div className="col-span-3 text-right">
              <h1 className="text-xl font-bold tracking-wide">
                {homeUniversity.nickname}
              </h1>
            </div>

            {/* Score */}
            <div className="col-span-1 text-center">
              <h2 className="text-2xl font-extrabold text-white">
                {homeScore}
                <span className="mx-1 text-gray-400">x</span>
                {awayScore}
              </h2>
            </div>

            {/* Away */}
            <div className="col-span-3 text-left">
              <h1 className="text-xl font-bold tracking-wide">
                {awayUniversity.nickname}
              </h1>
            </div>
          </div>
        </div>

        <button onClick={runNextPossession} disabled={isGameOver}>
          Posse
        </button>

        <button onClick={() => navigate("/team")}>Voltar</button>
        <div className="flex-1 overflow-y-auto px-20 scrollbar-hide">
          <div className="flex flex-row justify-center gap-8">
            <TeamPlayCol logPlays={logPlays} team="HOME" />
            <TeamPlayCol logPlays={logPlays} team="AWAY" />
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center p-4 gap-10 border-t border-highlights2 w-full bg-mainbglight">
        <div className="flex-1">
          {isPlayerHome && (
            <div className="flex flex-col gap-4">
              <span>Timeouts remaining: {userTimeouts}</span>
              <button
                className="
                p-3 rounded-xl shadow-2xl mt-2
                bg-highlights1 text-gray-700 hover:bg-highlights1light transition
              "
              >
                CALL TIMEOUT
              </button>
            </div>
          )}
        </div>
        <PlayerTable players={homeLineup} playerStats={playerState} />
        <PlayerTable players={awayLineup} playerStats={playerState} />
        <div className="flex-1 self-center">
          {!isPlayerHome && (
            <div className="flex flex-col gap-4">
              <span>Timeouts remaining: {userTimeouts}</span>
              <button
                className="
                p-3 rounded-xl shadow-2xl mt-2
                bg-highlights1 text-gray-700 hover:bg-highlights1light transition
              "
              >
                CALL TIMEOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
