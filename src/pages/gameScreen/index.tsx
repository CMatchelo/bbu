import { useAppSelector } from "../../hooks/useAppDispatch";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import formatTime from "../../utils/formatTime";
import { TeamPlayCol } from "./components/playLine";
import { selectGameContext } from "../../selectors/inGameTeam.selector";
import { useGameSimulation } from "../../game/runGameSimulation";
import { PlayerTable } from "./components/PlayersTable";
import { useState } from "react";
import { PlayerSelection } from "../TeamSelection/components/PlayersSelection";
import { PlayTypeSelection } from "../TeamSelection/components/PlayTypeSelection";
import { TimeoutBtn } from "./components/TimeoutBtn";

export default function GameScreen() {
  const { user } = useUser();
  const navigate = useNavigate();

  const gameContext = useAppSelector((state) =>
    selectGameContext(state, user?.currentUniversity.id)
  );

  const [userTimeouts, setUserTimeouts] = useState<number>(8);
  const [cpuTimeouts, setCpuTimeouts] = useState<number>(8);
  const [displayPopup, setDisplayPopup] = useState<boolean>(false);

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
    playerStats,
    homeLineup,
    awayLineup,
    isPlayerHome,
    runNextPossession,
  } = useGameSimulation({
    homeUniversity,
    awayUniversity,
    playerTeamId: user?.currentUniversity.id || "",
  });

  const callTimeout = () => {
    setDisplayPopup((prev) => !prev);
    console.log(displayPopup);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {displayPopup && (
        <div
          className="absolute w-screen h-screen 
        flex items-center justify-center
        backdrop-blur-sm bg-black/20"
        >
          <div
            className="h-11/12 w-1/2 max-h-170 
          flex flex-col gap-4 items-center
          p-4 rounded-xl shadow-2xl
          bg-mainbgdark"
          >
            <PlayTypeSelection />
            <PlayerSelection />
            <button
              onClick={callTimeout}
              className="
                bg-highlights2 text-gray-700
                p-2 rounded-2xl
                hover:bg-highlights2light
                transition-colors duration-300 ease-out
              "
            >
              Return to game
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 pt-10 overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          {/* Quarter + Clock */}
          <h2 className="text-lg font-semibold tracking-wide text-gray-300">
            Q{quarter} –{" "}
            <span className="font-mono text-white">{formatTime(timeLeft)}</span>
          </h2>
          {/* Scoreboard */}
          <div className="w-full flex flex-row gap-4 justify-center items-center mb-5">
            <TimeoutBtn isPlayerHome={isPlayerHome} timeoutsRemaining={isPlayerHome ? userTimeouts : cpuTimeouts} callTimeout={callTimeout} classname="self" />
            <div className="grid grid-cols-7 items-center w-1/2 rounded-xl border border-highlights1 bg-white/5 px-6 py-4 shadow-md">
              <div className="col-span-3 text-right">
                <h1 className="text-xl font-bold tracking-wide">
                  {homeUniversity.nickname}
                </h1>
              </div>

              <div className="col-span-1 text-center">
                <h2 className="text-2xl font-extrabold text-white">
                  {homeScore}
                  <span className="mx-1 text-gray-400">x</span>
                  {awayScore}
                </h2>
              </div>

              <div className="col-span-3 text-left">
                <h1 className="text-xl font-bold tracking-wide">
                  {awayUniversity.nickname}
                </h1>
              </div>
            </div>
            <TimeoutBtn isPlayerHome={!isPlayerHome} timeoutsRemaining={isPlayerHome ? cpuTimeouts : userTimeouts} callTimeout={callTimeout} />
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

      <div className="flex flex-row justify-center p-4 gap-5 border-t border-highlights2 w-full bg-mainbglight">
        <PlayerTable players={homeLineup} playerStats={playerStats} />
        <PlayerTable players={awayLineup} playerStats={playerStats} />
      </div>
    </div>
  );
}
