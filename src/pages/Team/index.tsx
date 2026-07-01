import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ParentSection } from "../../Components/ParentSection";
import { useAuthUser } from "../../hooks/useAuthUser";
import { selectPlayersFromUniversity } from "../../selectors/data.selectors";
import { useState, useEffect } from "react";
import { RootState } from "../../store";
import { TopMenuBtn } from "../../Components/TopMenuBtn";
import { DraftTable } from "./Components/DraftTable";
import { DRAFT_WEEKS } from "../../constants/game.constants";
import { useLocation } from "react-router-dom";
import { PlayerCardGrid } from "./Components/PlayerCardGrid";

export default function Team() {
  const { t } = useTranslation();
  const user = useAuthUser();
  const location = useLocation();

  const players = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, user.currentUniversity.id),
  );

  const currentWeek = useSelector((state: RootState) => state.schedule.currentWeek);

  const [table, setTable] = useState<"skills" | "stats">("skills");
  const [showDraft, setShowDraft] = useState(
    () => !!(location.state as { showDraft?: boolean } | null)?.showDraft,
  );

  useEffect(() => {
    if (currentWeek !== DRAFT_WEEKS) return;
    const key = `draft_shown_${user.id}_week${currentWeek}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "1");
      setShowDraft(true);
    }
  }, [currentWeek, user.id]);

  if (showDraft) {
    return (
      <ParentSection className="px-4 pb-10">
        <DraftTable onDone={() => setShowDraft(false)} />
      </ParentSection>
    );
  }

  return (
    <ParentSection backgroundImg="/teamBg.png">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex self-center bg-cardbg/75 border border-highlights1/20 rounded-lg w-fit">
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
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <PlayerCardGrid
          players={players}
          flipped={table === "stats"}
          currentSeason={user.currentSeason}
          universityName={user.currentUniversity.name}
        />
      </div>
    </ParentSection>
  );
}
