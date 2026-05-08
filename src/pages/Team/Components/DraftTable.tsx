import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { RootState } from "../../../store";
import {
  selectAllUniversities,
  selectAllPlayers,
  selectPlayersFromUniversity,
} from "../../../selectors/data.selectors";
import { setPlayers, setUniversities } from "../../../store/slices/dataSlice";
import {
  generateDraftPlayers,
  addDraftedPlayers,
  calculatMaxMinGrade,
} from "../../../utils/createPlayer";
import { savePlayers, saveUniversities } from "../../../utils/saveGame";
import { SkillsTable } from "./SkillsTable";
import { TableCard } from "../../../Components/TableCard";
import { TableHead } from "../../../Components/TableHead";
import { TableRow } from "../../../Components/TableRow";
import { Pill } from "../../../Components/Pill";
import { Player } from "../../../types/Player";
import { playerAverage } from "../../../game/skillsAverage";
import { useTranslation } from "react-i18next";

const MAX_ROSTER = 15;

interface DraftTableProps {
  onDone: () => void;
}

export const DraftTable = ({ onDone }: DraftTableProps) => {
  const user = useAuthUser();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const universities = useSelector((state: RootState) =>
    selectAllUniversities(state),
  );
  const allPlayers = useSelector((state: RootState) => selectAllPlayers(state));
  const currentRoster = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, user.currentUniversity.id),
  );

  const draftPlayers = useMemo(
    () =>
      generateDraftPlayers(universities, user.currentUniversity.id)
        .playerOptions,
    [universities, user.currentUniversity.id],
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
    const selected = draftPlayers.filter((p) => selectedIds.has(p.id));
    if (selected.length > 0) {
      const { players: newPlayers, universities: updatedUnis } =
        addDraftedPlayers(selected, universities);
      dispatch(setPlayers([...allPlayers, ...newPlayers]));
      dispatch(setUniversities(updatedUnis));

      const folderName = `${user.name}_${user.id}`;
      await savePlayers(folderName);
      await saveUniversities(folderName);
    }
    onDone();
  };

  const prospectsSorted = useMemo(
    () => draftPlayers.slice().sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition)),
    [draftPlayers],
  );

  const playersWithOvr = useMemo(() => {
    return prospectsSorted.map((player) => {
      const avg = playerAverage(player);
      const { minPotential, maxPotential } = calculatMaxMinGrade(avg);

      return {
        ...player,
        minOvr: minPotential,
        maxOvr: maxPotential,
      };
    });
  }, [prospectsSorted]);

  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <div className="rounded-xl border border-highlights1/20 bg-cardbg px-5 py-4 text-sm text-text2 leading-relaxed">
        {t("faqLocale.openTryoutsExplain1")}{" "}
        <span className="text-highlights1 font-medium">
          {t("faqLocale.openTryoutsExplain2")}
        </span>{" "}
        among
        {t("faqLocale.openTryoutsExplain3")}{" "}
        <span className="text-text1 font-medium">
          {slotsLeft} {t("faqLocale.openTryoutsExplain4")}
        </span>
      </div>

      <TableCard title={t("generalLocale.prospects")} className="overflow-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-cardbglight">
              <TableHead className="w-10 pl-5" children={undefined} />
              <TableHead className="w-72 pl-5">
                {t("generalLocale.player")}
              </TableHead>
              <TableHead>OVER</TableHead>
              <TableHead accent>POT</TableHead>
            </tr>
          </thead>
          <tbody>
            {playersWithOvr.map((player, index) => {
              const isSelected = selectedIds.has(player.id);
              const isDisabled = atCapacity && !isSelected;

              return (
                <TableRow
                  key={player.id}
                  index={index}
                  className={isDisabled ? "opacity-40" : ""}
                >
                  <td className="pl-5 py-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => handleToggle(player)}
                      className="accent-highlights1 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="pl-5 py-2.5 flex gap-2">
                    <Pill variant="muted">{player.inCourtPosition}</Pill>
                    <span className="text-[13px] font-medium text-text1">
                      {player.firstName} {player.lastName}
                    </span>
                  </td>
                  <td className="text-center py-2.5 px-2 text-[12px] text-text2">
                    {player.minOvr} – {player.maxOvr}
                  </td>
                  <td className="text-center py-2.5 px-2 text-[12px] text-highlights1 font-medium">
                    {player.minPotential} – {player.maxPotential}
                  </td>
                </TableRow>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-highlights1/20">
          <button
            onClick={onDone}
            className="px-5 py-2 rounded-lg text-sm text-text2 border border-highlights1/20 hover:bg-cardbglight transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-highlights1 text-cardbg hover:opacity-90 transition-opacity"
          >
            Confirm ({selectedIds.size})
          </button>
        </div>
      </TableCard>

      <SkillsTable players={currentRoster} />
    </div>
  );
};
