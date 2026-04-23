// MatchesTable.tsx
import { useTranslation } from "react-i18next";
import { MatchWithTeams } from "../types/Match";
import { TableCard } from "./TableCard";
import { TableHead } from "./TableHead";
import { Pill } from "./Pill";
import { useUser } from "../Context/UserContext";
import { TableRow } from "./TableRow";

interface MatchesTableProps {
  schedule: MatchWithTeams[];
}

export function MatchesTable({ schedule }: MatchesTableProps) {
  const { t } = useTranslation();
  const { user } = useUser()

  return (
    <TableCard title="Jogos" badge={`${t("generalLocale.season")} ${user?.currentSeason}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-cardbglight">
            <TableHead className="w-12">{t("generalLocale.round")}</TableHead>
            <TableHead align="right" className="pr-4">
              {t("generalLocale.home")}
            </TableHead>
            <TableHead className="w-32">{t("generalLocale.score")}</TableHead>
            <TableHead align="left" className="pl-4">
              {t("generalLocale.away")}
            </TableHead>
            <TableHead className="w-30">{t("generalLocale.league")}</TableHead>
          </tr>
        </thead>
        <tbody>
          {schedule.map((match, index) => {
            const hWin =
              match.played &&
              (match.result?.homeScore ?? 0) > (match.result?.awayScore ?? 0);
            const aWin =
              match.played &&
              (match.result?.awayScore ?? 0) > (match.result?.homeScore ?? 0);
            return (
              <TableRow key={match.id} index={index}>
                <td className="text-center text-[11px] text-text2 px-3 py-2.5">
                  {match.week}
                </td>
                <td className="pr-4 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-[13px] font-medium text-text1">
                      {match.homeTeam.nickname}
                    </span>
                    <Pill variant="green">
                      {match.homeTeam.id.toUpperCase()}
                    </Pill>
                  </div>
                </td>
                <td className="text-center py-2.5">
                  {match.played ? (
                    <div className="inline-flex items-center gap-2.5 bg-white/4 border border-white/8 rounded-lg px-3 py-1">
                      <span
                        className={`text-[15px] font-medium min-w-7 text-center ${hWin ? "text-highlights1" : "text-text1"}`}
                      >
                        {match.result?.homeScore}
                      </span>
                      <span className="text-[11px] text-text2">—</span>
                      <span
                        className={`text-[15px] font-medium min-w-7 text-center ${aWin ? "text-highlights1" : "text-text1"}`}
                      >
                        {match.result?.awayScore}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-text2">a definir</span>
                  )}
                </td>
                <td className="pl-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Pill variant="green">
                      {match.awayTeam.id.toUpperCase()}
                    </Pill>
                    <span className="text-[13px] font-medium text-text1">
                      {match.awayTeam.nickname}
                    </span>
                  </div>
                </td>
                <td className="text-center py-2.5">
                  <Pill variant="yellow" rounded>
                    {t(`championshipLocale.${match.championship}`)}
                  </Pill>
                </td>
              </TableRow>
            );
          })}
        </tbody>
      </table>
    </TableCard>
  );
}
