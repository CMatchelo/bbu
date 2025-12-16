import { selectTeamSchedule } from "../../selectors/data.scheduleSelector";
import { useSelector } from "react-redux";
import {
  saveScheduleThunk,
  setMatchResult,
} from "../../store/slices/scheduleSlice";
import { useUser } from "../../Context/UserContext";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { TableHeader } from "../../Components/tableHeader";
import { TableTD } from "../../Components/tableTd";

export default function Calendar() {
  const { user } = useUser();
  const teamSchedule = useSelector(
    selectTeamSchedule(user?.currentUniversity.id || "")
  );
  const dispatch = useAppDispatch();

  console.log(teamSchedule);

  const matchResult = {
    matchId: "d3ece8e6-fbcf-4762-9077-1ae0e9a7b00f",
    homeScore: 80,
    awayScore: 49,
  };

  const setResult = () => {
    if (!user) return;
    dispatch(setMatchResult(matchResult));
    dispatch(saveScheduleThunk(`${user.name}_${user?.id}`));
  };

  return (
    <div className="flex flex-col items-start gap-4 px-4">
      Season calendar
      <table className="w-full table-fixed divide-y divide-highlights1 shadow rounded-lg">
        <colgroup>
          <col className="w-1/12"></col>
          <col className="w-2/12"></col>
          <col className="w-1/12"></col>
          <col className="w-1/12"></col>
          <col className="w-1/12"></col>
          <col className="w-2/12"></col>
          <col className="w-1/12"></col>
          <col className="w-2/12"></col>
        </colgroup>
        <thead className="bg-gray-cardbg bg-cardbglight">
          <TableHeader colspan={2}>Home</TableHeader>
          <TableHeader colspan={3}>X</TableHeader>
          <TableHeader colspan={2}>Away</TableHeader>
          <TableHeader colspan={1}>Championship</TableHeader>
        </thead>
        <tbody className="divide-y divide-highlights1">
          {teamSchedule.map((match, index) => (
            <tr key={match.id}>
              <TableTD index={index}>{match.homeTeam.id.toUpperCase()}</TableTD>
              <TableTD index={index}>{match.homeTeam.nickname}</TableTD>
              <TableTD index={index}>{match.played && (<>{match.result?.homeScore}</>)}</TableTD>
              <TableTD index={index}>vs</TableTD>
              <TableTD index={index}>{match.played && (<>{match.result?.awayScore}</>)}</TableTD>
              <TableTD index={index}>{match.awayTeam.nickname}</TableTD>
              <TableTD index={index}>{match.awayTeam.id.toUpperCase()}</TableTD>
              <TableTD index={index}>Regional</TableTD>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={setResult}>Mudar resultado</button>
    </div>
  );
}
