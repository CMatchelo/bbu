import { useMemo } from "react";
import { Match } from "../../../types/Match";
import { University } from "../../../types/University";
import { DashboardCard } from "./DashboardCard";
import { StatRow } from "./StatRow";

interface NextMatchCardProps {
  match: Match | undefined;
  uniId: string;
  allUniversities: University[];
  currentSeason: number;
  isInPlayoffs: boolean;
}

export function NextMatchCard({
  match,
  uniId,
  allUniversities,
  currentSeason,
  isInPlayoffs,
}: NextMatchCardProps) {
  const opponent = useMemo(() => {
    if (!match) return undefined;
    const oppId = match.home === uniId ? match.away : match.home;
    return allUniversities.find((u) => u.id === oppId);
  }, [match, uniId, allUniversities]);

  const oppStats = opponent?.stats[currentSeason];
  const oppM = oppStats?.matches ?? 0;
  const oppWinPct = oppM > 0 ? Math.round(((oppStats?.wins ?? 0) / oppM) * 100) : 0;

  const leagueRank = useMemo(() => {
    if (!opponent || isInPlayoffs) return null;
    const leagueMates = allUniversities.filter((u) => u.leagueId === opponent.leagueId);
    const sorted = [...leagueMates].sort(
      (a, b) => (b.stats[currentSeason]?.wins ?? 0) - (a.stats[currentSeason]?.wins ?? 0),
    );
    return sorted.findIndex((u) => u.id === opponent.id) + 1;
  }, [opponent, allUniversities, currentSeason, isInPlayoffs]);

  if (!match || !opponent) {
    return (
      <DashboardCard title="Next Match">
        <p className="text-[12px] text-text2/50 italic">No upcoming match scheduled.</p>
      </DashboardCard>
    );
  }

  const isHome = match.home === uniId;

  return (
    <DashboardCard title="Next Match">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[11px] text-text2/60 mb-0.5">
            Week {match.week} · {isHome ? "Home" : "Away"}
          </p>
          <p className="text-[16px] font-bold text-text1">{opponent.nickname}</p>
          <p className="text-[12px] text-text2">{opponent.city}</p>
        </div>
        <div className="h-px bg-highlights1/12" />
        <div>
          <StatRow
            label="Record"
            value={`${oppStats?.wins ?? 0}W – ${oppM - (oppStats?.wins ?? 0)}L (${oppWinPct}%)`}
          />
          {leagueRank != null && (
            <StatRow label="League rank" value={`#${leagueRank}`} accent />
          )}
          {isInPlayoffs && match.playoffRound != null && (
            <StatRow label="Round" value={`Round ${match.playoffRound}`} accent />
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
