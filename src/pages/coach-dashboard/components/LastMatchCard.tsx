import { useMemo } from "react";
import { Match } from "../../../types/Match";
import { University } from "../../../types/University";
import { DashboardCard } from "./DashboardCard";

interface LastMatchCardProps {
  match: Match | undefined;
  uniId: string;
  allUniversities: University[];
}

export function LastMatchCard({ match, uniId, allUniversities }: LastMatchCardProps) {
  const opponent = useMemo(() => {
    if (!match) return undefined;
    const oppId = match.home === uniId ? match.away : match.home;
    return allUniversities.find((u) => u.id === oppId);
  }, [match, uniId, allUniversities]);

  if (!match || !match.result || !opponent) {
    return (
      <DashboardCard title="Last Match">
        <p className="text-[12px] text-text2/50 italic">No matches played yet.</p>
      </DashboardCard>
    );
  }

  const userIsHome = match.home === uniId;
  const userScore = userIsHome ? match.result.homeScore : match.result.awayScore;
  const oppScore = userIsHome ? match.result.awayScore : match.result.homeScore;
  const won = userScore > oppScore;

  return (
    <DashboardCard title="Last Match">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[11px] text-text2/60 mb-0.5">Week {match.week}</p>
          <p className="text-[12px] text-text2">vs. {opponent.nickname}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[32px] font-black tabular-nums text-text1 leading-none">
            {userScore}
          </span>
          <span className="text-[16px] text-text2/40 font-medium">—</span>
          <span className="text-[32px] font-black tabular-nums text-text2/60 leading-none">
            {oppScore}
          </span>
          <span
            className={`ml-auto text-[13px] font-bold uppercase tracking-widest px-2.5 py-1 rounded ${
              won ? "bg-highlights1/15 text-highlights1" : "bg-red-500/15 text-red-400"
            }`}
          >
            {won ? "WIN" : "LOSS"}
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}
