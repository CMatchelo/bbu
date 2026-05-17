import { Player } from "../../../types/Player";
import { DashboardCard } from "./DashboardCard";

interface StatLeadersCardProps {
  players: Player[];
  currentSeason: number;
  className?: string;
}

export function StatLeadersCard({ players, currentSeason, className }: StatLeadersCardProps) {
  const eligible = players.filter((p) => (p.stats[currentSeason]?.matches ?? 0) > 0);

  const byFgPct = [...eligible]
    .filter((p) => (p.stats[currentSeason]?.fga ?? 0) >= 10)
    .sort((a, b) => {
      const aP = (a.stats[currentSeason].fgm ?? 0) / (a.stats[currentSeason].fga ?? 1);
      const bP = (b.stats[currentSeason].fgm ?? 0) / (b.stats[currentSeason].fga ?? 1);
      return bP - aP;
    });

  const byTpPct = [...eligible]
    .filter((p) => (p.stats[currentSeason]?.tpa ?? 0) >= 5)
    .sort((a, b) => {
      const aP = (a.stats[currentSeason].tpm ?? 0) / (a.stats[currentSeason].tpa ?? 1);
      const bP = (b.stats[currentSeason].tpm ?? 0) / (b.stats[currentSeason].tpa ?? 1);
      return bP - aP;
    });

  const perGame = (p: Player, key: "steals" | "blocks" | "assists") => {
    const m = p.stats[currentSeason]?.matches || 1;
    return (p.stats[currentSeason]?.[key] ?? 0) / m;
  };

  const byStl = [...eligible].sort((a, b) => perGame(b, "steals") - perGame(a, "steals"));
  const byBlk = [...eligible].sort((a, b) => perGame(b, "blocks") - perGame(a, "blocks"));
  const byAst = [...eligible].sort((a, b) => perGame(b, "assists") - perGame(a, "assists"));

  const pct = (num: number, den: number) =>
    den > 0 ? `${((num / den) * 100).toFixed(1)}%` : "—";

  const leaders: { label: string; player: Player | undefined; value: string }[] = [
    {
      label: "FG%",
      player: byFgPct[0],
      value: byFgPct[0]
        ? pct(byFgPct[0].stats[currentSeason].fgm, byFgPct[0].stats[currentSeason].fga)
        : "—",
    },
    {
      label: "3PT%",
      player: byTpPct[0],
      value: byTpPct[0]
        ? pct(byTpPct[0].stats[currentSeason].tpm, byTpPct[0].stats[currentSeason].tpa)
        : "—",
    },
    {
      label: "STL",
      player: byStl[0],
      value: byStl[0] ? `${perGame(byStl[0], "steals").toFixed(1)}/g` : "—",
    },
    {
      label: "BLK",
      player: byBlk[0],
      value: byBlk[0] ? `${perGame(byBlk[0], "blocks").toFixed(1)}/g` : "—",
    },
    {
      label: "AST",
      player: byAst[0],
      value: byAst[0] ? `${perGame(byAst[0], "assists").toFixed(1)}/g` : "—",
    },
  ];

  return (
    <DashboardCard title="Stat Leaders" className={className}>
      <div className="divide-y divide-highlights1/8">
        {leaders.map(({ label, player, value }) => (
          <div key={label} className="flex items-center gap-3 py-2">
            <span className="text-[10px] uppercase tracking-widest text-text2/60 w-8 shrink-0">
              {label}
            </span>
            <span className="text-[13px] font-medium text-text1 flex-1 truncate">
              {player ? `${player.firstName} ${player.lastName}` : "—"}
            </span>
            <span className="text-[13px] font-bold tabular-nums text-highlights2 shrink-0">
              {value}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
