import { useTranslation } from "react-i18next";
import { useUser } from "../Context/UserContext";
import { TableCard } from "./TableCard";
import { TableHead } from "./TableHead";
import { useMemo, useRef, useState } from "react";
import { PlayerSeasonStats } from "../types/SeasonStats";
import { Player } from "../types/Player";
import { TableRow } from "./TableRow";
import { Pill } from "./Pill";
import { useVirtualizer } from "@tanstack/react-virtual";

interface PlayerStatsProps {
  players: Player[];
}

export const PlayerStats = ({ players }: PlayerStatsProps) => {
  const { user } = useUser();
  const { t } = useTranslation();
  const parentRef = useRef<HTMLDivElement>(null);

  const [orderKey, setOrderKey] = useState<keyof PlayerSeasonStats>("points");

  const sortedPlayers = useMemo(() => {
    if (!user) return [];

    return [...players].sort((a, b) => {
      const aValue = a.stats[user.currentSeason][orderKey];
      const bValue = b.stats[user.currentSeason][orderKey];

      return bValue - aValue;
    });
  }, [players, orderKey, user]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: sortedPlayers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 46,
    overscan: 10,
  });

  const columns = "30px minmax(180px,4fr) 80px repeat(11, minmax(60px, 1fr))";

  const f = (val: number, decimals = 1) =>
    isNaN(val) ? "—" : val.toFixed(decimals);
  return (
    <TableCard
      title={t("generalLocale.stats")}
      badge={`${t("generalLocale.season")} ${user?.currentSeason}`}
    >
      <div ref={parentRef} className="h-[600px] overflow-auto">
        <div className="min-w-[860px]">
          <div
            className="grid bg-cardbglight sticky top-0 z-10"
            style={{ gridTemplateColumns: columns }}
          >
            <TableHead className="text-right pr-1">#</TableHead>
            <TableHead>{t("generalLocale.player")}</TableHead>
            <TableHead className="text-center">UNI</TableHead>

            <TableHead
              onClick={() => setOrderKey("points")}
              className="cursor-pointer"
            >
              PPG
            </TableHead>
            <TableHead
              onClick={() => setOrderKey("assists")}
              className="cursor-pointer"
            >
              AST
            </TableHead>
            <TableHead
              onClick={() => setOrderKey("blocks")}
              className="cursor-pointer"
            >
              BLK
            </TableHead>
            <TableHead
              onClick={() => setOrderKey("rebounds")}
              className="cursor-pointer"
            >
              REB
            </TableHead>

            <TableHead
              onClick={() => setOrderKey("fgm")}
              className="cursor-pointer"
            >
              FGM
            </TableHead>
            <TableHead
              onClick={() => setOrderKey("fga")}
              className="cursor-pointer"
            >
              FGA
            </TableHead>
            <TableHead
              onClick={() => setOrderKey("tpm")}
              className="cursor-pointer"
            >
              3PM
            </TableHead>
            <TableHead
              onClick={() => setOrderKey("tpa")}
              className="cursor-pointer"
            >
              3PA
            </TableHead>

            <TableHead
              onClick={() => setOrderKey("steals")}
              className="cursor-pointer"
            >
              STL
            </TableHead>
            <TableHead
              onClick={() => setOrderKey("turnovers")}
              className="cursor-pointer"
            >
              TO
            </TableHead>
            <TableHead>+-</TableHead>
          </div>

          <div
            className="relative"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const player = sortedPlayers[virtualRow.index];
              const stat = player.stats[user?.currentSeason || 0];
              const matches = stat.matches || 1;
              const index = virtualRow.index;
              const classname = "text-center text-[12px] px-4"

              return (
                <TableRow
                  key={player.id}
                  index={index}
                  className={`grid! items-center`}
                  style={{
                    gridTemplateColumns: columns,
                    position: "absolute",
                    top: `${virtualRow.start}px`,
                    height: `${virtualRow.size}px`,
                    width: "100%",
                  }}
                >
                  <div className="text-right pr-1 text-[11px] text-text2">
                    {index + 1}
                  </div>

                  <div className="pl-5 py-2.5 min-w-0">
                    <div className="flex items-center gap-2.5 truncate">
                      <Pill variant="muted" className="w-8">
                        {player.inCourtPosition.toUpperCase()}
                      </Pill>
                      <span className="text-[13px] font-medium text-text1 truncate">
                        {`${player.firstName} ${player.lastName}`}
                      </span>
                    </div>
                  </div>

                  <div className={`font-medium text-highlights1 ${classname}`}>
                    <Pill variant="green" >
                      {player.currentUniversity.toUpperCase()}
                    </Pill>
                  </div>

                  <div className={`text-highlights2 ${classname}`}>
                    {f(stat.points / matches)}
                  </div>
                  <div className={`text-text1 ${classname}`}>
                    {f(stat.assists / matches)}
                  </div>
                  <div className={`text-text2 ${classname}`}>
                    {f(stat.blocks / matches)}
                  </div>
                  <div className={`text-text1 ${classname}`}>
                    {f(stat.rebounds / matches)}
                  </div>
                  <div className={`text-text2 ${classname}`}>
                    {f(stat.fgm / matches)}
                  </div>
                  <div className={`text-text1 ${classname}`}>
                    {f(stat.fga / matches)}
                  </div>
                  <div className={`text-text1 ${classname}`}>
                    {f(stat.tpm / matches)}
                  </div>
                  <div className={`text-text1 ${classname}`}>
                    {f(stat.tpa / matches)}
                  </div>
                  <div className={`text-text1 ${classname}`}>
                    {f(stat.steals / matches)}
                  </div>
                  <div className={`text-text2 ${classname}`}>
                    {f(stat.turnovers / matches)}
                  </div>
                  <div className={`text-text2 ${classname}`}>
                    {f(stat.teamPoints - stat.teamPointsAllowed)}
                  </div>
                </TableRow>
              );
            })}
          </div>
        </div>
      </div>
    </TableCard>
  );
};
