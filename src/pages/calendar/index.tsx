import { selectTeamSchedule } from "../../selectors/data.scheduleSelector";
import { useSelector } from "react-redux";
import { useUser } from "../../Context/UserContext";
import { MatchesTable } from "../../Components/MatchesTable";
import { ParentSecion } from "../../Components/ParentSection";
import { useMemo } from "react";

export default function Calendar() {
  const { user } = useUser();

  const teamSelector = useMemo(() => selectTeamSchedule(user?.currentUniversity.id || ""), [user?.currentUniversity.id]);
  const teamSchedule = useSelector(teamSelector);

  return (
    <ParentSecion>
      Season calendar
      <MatchesTable schedule={teamSchedule} />
    </ParentSecion>
  );
}
