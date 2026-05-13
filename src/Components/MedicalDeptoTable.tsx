import { useTranslation } from "react-i18next";
import { Player } from "../types/Player";
import { TableHead } from "./TableHead";
import { TableCard } from "./TableCard";
import { TableRow } from "./TableRow";
import { Pill } from "./Pill";

interface MedicalDeptoProps {
  players: Player[];
}

export default function MedicalDeptoTable({ players }: MedicalDeptoProps) {
  const { t } = useTranslation();

  if (players.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-[13px] text-text2">{t("generalLocale.noInjuries")}</span>
      </div>
    );
  }

  return (
    <TableCard title="Depto Medico" className="overflow-auto ">
      <table className="w-full min-w-[700px] border-collapse">
        <thead>
          <tr className="bg-cardbglight/75">
            <TableHead className="w-6">Pos</TableHead>
            <TableHead>{t("generalLocale.player")}</TableHead>
            <TableHead>Uni</TableHead>
            <TableHead>{t("generalLocale.injury")}</TableHead>
            <TableHead>{t("generalLocale.bodyPart")}</TableHead>
            <TableHead className="w-10">{t("generalLocale.gamesOut")}</TableHead>
          </tr>
        </thead>
        <tbody>
          {players?.map((p: Player, index: number) => (
            <TableRow key={p.id} index={index}>
              <td className="text-center py-2.5 px-2">
                <Pill variant="muted">{p.inCourtPosition}</Pill>
              </td>
              <td>
                <span className="text-[13px] font-medium text-text1">
                  {p.firstName} {p.lastName}
                </span>
              </td>
              <td>
                <Pill className="min-w-20" variant="green">{p.currentUniversity.toUpperCase()}</Pill>
              </td>
              <td>{t(`injuries.${p.injury?.injuryId}`)}</td>
              <td>{t(`bodyParts.${p.injury?.bodyPart}`)}</td>
              <td>{p.injury?.gamesRemaining}</td>
            </TableRow>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}
