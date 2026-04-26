import { useSelector } from "react-redux";
import { ParentSecion } from "../../Components/ParentSection";
import { useAuthUser } from "../../hooks/useAuthUser";
import { selectUniversitiesWithPlayers } from "../../selectors/data.selectors";
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

export default function Practice() {
  const user = useAuthUser();
  const universities = useSelector(selectUniversitiesWithPlayers);
  const dispatch = useAppDispatch();

  const players =
    universities.find((u) => u.id === user.currentUniversity.id)?.players ?? [];

  const [pendingUpdates, setPendingUpdates] = useState<
    { id: string; changes: Partial<Player> }[]
  >([]);

  const updatePractice = (key: keyof Skill, playerId: string) => {
    setPendingUpdates((prev) => {
      const existing = prev.find((p) => p.id === playerId);
      if (existing) {
        existing.changes.practicing = key;
        return [...prev];
      }
      return [...prev, { id: playerId, changes: { practicing: key } }];
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
    <ParentSecion>
      <TableCard title="Practicing">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-cardbglight">
              <TableHead
                align="left"
                className="pl-5 w-10"
                children={undefined}
              />
              <TableHead align="left" className="pl-3 w-40">
                Jogador
              </TableHead>
              <TableHead className="pl-3 w-44">Treino</TableHead>

              <td className="w-px bg-detail3" />

              <TableHead
                align="left"
                className="pl-5 w-10"
                children={undefined}
              />
              <TableHead align="left" className="pl-3 w-40">
                Jogador
              </TableHead>
              <TableHead className="pl-3 w-44">Treino</TableHead>
            </tr>
          </thead>
          <tbody>
            {pairs.map(([left, right], index) => (
              <TableRow key={left.id} index={index}>
                <td className="pl-5 py-2.5">
                  <Pill variant="muted">{left.inCourtPosition}</Pill>
                </td>
                <td className="pl-3 py-2.5">
                  <span className="text-[13px] font-medium text-text1">
                    {left.firstName} {left.lastName}
                  </span>
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
                    <td className="pl-3 py-2.5">
                      <span className="text-[13px] font-medium text-text1">
                        {right.firstName} {right.lastName}
                      </span>
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
        Save practice
      </button>
    </ParentSecion>
  );
}
