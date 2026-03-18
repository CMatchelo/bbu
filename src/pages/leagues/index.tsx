import { useSelector } from "react-redux";
import { selectAllMatches } from "../../selectors/data.scheduleSelector";
import { MatchesTable } from "../../Components/MatchesTable";
import { ParentSecion } from "../../Components/ParentSection";
import { simulateMatchWithoutPlayer } from "../../game/simulateMatch";
import { useAppDispatch } from "../../hooks/useAppDispatch";

export const Leagues = () => {
  const dispatch = useAppDispatch();
  const schedule = useSelector(selectAllMatches);
  const testFunc = () => {
    simulateMatchWithoutPlayer(schedule, 2, "ufpr", dispatch)
  }
  return (
    <ParentSecion>
      <span onClick={testFunc}>Partidas</span>
      <MatchesTable schedule={schedule} />
    </ParentSecion>
  );
};
