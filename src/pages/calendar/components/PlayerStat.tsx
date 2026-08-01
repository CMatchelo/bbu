import { Pill } from "../../../Components/Pill";
import { Player } from "../../../types/Player";
import { PlayerSeasonStats } from "../../../types/SeasonStats";

interface PlayerStatProps {
  playerHome: Player;
  playerAway: Player;
  label: string;
  currentSeason: number;
  made: keyof PlayerSeasonStats;
  attempted: keyof PlayerSeasonStats;
}

function formatPct(
  player: Player,
  currentSeason: number,
  made: keyof PlayerSeasonStats,
  attempted: keyof PlayerSeasonStats,
) {
  const stats = player.stats[currentSeason];
  const att = Number(stats[attempted] ?? 0);
  const mde = Number(stats[made] ?? 0);
  return att === 0 ? "0%" : `${((mde / att) * 100).toFixed(1)}%`;
}

export function PlayerStat({
  playerHome,
  playerAway,
  label,
  currentSeason,
  made,
  attempted,
}: PlayerStatProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div className="flex items-center justify-end gap-1.5 min-w-0 text-[12px] text-text2">
        <span className="truncate">
          {playerHome.firstName[0]}. {playerHome.lastName}
        </span>
        <span className="shrink-0 tabular-nums font-semibold text-text1">
          {formatPct(playerHome, currentSeason, made, attempted)}
        </span>
      </div>

      <Pill rounded variant="muted" className="shrink-0 w-fit">
        {label}
      </Pill>

      <div className="flex items-center justify-start gap-1.5 min-w-0 text-[12px] text-text2">
        <span className="shrink-0 tabular-nums font-semibold text-text1">
          {formatPct(playerAway, currentSeason, made, attempted)}
        </span>
        <span className="truncate">
          {playerAway.firstName[0]}. {playerAway.lastName}
        </span>
      </div>
    </div>
  );
}
