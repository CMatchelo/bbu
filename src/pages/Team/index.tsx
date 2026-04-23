// Team.tsx
import { useSelector } from "react-redux";
import { useAuthUser } from "../../hooks/useAuthUser";
import { selectUniversitiesWithPlayers } from "../../selectors/data.selectors";
import { playerAverage } from "../../game/skillsAverage";
import { ParentSecion } from "../../Components/ParentSection";
import { TableCard } from "../../Components/TableCard";
import { TableRow } from "../../Components/TableRow";
import { TableHead } from "../../Components/TableHead";
import { Pill } from "../../Components/Pill";

const SKILLS = [
  { label: "DEF", key: "defense" },
  { label: "DRI", key: "ballHandling" },
  { label: "PAS", key: "pass" },
  { label: "AGL", key: "speedWithBall" },
  { label: "BLK", key: "block" },
  { label: "STL", key: "steal" },
  { label: "REB", key: "rebound" },
  { label: "LAY", key: "layup" },
  { label: "3PT", key: "threept" },
  { label: "2PT", key: "twopt" },
] as const;

function skillColor(value: number) {
  if (value >= 80) return "text-highlights1";
  if (value >= 65) return "text-text1";
  return "text-text2";
}

export default function Team() {
  const user = useAuthUser();
  const universities = useSelector(selectUniversitiesWithPlayers);
  const uni = universities.find((u) => u.id === user.currentUniversity.id);
  const playersSorted = uni?.players
    ?.slice()
    .sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition));

  return (
    <ParentSecion>
      <TableCard title="Elenco & Estratégia" badge={uni?.nickname}>
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-cardbglight">
              <TableHead align="left" className="w-40 pl-5">
                Jogador
              </TableHead>
              <TableHead className="w-12">Pos</TableHead>
              {SKILLS.map(({ label }) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
              <TableHead accent>AVG</TableHead>
            </tr>
          </thead>
          <tbody>
            {playersSorted?.map((player, index) => (
              <TableRow key={player.id} index={index}>
                <td className="pl-5 py-2.5">
                  <span className="text-[13px] font-medium text-text1">
                    {player.firstName} {player.lastName}
                  </span>
                </td>
                <td className="text-center py-2.5 px-2">
                  <Pill variant="yellow">{player.inCourtPosition}</Pill>
                </td>
                {SKILLS.map(({ key }) => {
                  const value = player.skills[key];
                  return (
                    <td
                      key={key}
                      className={`text-center py-2.5 px-2 text-[12px] ${skillColor(value)}`}
                    >
                      {value}
                    </td>
                  );
                })}
                <td className="text-center py-2.5 px-2 text-[13px] font-medium text-highlights1">
                  {playerAverage(player).toString()}
                </td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </TableCard>
    </ParentSecion>
  );
}
