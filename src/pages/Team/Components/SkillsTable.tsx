import { TableCard } from "../../../Components/TableCard";
import { TableHead } from "../../../Components/TableHead";
import { Player } from "../../../types/Player";
import { Pill } from "../../../Components/Pill";
import { TableRow } from "../../../Components/TableRow";
import { playerAverage } from "../../../game/skillsAverage";
import { useTranslation } from "react-i18next";

interface SkillsTableProps {
  players: Player[];
  selectedIds?: Set<string>;
  onToggle?: (player: Player) => void;
  disableUnselected?: boolean;
  className?: string;
}

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

export const SkillsTable = ({ players, selectedIds, onToggle, disableUnselected, className }: SkillsTableProps) => {
  const { t } = useTranslation()
  const playersSorted = players
    ?.slice()
    .sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition));

  const selectionMode = !!onToggle;

  return (
    <TableCard className={`h-full ${className}`} title={t("generalLocale.roster")}>
      <table className="w-full min-w-[700px] border-collapse">
        <thead>
          <tr className="bg-cardbglight">
            {selectionMode && <TableHead className="w-10 pl-5" children={undefined} />}
            <TableHead className="w-80 pl-5">
              {t("generalLocale.player")}
            </TableHead>
            {SKILLS.map(({ label }) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
            <TableHead accent>OVER</TableHead>
            <TableHead accent>POT</TableHead>
          </tr>
        </thead>
        <tbody>
          {playersSorted?.map((player, index) => {
            const isSelected = selectedIds?.has(player.id) ?? false;
            const isDisabled = selectionMode && disableUnselected && !isSelected;
            return (
              <TableRow
                key={player.id}
                index={index}
                className={`${isDisabled ? "opacity-40" : ""}`}
              >
                {selectionMode && (
                  <td className="pl-5 py-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => onToggle?.(player)}
                      className="accent-highlights1 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </td>
                )}
                <td className="pl-5 py-2.5 flex gap-2">
                  <Pill variant="muted">{player.inCourtPosition}</Pill>
                  <span className="text-[13px] font-medium text-text1">
                    {player.firstName} {player.lastName}
                  </span>
                </td>
                {SKILLS.map(({ key }) => {
                  const value = player.skills[key];
                  return (
                    <td
                      key={key}
                      className={`text-center py-2.5 px-2 text-[12px] ${skillColor(value)}`}
                    >
                      {Math.floor(value)}
                    </td>
                  );
                })}
                <td className="text-center py-2.5 px-2 text-[13px] font-medium text-highlights1">
                  {playerAverage(player).toString()}
                </td>
                <td className="text-center py-2.5 px-2 text-[13px] font-medium text-highlights2">
                  {player.minPotential} - {player.maxPotential}
                </td>
              </TableRow>
            );
          })}
        </tbody>
      </table>
    </TableCard>
  );
};
