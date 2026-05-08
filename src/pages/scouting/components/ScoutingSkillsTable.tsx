import { useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TableCard } from "../../../Components/TableCard";
import { TableHead } from "../../../Components/TableHead";
import { Pill } from "../../../Components/Pill";
import { HighSchoolPlayer } from "../../../types/HighSchoolPlayer";
import { useTranslation } from "react-i18next";
import { playerMaxAverage, playerMinAverage } from "../../../game/skillsAverage";

interface ScoutingSkillsTableProps {
  players: HighSchoolPlayer[];
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

const COLUMNS = `minmax(180px,3fr) repeat(10, minmax(55px,1fr)) 70px 70px`;

export const ScoutingSkillsTable = ({ players }: ScoutingSkillsTableProps) => {
  const { t } = useTranslation();
  const parentRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(
    () => players.slice().sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition)),
    [players],
  );

  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 46,
    overscan: 10,
  });

  return (
    <TableCard title={t("generalLocale.roster")} className="h-full">
      <div className="min-w-[860px]">
        <div className="grid bg-cardbglight/75 sticky top-0 z-10" style={{ gridTemplateColumns: COLUMNS }}>
          <TableHead align="left" className="pl-5">{t("generalLocale.player")}</TableHead>
          {SKILLS.map(({ label }) => (
            <TableHead key={label}>{label}</TableHead>
          ))}
          <TableHead accent>OVER</TableHead>
          <TableHead accent>POT</TableHead>
        </div>

        <div ref={parentRef} className="h-[600px] overflow-auto">
          <div className="relative" style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const player = sorted[virtualRow.index];

              return (
                <div
                  key={player.id}
                  className={`grid items-center border-b border-white/4 hover:bg-highlights1/5 transition-colors ${
                    virtualRow.index % 2 === 0 ? "bg-white/[0.018]" : ""
                  }`}
                  style={{
                    gridTemplateColumns: COLUMNS,
                    position: "absolute",
                    top: `${virtualRow.start}px`,
                    height: `${virtualRow.size}px`,
                    width: "100%",
                  }}
                >
                  <div className="pl-5 flex gap-2 items-center min-w-0">
                    <Pill variant="muted">{player.inCourtPosition}</Pill>
                    <span className="text-[13px] font-medium text-text1 truncate">
                      {player.firstName} {player.lastName}
                    </span>
                  </div>

                  {SKILLS.map(({ key }) => (
                    <div key={key} className="text-center text-[12px] text-text2">
                      {player.skillsRevealed[key]
                        ? `${player.minSkills[key]}–${player.maxSkills[key]}`
                        : "?"}
                    </div>
                  ))}

                  <div className="text-center text-[13px] font-medium text-highlights2">
                    {player.playerKnowledge > 100
                      ? `${playerMinAverage(player)}–${playerMaxAverage(player)}`
                      : "?"}
                  </div>

                  <div className="text-center text-[13px] font-medium text-highlights2">
                    {player.playerKnowledge === 100
                      ? `${player.minPotential}–${player.maxPotential}`
                      : "?"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TableCard>
  );
};
