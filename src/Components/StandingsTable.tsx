import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useUser } from "../Context/UserContext";
import { TableCard } from "./TableCard";
import { TableHead } from "./TableHead";
import { TableRow } from "./TableRow";
import { Pill } from "./Pill";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { TeamSeasonStats } from "../types/SeasonStats";

interface StandingsTableProps {
  leagueId: string;
}

export function StandingsTable({ leagueId }: StandingsTableProps) {
  const universities = useSelector(
    (state: RootState) => state.data.universitiesByLeague[leagueId],
  );
  const [orderKey, setOrderKey] = useState<keyof TeamSeasonStats>("wins");
  const { user } = useUser();
  const { t } = useTranslation();

  const sortedUniversities = useMemo(() => {
    if (!user) return [];

    return [...universities].sort((a, b) => {
      const aValue = a.stats[user.currentSeason][orderKey];
      const bValue = b.stats[user.currentSeason][orderKey];

      return bValue - aValue;
    });
  }, [universities, orderKey, user]);

  const f = (val: number, decimals = 1) =>
    isNaN(val) ? "—" : val.toFixed(decimals);

  return (
    <TableCard className="h-full overflow-auto" title={t("generalLocale.standings")}>
      <table className="w-full min-w-[820px] border-collapse">
        <thead>
          <tr className="bg-cardbglight">
            <TableHead className="w-6" children={undefined} />
            <TableHead align="left" className="pl-5">
              {t("generalLocale.team")}
            </TableHead>
            <TableHead className="w-17">G</TableHead>
            <TableHead
              className="cursor-pointer w-17"
              accent
              onClick={() => setOrderKey("wins")}
            >
              W%
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              accent
              onClick={() => setOrderKey("points")}
            >
              PPG
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              onClick={() => setOrderKey("pointsAllowed")}
            >
              PAPG
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              onClick={() => setOrderKey("fgm")}
            >
              FGM
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              onClick={() => setOrderKey("fga")}
            >
              FGA
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              onClick={() => setOrderKey("tpm")}
            >
              3PM
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              onClick={() => setOrderKey("tpa")}
            >
              3PA
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              onClick={() => setOrderKey("assists")}
            >
              AST
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              onClick={() => setOrderKey("blocks")}
            >
              BLK
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              onClick={() => setOrderKey("rebounds")}
            >
              REB
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              onClick={() => setOrderKey("steals")}
            >
              STL
            </TableHead>
            <TableHead
              className="cursor-pointer w-17"
              onClick={() => setOrderKey("turnovers")}
            >
              TO
            </TableHead>
          </tr>
        </thead>
        <tbody>
          {sortedUniversities.map((uni, index) => {
            const s = uni.stats[user?.currentSeason || 0];
            const m = s.matches || 1;
            return (
              <TableRow key={uni.id} index={index}>
                <td className="text-right pr-1 text-[11px] text-text2">
                  {index + 1}
                </td>
                <td className="pl-5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Pill variant="green" className="w-20">
                      {uni.id.toUpperCase()}
                    </Pill>
                    <span className="text-[13px] font-medium text-text1">
                      {uni.nickname}
                    </span>
                  </div>
                </td>
                <td className="text-center text-[12px] text-text2 px-2">
                  {s.matches}
                </td>
                <td className="text-center text-[12px] font-medium text-highlights1 px-2">
                  {f((s.wins / m) * 100, 0)}%
                </td>
                <td className="text-center text-[12px] text-highlights2 px-2">
                  {f(s.points / m)}
                </td>
                <td className="text-center text-[12px] text-text2 px-2">
                  {f(s.pointsAllowed / m)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(s.fgm / m)}
                </td>
                <td className="text-center text-[12px] text-text2 px-2">
                  {f(s.fga / m)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(s.tpm / m)}
                </td>
                <td className="text-center text-[12px] text-text2 px-2">
                  {f(s.tpa / m)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(s.assists / m)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(s.blocks / m)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(s.rebounds / m)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(s.steals / m)}
                </td>
                <td className="text-center text-[12px] text-text2 px-2">
                  {f(s.turnovers / m)}
                </td>
              </TableRow>
            );
          })}
        </tbody>
      </table>
    </TableCard>
  );
}
