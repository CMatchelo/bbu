import { useSelector } from "react-redux";
import { selectAllHighSchoolPlayers } from "../../selectors/data.selectors";
import { useTranslation } from "react-i18next";
import { ParentSecion } from "../../Components/ParentSection";
import { ScoutingBoardTable } from "../scouting/components/ScoutingBoardTable";
import { ScoutingSkillsTable } from "../scouting/components/ScoutingSkillsTable";
import { TopMenuBtn } from "../../Components/TopMenuBtn";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateHighSchoolPlayers } from "../../store/slices/dataSlice";
import { saveHighSchoolPlayers } from "../../utils/saveGame";
import { useUser } from "../../Context/UserContext";

export default function RecruitingBoardPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const allPlayers = useSelector(selectAllHighSchoolPlayers);
  const players = allPlayers.filter((p) => p.playerKnowledge > 1);
  const [table, setTable] = useState<"board" | "skills">("board");
  const [pendingScout, setPendingScout] = useState<Record<string, boolean>>({});
  const [pendingTutoring, setPendingTutoring] = useState<Record<string, boolean>>({});

  const hasPending =
    Object.keys(pendingScout).length > 0 || Object.keys(pendingTutoring).length > 0;

  const handleScoutChange = (id: string, value: boolean) => {
    if (value) {
      const effectiveCount = allPlayers.filter(
        (p) => (pendingScout[p.id] ?? p.scouted) === true,
      ).length;
      if (effectiveCount >= 2) return;
    }
    setPendingScout((prev) => ({ ...prev, [id]: value }));
  };

  const handleTutoringChange = (id: string, value: boolean) => {
    if (value) {
      const effectiveCount = allPlayers.filter(
        (p) => (pendingTutoring[p.id] ?? p.tutoring) === true,
      ).length;
      if (effectiveCount >= 2) return;
    }
    setPendingTutoring((prev) => ({ ...prev, [id]: value }));
  };

  const handleConfirm = async () => {
    if (!user || !hasPending) return;
    const merged = new Map<string, { scouted?: boolean; tutoring?: boolean }>();
    for (const [id, scouted] of Object.entries(pendingScout)) {
      merged.set(id, { ...merged.get(id), scouted });
    }
    for (const [id, tutoring] of Object.entries(pendingTutoring)) {
      merged.set(id, { ...merged.get(id), tutoring });
    }
    const updates = Array.from(merged.entries()).map(([id, changes]) => ({ id, changes }));
    dispatch(updateHighSchoolPlayers(updates));
    await saveHighSchoolPlayers(`${user.name}_${user.id}`);
    setPendingScout({});
    setPendingTutoring({});
  };

  return (
    <ParentSecion>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="flex self-center bg-cardbg border border-highlights1/20 rounded-lg w-fit">
            <TopMenuBtn onClick={() => setTable("board")} tableId="board" currentTable={table} className="w-36" />
            <TopMenuBtn onClick={() => setTable("skills")} tableId="skills" currentTable={table} className="w-36" />
          </div>
          <button
            onClick={handleConfirm}
            disabled={!hasPending}
            className="ml-auto px-4 py-1.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider bg-highlights1 text-mainbgdark hover:bg-highlights1light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t("scouting.confirmChanges")}
          </button>
        </div>
      </div>
      <div className="h-full pb-10">
        {table === "board" && (
          <ScoutingBoardTable
            players={players}
            pendingScout={pendingScout}
            pendingTutoring={pendingTutoring}
            onScoutChange={handleScoutChange}
            onTutoringChange={handleTutoringChange}
          />
        )}
        {table === "skills" && <ScoutingSkillsTable players={players} />}
      </div>
    </ParentSecion>
  );
}
