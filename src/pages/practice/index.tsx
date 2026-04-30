import { useSelector } from "react-redux";
import { ParentSecion } from "../../Components/ParentSection";
import { useAuthUser } from "../../hooks/useAuthUser";
import { selectPlayersFromUniversity } from "../../selectors/data.selectors";
import { TableCard } from "../../Components/TableCard";
import { TableHead } from "../../Components/TableHead";
import { TableRow } from "../../Components/TableRow";
import { Pill } from "../../Components/Pill";
import { Skill } from "../../types/Skill";
import { useState } from "react";
import { Player } from "../../types/Player";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updatePlayers } from "../../store/slices/dataSlice";
import { PracticeSelect } from "./components/PracticeSelect";
import { savePlayers } from "../../utils/saveGame";
import { useTranslation } from "react-i18next";
import { Icons } from "../../utils/icons";
import { RootState } from "../../store";

export default function Practice() {
  const user = useAuthUser();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const players = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, user.currentUniversity.id),
  );

  const [pendingUpdates, setPendingUpdates] = useState<
    { id: string; changes: Partial<Player> }[]
  >([]);

  const updatePractice = (key: keyof Skill, id: string) => {
    setPendingUpdates((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        existing.changes.practicing = key;
        return [...prev];
      }
      return [...prev, { id: id, changes: { practicing: key } }];
    });
  };

  const savePractice = async () => {
    dispatch(updatePlayers(pendingUpdates));
    setPendingUpdates([]);
    const folderName = `${user.name}_${user.id}`;
    await savePlayers(folderName);
  };

  const pairs: [Player, Player | null][] = [];
  for (let i = 0; i < players.length; i += 2) {
    pairs.push([players[i], players[i + 1] ?? null]);
  }

  return (
    <ParentSecion className="px-4">
      <TableCard title={t("generalLocale.practice")}>
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-cardbglight">
              <TableHead
                align="left"
                className="pl-5 w-10"
                children={undefined}
              />
              <TableHead align="left" className="pl-3 w-40">
                {t("generalLocale.player")}
              </TableHead>
              <TableHead className="pl-3 w-44">
                {t("generalLocale.focus")}
              </TableHead>

              <td className="w-px bg-detail3" />

              <TableHead
                align="left"
                className="pl-5 w-10"
                children={undefined}
              />
              <TableHead align="left" className="pl-3 w-40">
                {t("generalLocale.player")}
              </TableHead>
              <TableHead className="pl-3 w-44">
                {t("generalLocale.focus")}
              </TableHead>
            </tr>
          </thead>
          <tbody>
            {pairs.map(([left, right], index) => (
              <TableRow key={left.id} index={index}>
                <td className="pl-5 py-2.5">
                  <Pill variant="muted">{left.inCourtPosition}</Pill>
                </td>
                <td className="pl-3 py-2.5 flex flex-row gap-3">
                  <span className="text-[13px] font-medium text-text1">
                    {left.firstName} {left.lastName}
                  </span>
                  {left.injured && Icons.MedicalSymbol}
                </td>
                <td className="pl-3 py-2.5">
                  <PracticeSelect
                    player={left}
                    pendingUpdates={pendingUpdates}
                    onUpdate={updatePractice}
                  />
                </td>

                <td className="w-px bg-detail3 p-0" />

                {right ? (
                  <>
                    <td className="pl-5 py-2.5">
                      <Pill variant="muted">{right.inCourtPosition}</Pill>
                    </td>
                    <td className="pl-3 py-2.5 flex flex-row gap-3">
                      <span className="text-[13px] font-medium text-text1">
                        {right.firstName} {right.lastName}
                      </span>
                      {right.injured && Icons.MedicalSymbol}
                    </td>
                    <td className="pl-3 py-2.5">
                      <PracticeSelect
                        player={right}
                        pendingUpdates={pendingUpdates}
                        onUpdate={updatePractice}
                      />
                    </td>
                  </>
                ) : (
                  <td colSpan={3} />
                )}
              </TableRow>
            ))}
          </tbody>
        </table>
      </TableCard>

      <button onClick={savePractice} disabled={pendingUpdates.length === 0}>
        {t("systemGeneral.savePractice")}
      </button>
    </ParentSecion>
  );
}
