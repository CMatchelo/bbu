import { selectTeamSchedule } from "../../selectors/data.scheduleSelector";
import { useSelector } from "react-redux";
import { useUser } from "../../Context/UserContext";
import { MatchesTable } from "../../Components/MatchesTable";
import { ParentSection } from "../../Components/ParentSection";
import { useMemo } from "react";

export default function Calendar() {
  const { user } = useUser();

  const teamSelector = useMemo(() => selectTeamSchedule(user?.currentUniversity.id || ""), [user?.currentUniversity.id]);
  const teamSchedule = useSelector(teamSelector);

  return (
    <ParentSection className="pb-4">
      <MatchesTable schedule={teamSchedule} />
    </ParentSection>
  );
}
