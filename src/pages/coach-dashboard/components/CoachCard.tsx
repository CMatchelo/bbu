import { User } from "../../../types/User";
import { TeamSeasonStats } from "../../../types/SeasonStats";
import { DashboardCard } from "./DashboardCard";
import { StatRow } from "./StatRow";

interface CoachCardProps {
  user: User;
  seasonStats: TeamSeasonStats | undefined;
  last5: ("W" | "L")[];
}

export function CoachCard({ user, seasonStats, last5 }: CoachCardProps) {
  const totalGames = (user.careerWins ?? 0) + (user.careerLosses ?? 0);
  const careerWinPct = totalGames > 0 ? Math.round(((user.careerWins ?? 0) / totalGames) * 100) : 0;
  const careerPpg = totalGames > 0 ? ((user.careerPointsMade ?? 0) / totalGames).toFixed(1) : "—";

  const seasonM = seasonStats?.matches ?? 0;
  const seasonW = seasonStats?.wins ?? 0;
  const seasonL = seasonM - seasonW;
  const seasonPpg = seasonM > 0 ? ((seasonStats?.points ?? 0) / seasonM).toFixed(1) : "—";

  return (
    <DashboardCard title="Coach">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[15px] font-bold text-text1">{user.name}</p>
          <p className="text-[11px] text-text2">
            Season {user.currentSeason} · Rep {user.reputation}
          </p>
        </div>

        <div className="h-px bg-highlights1/12" />

        <div>
          <p className="text-[9px] uppercase tracking-widest text-text2/60 mb-1.5">Career</p>
          <StatRow
            label="Record"
            value={`${user.careerWins ?? 0}W – ${user.careerLosses ?? 0}L (${careerWinPct}%)`}
            accent
          />
          <StatRow
            label="Points"
            value={`${(user.careerPointsMade ?? 0).toLocaleString()} pts · ${careerPpg}/g`}
          />
        </div>

        <div className="h-px bg-highlights1/12" />

        <div>
          <p className="text-[9px] uppercase tracking-widest text-text2/60 mb-1.5">This Season</p>
          <StatRow label="Record" value={`${seasonW}W – ${seasonL}L`} accent />
          <StatRow label="PPG" value={seasonPpg} />
        </div>

        {last5.length > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[9px] uppercase tracking-widest text-text2/60 mr-0.5">Last 5</span>
            {last5.map((result, i) => (
              <span
                key={i}
                className={`text-[10px] font-bold w-5 h-5 rounded-sm flex items-center justify-center ${
                  result === "W"
                    ? "bg-highlights1/15 text-highlights1"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {result}
              </span>
            ))}
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
