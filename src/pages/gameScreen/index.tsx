import { useAppSelector } from "../../hooks/useAppDispatch";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import formatTime from "../../utils/formatTime";
import { PlayLine } from "./components/playLine";
import { selectGameContext } from "../../selectors/inGameTeam.selector";
import { useGameSimulation } from "../../game/runGameSimulation";

export default function GameScreen() {
  const { user } = useUser();
  const navigate = useNavigate();

  const gameContext = useAppSelector((state) =>
    selectGameContext(state, user?.currentUniversity.id)
  );

  if (!gameContext) return null;

  const { homeUniversity, awayUniversity } = gameContext;

  // 🔑 GAME ENGINE
  const {
    quarter,
    timeLeft,
    homeScore,
    awayScore,
    isGameOver,
    logPlays,
    playerState,
    homeLineup,
    awayLineup,
    runNextPossession,
  } = useGameSimulation({
    homeUniversity,
    awayUniversity,
    playerTeamId: user?.currentUniversity.id || "",
  });

  console.log(playerState);

  return (
    <div className="flex flex-col min-w-full h-full pt-10 justify-between overflow-hidden">
      <div className="flex flex-col items-center gap-4">
        <h2>
          Q{quarter} – {formatTime(timeLeft)}
        </h2>

        <div className="grid grid-cols-7 text-center items-center w-1/2 self-center">
          <div className="col-span-3">
            <h1>{homeUniversity.nickname}</h1>
          </div>

          <div className="col-span-1">
            <h2>
              {homeScore} x {awayScore}
            </h2>
          </div>

          <div className="col-span-3">
            <h1>{awayUniversity.nickname}</h1>
          </div>
        </div>

        <button onClick={runNextPossession} disabled={isGameOver}>
          Posse
        </button>

        <button onClick={() => navigate("/team")}>Voltar</button>

        <div className="flex-1 w-full overflow-y-scroll px-20 scrollbar-hide">
          <div className="flex flex-row justify-center gap-8">
            <PlayLine logPlays={logPlays} team="HOME" />
            <PlayLine logPlays={logPlays} team="AWAY" />
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center p-4 gap-40 border-t w-full bg-mainbglight">
        <div>
          {homeLineup.map((p) => (
            <div key={p.id} className="flex flex-row">
              <div>
                {p.firstName} {p.lastName}
              </div>
            </div>
          ))}
        </div>

        <div>
          {awayLineup.map((p) => (
            <div key={p.id} className="flex flex-row">
              <div>
                {p.firstName} {p.lastName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
