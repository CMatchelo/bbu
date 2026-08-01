import { selectTeamSchedule } from "../../selectors/data.scheduleSelector";
import { useSelector } from "react-redux";
import { useUser } from "../../Context/UserContext";
import { ParentSection } from "../../Components/ParentSection";
import { useMemo } from "react";
import { GameCard } from "./components/GameCard";

export default function Calendar() {
  const { user } = useUser();

  const teamSelector = useMemo(() => selectTeamSchedule(user?.currentUniversity.id || ""), [user?.currentUniversity.id]);
  const teamSchedule = useSelector(teamSelector);

  return (
    <ParentSection className="pb-4">
      <div className="grid gap-4 grid-cols-3 xl:grid-cols-4">
        {teamSchedule.map((match, idx) => (
          <div key={idx}>
            <GameCard match={match} />
          </div>
        ))}
      </div>
    </ParentSection>
  );
}
