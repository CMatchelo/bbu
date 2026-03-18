import { selectTeamSchedule } from "../../selectors/data.scheduleSelector";
import { useSelector } from "react-redux";
import { useUser } from "../../Context/UserContext";
import { MatchesTable } from "../../Components/MatchesTable";
import { ParentSecion } from "../../Components/ParentSection";

export default function Calendar() {
  const { user } = useUser();
  const teamSchedule = useSelector(
    selectTeamSchedule(user?.currentUniversity.id || "")
  );
  console.log(teamSchedule)

  return (
    <ParentSecion>
      Season calendar
      <MatchesTable schedule={teamSchedule} />
    </ParentSecion>
  );
}
