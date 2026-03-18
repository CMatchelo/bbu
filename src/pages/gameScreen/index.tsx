import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import formatTime from "../../utils/formatTime";
import { TeamPlayCol } from "./components/playLine";
import { selectGameContext } from "../../selectors/inGameTeam.selector";
import { useGameSimulation } from "../../game/runGameSimulation";
import { PlayerTable } from "./components/PlayersTable";
import { useEffect, useState } from "react";
import { PlayerSelection } from "../TeamSelection/components/PlayersSelection";
import { PlayTypeSelection } from "../TeamSelection/components/PlayTypeSelection";
import { TimeoutBtn } from "./components/TimeoutBtn";
import { RootState } from "../../store";
import { TeamStats } from "./components/TeamStats";
import {
  incrementWeek,
  saveScheduleThunk,
  setMatchResult,
} from "../../store/slices/scheduleSlice";
import { simulateMatchWithoutPlayer } from "../../game/simulateMatch";
import { useSelector } from "react-redux";
import { selectAllMatches } from "../../selectors/data.scheduleSelector";

export default function GameScreen() {
  const { user } = useUser();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const gameContext = useAppSelector((state) =>
    selectGameContext(state, user?.currentUniversity.id),
  );

  const schedule = useSelector(selectAllMatches);

  const starters = useAppSelector(
    (state: RootState) => state.gameSettings.starters,
  );

  const [displayPopup, setDisplayPopup] = useState<boolean>(false);

  if (!gameContext) return null;

  const { homeUniversity, awayUniversity } = gameContext;

  // 🔑 GAME ENGINE
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
    playerTeamId: user?.currentUniversity.id || "",
  });

  const callTimeout = () => {
    setUserTimeouts((prev) => prev - 1);
    checkCPUSub();
    setDisplayPopup(true);
  };

  const closePopup = () => {
    if (starters.length < 5) return;
    setDisplayPopup(false);
  };

  const saveGame = async () => {
    if (!user) return;
    navigate("/team");
    const matchResult = {
      matchId: gameContext.match.id,
      homeScore: homeStats.points,
      awayScore: awayStats.points,
    };
    const folderName = `${user.name}_${user.id}`;
    dispatch(setMatchResult(matchResult));
    
    simulateMatchWithoutPlayer(schedule, gameContext.match.week, user.currentUniversity.id, dispatch)
    dispatch(incrementWeek());
    //dispatch(saveScheduleThunk(folderName));
  };

  useEffect(() => {
    if (!cpuWantsTimeout) return;

    checkCPUSub();
    setDisplayPopup(true);
    setCpuWantsTimeout(false);
  }, [cpuWantsTimeout, setCpuWantsTimeout]);

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
              onClick={closePopup}
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
            <TimeoutBtn
              isPlayerHome={isPlayerHome}
              timeoutsRemaining={isPlayerHome ? userTimeouts : cpuTimeouts}
              callTimeout={callTimeout}
              classname="self"
            />
            <div className="grid grid-cols-7 items-center w-1/2 rounded-xl border border-highlights1 bg-white/5 px-6 py-4 shadow-md">
              <div className="col-span-3 text-right">
                <h1 className="text-xl font-bold tracking-wide">
                  {homeUniversity.nickname}
                </h1>
              </div>

              <div className="col-span-1 text-center">
                <h2 className="text-2xl font-extrabold text-white">
                  {homeStats.points}
                  <span className="mx-1 text-gray-400">x</span>
                  {awayStats.points}
                </h2>
              </div>

              <div className="col-span-3 text-left">
                <h1 className="text-xl font-bold tracking-wide">
                  {awayUniversity.nickname}
                </h1>
              </div>
            </div>
            <TimeoutBtn
              isPlayerHome={!isPlayerHome}
              timeoutsRemaining={isPlayerHome ? cpuTimeouts : userTimeouts}
              callTimeout={callTimeout}
            />
          </div>
        </div>

        <button onClick={runNextPossession} disabled={isGameOver}>
          Posse
        </button>

        <button onClick={saveGame}>Voltar</button>

        <div className="flex-1 overflow-y-auto px-20 scrollbar-hide">
          <div className="flex flex-row justify-center gap-8">
            <TeamStats stats={homeStats} />
            <TeamPlayCol logPlays={logPlays} team="HOME" />
            <TeamPlayCol logPlays={logPlays} team="AWAY" />
            <TeamStats stats={awayStats} isAway />
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
