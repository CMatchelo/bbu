import { useTranslation } from "react-i18next";
import { useUser } from "../Context/UserContext";
import { TableCard } from "./TableCard";
import { TableHead } from "./TableHead";
import { useMemo, useState } from "react";
import { PlayerSeasonStats } from "../types/SeasonStats";
import { Player } from "../types/Player";
import { TableRow } from "./TableRow";
import { Pill } from "./Pill";

interface PlayerStatsProps {
  players: Player[];
}

export const PlayerStatsTwo = ({ players }: PlayerStatsProps) => {
  const { user } = useUser();
  const { t } = useTranslation();

  const [orderKey, setOrderKey] = useState<keyof PlayerSeasonStats>("points");

  const sortedPlayers = useMemo(() => {
    if (!user) return [];

    return [...players].sort((a, b) => {
      const aValue = a.stats[user.currentSeason][orderKey];
      const bValue = b.stats[user.currentSeason][orderKey];

      return bValue - aValue;
    });
  }, [players, orderKey, user]);

  const f = (val: number, decimals = 1) =>
    isNaN(val) ? "—" : val.toFixed(decimals);
  return (
    <TableCard title={t("generalLocale.standings")}>
      <table className="w-full min-w-[820px] border-collapse">
        <thead>
          <tr className="bg-cardbglight">
            <TableHead className="w-6" children={undefined} />
            <TableHead>Player</TableHead>
            <TableHead>UNI</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setOrderKey("points")}
            >
              PPG
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setOrderKey("assists")}
            >
              AST
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setOrderKey("blocks")}
            >
              BLK
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setOrderKey("rebounds")}
            >
              REB
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setOrderKey("fgm")}
            >
              FGM
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setOrderKey("fga")}
            >
              FGA
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setOrderKey("tpm")}
            >
              3PM
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setOrderKey("tpa")}
            >
              3PA
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setOrderKey("steals")}
            >
              STL
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setOrderKey("turnovers")}
            >
              TO
            </TableHead>
            <TableHead>+-</TableHead>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => {
            const stat = player.stats[user?.currentSeason || 0];
            const matches = stat.matches || 1;
            return (
              <TableRow key={player.id} index={index}>
                <td className="text-right pr-1 text-[11px] text-text2">
                  {index + 1}
                </td>
                <td className="pl-5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Pill variant="green">
                      {player.inCourtPosition.toUpperCase()}
                    </Pill>
                    <span className="text-[13px] font-medium text-text1">
                      {`${player.firstName.slice(0, 1)}. ${player.lastName}`}
                    </span>
                  </div>
                </td>
                <td className="text-center text-[12px] font-medium text-highlights1 px-2">
                  <Pill variant="green">
                    {player.currentUniversity.toUpperCase()}
                  </Pill>
                </td>
                <td className="text-center text-[12px] text-highlights2 px-2">
                  {f(stat.points / matches)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(stat.assists / matches)}
                </td>
                <td className="text-center text-[12px] text-text2 px-2">
                  {f(stat.blocks / matches)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(stat.rebounds / matches)}
                </td>
                <td className="text-center text-[12px] text-text2 px-2">
                  {f(stat.fgm / matches)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(stat.fga / matches)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(stat.tpm / matches)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(stat.tpa / matches)}
                </td>
                <td className="text-center text-[12px] text-text1 px-2">
                  {f(stat.steals / matches)}
                </td>
                <td className="text-center text-[12px] text-text2 px-2">
                  {f(stat.turnovers / matches)}
                </td>
                <td className="text-center text-[12px] text-text2 px-2">
                  {f(stat.teamPoints - stat.teamPointsAllowed)}
                </td>
              </TableRow>
            );
          })}
        </tbody>
      </table>
    </TableCard>
  );
};
