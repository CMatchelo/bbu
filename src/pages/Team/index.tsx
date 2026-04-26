import { useSelector } from "react-redux";
import { ParentSecion } from "../../Components/ParentSection";
import { useAuthUser } from "../../hooks/useAuthUser";
import { SkillsTable } from "./Components/SkillsTable";
import { selectUniversitiesWithPlayers } from "../../selectors/data.selectors";
import { useState } from "react";
import { PlayerStats } from "../../Components/PlayerStats";
import { PlayerStatsTwo } from "../../Components/PlayerStats copy";

export default function Team() {
  const user = useAuthUser();
  const universities = useSelector(selectUniversitiesWithPlayers);
  const players =
    universities.find((u) => u.id === user.currentUniversity.id)?.players || [];

  const [table, setTable] = useState<string>("skills");

  return (
    <ParentSecion>
      <div className="flex self-center bg-cardbg border border-highlights1/20 rounded-lg w-fit">
        <button
          onClick={() => setTable("skills")}
          className={`
            px-4 py-2 text-[12px] font-medium whitespace-nowrap transition-all
            ${
          table === "skills"
            ? "bg-highlights1/12 text-highlights1"
            : "text-text2 hover:bg-highlights1/6 hover:text-text1"}
            `}
        >
          Skills
        </button>
        <button
          onClick={() => setTable("stats")}
          className={`
            px-4 py-2 text-[12px] font-medium whitespace-nowrap transition-all
            ${
          table === "stats"
            ? "bg-highlights1/12 text-highlights1"
            : "text-text2 hover:bg-highlights1/6 hover:text-text1"}
            `}
        >
          Stats
        </button>
      </div>
      {table === "skills" && <SkillsTable players={players} />}
      {/* {table === "skills" && <PlayerStatsTwo players={players} />} */}
      {table === "stats" && <PlayerStats players={players} />}
    </ParentSecion>
  );
}
