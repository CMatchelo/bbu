import { useSelector } from "react-redux";
import { selectAllHighSchoolPlayers, selectAllUniversities } from "../../selectors/data.selectors";
import { useTranslation } from "react-i18next";
import { ParentSection } from "../../Components/ParentSection";
import { ScoutingBoardTable } from "./components/ScoutingBoardTable";
import { ScoutingSkillsTable } from "./components/ScoutingSkillsTable";
import { LetterResponseModal, LetterModalResult } from "./components/LetterResponseModal";
import { TopMenuBtn } from "../../Components/TopMenuBtn";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateHighSchoolPlayers, updateUniversities } from "../../store/slices/dataSlice";
import { saveHighSchoolPlayers, saveUniversities } from "../../utils/saveGame";
import { sendLetterOfIntent } from "../../game/sendLetter";
import { useUser } from "../../Context/UserContext";

export default function ScoutingPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const allPlayers = useSelector(selectAllHighSchoolPlayers);
  const universities = useSelector(selectAllUniversities);
  const [table, setTable] = useState<"board" | "skills">("board");
  const [pendingScout, setPendingScout] = useState<Record<string, boolean>>({});
  const [pendingTutoring, setPendingTutoring] = useState<Record<string, boolean>>({});
  const [letterResult, setLetterResult] = useState<LetterModalResult | null>(null);

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

  const handleSendLetter = async (playerId: string) => {
    if (!user) return;
    const player = allPlayers.find((p) => p.id === playerId);
    if (!player) return;

    const { outcome, otherUniversityName, playerUpdates, uniUpdates } = sendLetterOfIntent(
      player,
      universities,
      user.currentUniversity.id,
    );

    dispatch(updateHighSchoolPlayers(playerUpdates));
    if (uniUpdates.length > 0) dispatch(updateUniversities(uniUpdates));

    const folderName = `${user.name}_${user.id}`;
    await saveHighSchoolPlayers(folderName);
    if (uniUpdates.length > 0) await saveUniversities(folderName);

    setLetterResult({ outcome, otherUniversityName });
  };

  return (
    <ParentSection className="pb-10" backgroundImg='scoutBg.png'>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="flex self-center bg-cardbg/75 border border-highlights1/20 rounded-lg w-fit">
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
            players={allPlayers}
            pendingScout={pendingScout}
            pendingTutoring={pendingTutoring}
            onScoutChange={handleScoutChange}
            onTutoringChange={handleTutoringChange}
            onSendLetter={handleSendLetter}
          />
        )}
        {table === "skills" && <ScoutingSkillsTable players={allPlayers} />}
      </div>
      <LetterResponseModal result={letterResult} onClose={() => setLetterResult(null)} />
    </ParentSection>
  );
}
