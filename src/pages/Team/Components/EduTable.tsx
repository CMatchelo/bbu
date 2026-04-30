import { TableCard } from "../../../Components/TableCard";
import { TableHead } from "../../../Components/TableHead";
import { Player } from "../../../types/Player";
import { Pill } from "../../../Components/Pill";
import { TableRow } from "../../../Components/TableRow";
import { playerAverage } from "../../../game/skillsAverage";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { TUTORING_QTY } from "../../../constants/game.constants";
import { updatePlayers } from "../../../store/slices/dataSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { savePlayers } from "../../../utils/saveGame";

interface EduTableProps {
  players: Player[];
}

export const EduTable = ({ players }: EduTableProps) => {
  const user = useAuthUser();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const playersSorted = players
    ?.slice()
    .sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition));

  const [changedPlayers, setChangedPlayers] = useState<
    { id: string; changes: Partial<Player> }[]
  >([]);

  const qtyTutor = players.filter((p) => {
    const local = changedPlayers.find((c) => c.id === p.id);
    return local?.changes.tutoring ?? p.tutoring;
  }).length;

  const handleToggleTutor = (id: string, checked: boolean) => {
    setChangedPlayers((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        existing.changes.tutoring = checked;
        return [...prev];
      }
      return [...prev, { id: id, changes: { tutoring: checked } }];
    });
  };

  const saveTutoring = async () => {
    dispatch(updatePlayers(changedPlayers));
    setChangedPlayers([]);
    const folderName = `${user.name}_${user.id}`;
    await savePlayers(folderName);
  };

  return (
    <>
      <TableCard title={t("generalLocale.roster")}>
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-cardbglight">
              <TableHead className="w-80 pl-5">
                {t("generalLocale.player")}
              </TableHead>
              <TableHead className="w-16">OVER</TableHead>
              <TableHead className="w-16">
                {t("generalLocale.grades")}
              </TableHead>
              <TableHead className="w-16">
                {t("generalLocale.intelligence")}
              </TableHead>
              <TableHead className="w-36">
                {t("generalLocale.currentYear")}
              </TableHead>
              <TableHead className="w-36">
                {t("generalLocale.yearToGraduate")}
              </TableHead>
              <TableHead className="w-20">
                {t("generalLocale.tutoring")}
              </TableHead>
            </tr>
          </thead>
          <tbody>
            {playersSorted?.map((player, index) => {
              const currentTutoring =
                changedPlayers.find((p) => p.id === player.id)?.changes
                  .tutoring ?? player.tutoring;
              return (
                <TableRow key={player.id} index={index}>
                  <td className="pl-5 py-2.5 flex gap-2">
                    <Pill variant="muted">{player.inCourtPosition}</Pill>
                    <span className="text-[13px] font-medium text-text1">
                      {player.firstName} {player.lastName}
                    </span>
                  </td>
                  <td className="text-center py-2.5 px-2 text-[13px] font-medium">
                    {playerAverage(player).toString()}
                  </td>
                  <td
                    className={`text-center py-2.5 px-2 text-[13px] font-medium 
                  ${player.grades > 75 ? "" : "text-red500/20"}
                `}
                  >
                    {player.grades.toFixed(2)}
                  </td>
                  <td className="text-center py-2.5 px-2 text-[13px] font-medium">
                    {Math.floor(player.intelligence)}
                  </td>
                  <td className="text-center py-2.5 px-2 text-[13px] font-medium">
                    {player.yearsInCollege}
                  </td>
                  <td className="text-center py-2.5 px-2 text-[13px] font-medium">
                    {player.yearsToGraduate}
                  </td>
                  <td className="text-center py-2.5 px-2 text-[13px] font-medium">
                    <input
                      type="checkbox"
                      disabled={qtyTutor >= TUTORING_QTY && !currentTutoring}
                      checked={currentTutoring}
                      onChange={(e) =>
                        handleToggleTutor(player.id, e.target.checked)
                      }
                    />
                  </td>
                </TableRow>
              );
            })}
          </tbody>
        </table>
      </TableCard>
      <button onClick={saveTutoring} disabled={changedPlayers.length === 0}>
        {t("systemGeneral.savePractice")}
      </button>
    </>
  );
};
