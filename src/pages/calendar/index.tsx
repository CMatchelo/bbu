import { selectTeamSchedule } from "../../selectors/data.scheduleSelector";
import { useSelector } from "react-redux";
import { useUser } from "../../Context/UserContext";
import { MatchesTable } from "../../Components/MatchesTable";
import { ParentSecion } from "../../Components/ParentSection";
import { useMemo } from "react";
import { StandingsTable } from "../../Components/StandingsTable";

export default function Calendar() {
  const { user } = useUser();

  const teamSelector = useMemo(() => selectTeamSchedule(user?.currentUniversity.id || ""), [user?.currentUniversity.id]);
  const teamSchedule = useSelector(teamSelector);
  console.log(user?.currentUniversity.leagueId)

  return (
    <ParentSecion>
      Season calendar
      <StandingsTable leagueId={user!.currentUniversity.leagueId} />
      <MatchesTable schedule={teamSchedule} />
    </ParentSecion>
  );
}
