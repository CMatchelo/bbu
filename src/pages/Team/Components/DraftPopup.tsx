import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { RootState } from "../../../store";
import {
  selectAllUniversities,
  selectPlayersFromUniversity,
} from "../../../selectors/data.selectors";
import { addPlayers, setUniversities } from "../../../store/slices/dataSlice";
import {
  generateDraftPlayers,
  addDraftedPlayers,
} from "../../../utils/createPlayer";
import { savePlayers, saveUniversities } from "../../../utils/saveGame";
import { SkillsTable } from "./SkillsTable";
import { Player } from "../../../types/Player";

const MAX_ROSTER = 15;

interface DraftPopupProps {
  onClose: () => void;
}

export const DraftPopup = ({ onClose }: DraftPopupProps) => {
  const user = useAuthUser();
  const dispatch = useAppDispatch();

  const universities = useSelector((state: RootState) =>
    selectAllUniversities(state),
  );
  const currentRoster = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, user.currentUniversity.id),
  );

  const { playerOptions, cpuPlayers } = useMemo(
    () => generateDraftPlayers(universities, user.currentUniversity.id),
    [universities, user], // sem dependências, só executa na montagem
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const slotsLeft = MAX_ROSTER - currentRoster.length - selectedIds.size;
  const atCapacity = slotsLeft <= 0;

  const handleToggle = (player: Player) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(player.id)) {
        next.delete(player.id);
      } else {
        next.add(player.id);
      }
      return next;
    });
  };

  const handleConfirm = async () => {
    const selected = playerOptions.filter((p) => selectedIds.has(p.id));
    if (selected.length === 0) {
      onClose();
      return;
    }
    const allPlayers = [...selected, ...cpuPlayers];
    const { players, universities: updatedUnis } = addDraftedPlayers(
      allPlayers,
      universities,
    );
    dispatch(addPlayers(players));
    dispatch(setUniversities(updatedUnis));
    const folderName = `${user.name}_${user.id}`;
    await savePlayers(folderName);
    await saveUniversities(folderName);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-cardbg border border-highlights1/20 rounded-xl w-[90vw] max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-highlights1/20">
          <div>
            <h2 className="text-text1 font-semibold text-lg">Inside Draft</h2>
            <p className="text-text2 text-sm mt-0.5">
              Select players to join your roster.{" "}
              <span
                className={atCapacity ? "text-red-400" : "text-highlights1"}
              >
                {slotsLeft > 0
                  ? `${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} remaining`
                  : "Roster full"}
              </span>
            </p>
          </div>
          <span className="text-text2 text-sm">
            {selectedIds.size} selected
          </span>
        </div>

        <div className="overflow-auto flex-1 px-6 py-4">
          <SkillsTable
            players={playerOptions}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            disableUnselected={atCapacity}
          />
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-highlights1/20">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm text-text2 border border-highlights1/20 hover:bg-cardbglight transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-highlights1 text-cardbg hover:opacity-90 transition-opacity"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
