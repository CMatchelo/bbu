import { useSelector } from "react-redux";
import { ParentSecion } from "../../Components/ParentSection";
import { useAuthUser } from "../../hooks/useAuthUser";
import { SkillsTable } from "./Components/SkillsTable";
import { selectPlayersFromUniversity } from "../../selectors/data.selectors";
import { useState } from "react";
import { PlayerStats } from "../../Components/PlayerStats";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";

export default function Team() {
  const user = useAuthUser();
  const { t } = useTranslation();

  const players = useSelector((state: RootState) =>
      selectPlayersFromUniversity(state, user.currentUniversity.id),
    );

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
                : "text-text2 hover:bg-highlights1/6 hover:text-text1"
            }
            `}
        >
          {t("generalLocale.skills")}
        </button>
        <button
          onClick={() => setTable("stats")}
          className={`
            px-4 py-2 text-[12px] font-medium whitespace-nowrap transition-all
            ${
              table === "stats"
                ? "bg-highlights1/12 text-highlights1"
                : "text-text2 hover:bg-highlights1/6 hover:text-text1"
            }
            `}
        >
          {t("generalLocale.stats")}
        </button>
      </div>
      {table === "skills" && <SkillsTable players={players} />}
      {/* {table === "skills" && <PlayerStatsTwo players={players} />} */}
      {table === "stats" && <PlayerStats players={players} />}
    </ParentSecion>
  );
}
