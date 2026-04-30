import { useSelector } from "react-redux";
import { ParentSecion } from "../../Components/ParentSection";
import { useAuthUser } from "../../hooks/useAuthUser";
import { SkillsTable } from "./Components/SkillsTable";
import { selectPlayersFromUniversity } from "../../selectors/data.selectors";
import { useState } from "react";
import { PlayerStats } from "../../Components/PlayerStats";
import { RootState } from "../../store";
import { TopMenuBtn } from "../../Components/TopMenuBtn";
import { EduTable } from "./Components/EduTable";

export default function Team() {
  const user = useAuthUser();

  const players = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, user.currentUniversity.id),
  );

  const [table, setTable] = useState<string>("skills");

  return (
    <ParentSecion className="px-4 pb-10">
      <div className="flex self-center bg-cardbg border border-highlights1/20 rounded-lg w-fit">
        <TopMenuBtn
          onClick={() => setTable("skills")}
          tableId="skills"
          currentTable={table}
          className="w-40"
        />
        <TopMenuBtn
          onClick={() => setTable("stats")}
          tableId="stats"
          currentTable={table}
          className="w-40"
        />
        <TopMenuBtn
          onClick={() => setTable("education")}
          tableId="education"
          currentTable={table}
          className="w-40"
        />
      </div>
      <div className="h-full pb-10">
        {table === "skills" && <SkillsTable players={players} />}
        {/* {table === "skills" && <PlayerStatsTwo players={players} />} */}
        {table === "stats" && <PlayerStats players={players} />}
        {table === "education" && <EduTable players={players} />}
      </div>
    </ParentSecion>
  );
}
