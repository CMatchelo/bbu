import { useAppSelector } from "../../hooks/useAppDispatch";
import {
  selectUniversitiesWithPlayers,
  selectUniversityById,
} from "../../selectors/data.selectors";
import { useUser } from "../../Context/UserContext";
import { selectCurrentRoundMatchByUniversity } from "../../selectors/data.scheduleSelector";
import { useEffect, useMemo, useState } from "react";
import { University } from "../../types/University";
import { RootState } from "../../store";
import { simulatePossession } from "../../game/simulatePossession";
import formatTime from "../../utils/formatTime";
import { Team } from "../../types/Team";
import { PossessionResult } from "../../types/PossessionResult";
import { Player } from "../../types/Player";
import { PlayLog } from "../../types/PlayLog";
import { PlayLine } from "./components/playLine";

export default function GameScreen() {
  const { user } = useUser();

  const playerStarters = useAppSelector(
    (state: RootState) => state.gameSettings.starters
  );

  const universities = useAppSelector(selectUniversitiesWithPlayers);

  const nextMatch = useAppSelector((state) =>
    user
      ? selectCurrentRoundMatchByUniversity(state, user.currentUniversity.id)
      : null
  );

  const homeUniversity = useMemo(
    () => universities.find((u) => u.id === nextMatch?.home),
    [universities, nextMatch]
  );

  const awayUniversity = useMemo(
    () => universities.find((u) => u.id === nextMatch?.away),
    [universities, nextMatch]
  );

  const playerUniversityId = user?.currentUniversity.id;
  const cpuUniversityId =
    homeUniversity?.id === playerUniversityId
      ? awayUniversity?.id
      : homeUniversity?.id;

  const playerUniversityWithPlayers = universities.find(
    (u) => u.id === playerUniversityId
  );

  const cpuUniversityWithPlayers = universities.find(
    (u) => u.id === cpuUniversityId
  );

  const QUARTER_DURATION = 10 * 60;
  const [timeoutsPlayer, setTimeoutsPlayer] = useState<number>(8);
  const [timeoutsCPU, setTimeoutsCPU] = useState<number>(8);
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [quarter, setQuarter] = useState(1);
  const [timeLeft, setTimeLeft] = useState(QUARTER_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [logPlays, setLogPlays] = useState<PlayLog[]>([]);
  const [currentPoss, setCurrentPoss] = useState<string | null | undefined>(
    null
  );
  const [possNumber, setPossNumber] = useState<number>(0);

  useEffect(() => {
    if (!nextMatch) return;
    if (currentPoss !== null) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPoss(Math.random() < 0.5 ? nextMatch.home : nextMatch.away);
  }, [nextMatch]);

  const handleEndOfQuarter = () => {
    setQuarter((q) => {
      if (q === 4) {
        setIsGameOver(true);
        return q;
      }
      return q + 1;
    });
  };

  function runPossession(params: {
    currentPoss: string;
    homeId: string;
    awayId: string;
    homePlayers: Player[];
    awayPlayers: Player[];
    timeLeft: number;
  }) {
    const possessionResult = simulatePossession(
      params.currentPoss === params.homeId
        ? params.homePlayers
        : params.awayPlayers,
      params.currentPoss === params.homeId
        ? params.awayPlayers
        : params.homePlayers,
      params.currentPoss === params.homeId,
      80
    );

    const duration = Math.floor(Math.random() * 20) + 5;

    return {
      possessionResult,
      duration,
    };
  }

  useEffect(() => {
    if (
      !playerUniversityWithPlayers ||
      !cpuUniversityWithPlayers ||
      isGameOver
    ) {
      return;
    }

    const { possessionResult, duration } = runPossession({
      currentPoss,
      homeId: homeUniversity!.id,
      awayId: awayUniversity!.id,
      homePlayers: playerUniversityWithPlayers.players!,
      awayPlayers: cpuUniversityWithPlayers.players!,
      timeLeft,
    });

    // Log
    console.log(possessionResult);
    setLogPlays((prev) => [
      ...prev,
      {
        team: currentPoss === homeUniversity?.id ? "HOME" : "AWAY",
        result: possessionResult,
      },
    ]);

    // Score
    if (possessionResult.points > 0) {
      if (currentPoss === homeUniversity?.id) {
        setHomeScore((s) => s + possessionResult.points);
      } else {
        setAwayScore((s) => s + possessionResult.points);
      }
    }

    // Clock
    setTimeLeft((prev) => {
      if (prev - duration <= 0) {
        handleEndOfQuarter();
        return QUARTER_DURATION;
      }
      return prev - duration;
    });

    // Possession switch
    if (possessionResult.success || possessionResult.result === "def_rebound") {
      setCurrentPoss((prev) =>
        prev === homeUniversity?.id ? awayUniversity?.id : homeUniversity?.id
      );
    }
  }, [possNumber]);

  const testFunc = () => {
    console.log(possNumber);
    setPossNumber((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2>
        Q{quarter} – {formatTime(timeLeft)}
      </h2>
      <div className="grid grid-cols-3">
        <h1>{homeUniversity?.nickname}</h1>
        <h2>
          {homeScore} x {awayScore}
        </h2>
        <h1>{awayUniversity?.nickname}</h1>
      </div>
      <button onClick={testFunc}>Posse</button>
      <div className="grid grid-cols-6 w-full gap-8">
        <PlayLine logPlays={logPlays} team="HOME" />
        <PlayLine logPlays={logPlays} team="AWAY" />
      </div>
    </div>
  );
}
