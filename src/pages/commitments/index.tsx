import { useSelector } from "react-redux";
import { selectAllHighSchoolPlayers } from "../../selectors/data.selectors";
import { useTranslation } from "react-i18next";
import { ParentSecion } from "../../Components/ParentSection";
import { ScoutingSkillsTable } from "../scouting/components/ScoutingSkillsTable";
import { TopMenuBtn } from "../../Components/TopMenuBtn";
import { useState } from "react";
import { ScoutingBoardTable } from "../scouting/components/ScoutingBoardTable";

export default function CommitmentsPage() {
  const { t } = useTranslation();
  const allPlayers = useSelector(selectAllHighSchoolPlayers);
  const players = allPlayers.filter((p) => p.signedWith != null);
  const [table, setTable] = useState<"board" | "skills">("board");

  return (
    <ParentSecion className="px-4 pb-10">
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-text2">
          {t("mainMenu.commitments")}
        </span>
        <div className="flex self-center bg-cardbg border border-highlights1/20 rounded-lg w-fit">
          <TopMenuBtn
            onClick={() => setTable("board")}
            tableId="board"
            currentTable={table}
            className="w-36"
          />
          <TopMenuBtn
            onClick={() => setTable("skills")}
            tableId="skills"
            currentTable={table}
            className="w-36"
          />
        </div>
      </div>
      <div className="h-full pb-10">
        {table === "board" && <ScoutingBoardTable players={players} />}
        {table === "skills" && <ScoutingSkillsTable players={players} />}
      </div>
    </ParentSecion>
  );
}
