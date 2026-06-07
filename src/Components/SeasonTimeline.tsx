import { useSelector } from "react-redux";
import { RootState } from "../store";
import { computeSeriesStates } from "../utils/playoffsUtils";
import { REGULAR_SEASON_WEEKS } from "../constants/game.constants";

const LABELED_WEEKS = new Set([1, 5, 10, 15, 20, 25, 30, 36]);

const PLAYOFF_ROUNDS = [
  { round: 1, label: "R1" },
  { round: 2, label: "R2" },
  { round: 3, label: "QF" },
  { round: 4, label: "SF" },
  { round: 5, label: "F" },
] as const;

function getActivePlayoffRound(matchesById: Record<string, import("../types/Match").Match>): number | null {
  const allSeries = computeSeriesStates(matchesById);
  if (allSeries.length === 0) return null;
  return Math.max(...allSeries.map((s) => s.round));
}

export function SeasonTimeline() {
  const currentWeek = useSelector((state: RootState) => state.schedule.currentWeek);
  const matchesById = useSelector((state: RootState) => state.schedule.matchesById);

  const isInPlayoffs = currentWeek > REGULAR_SEASON_WEEKS;
  const activePlayoffRound = isInPlayoffs ? getActivePlayoffRound(matchesById) : null;

  return (
    <div className="flex w-full items-end">
      {/* Regular season — 36 equal segments */}
      {Array.from({ length: REGULAR_SEASON_WEEKS }, (_, i) => {
        const week = i + 1;
        const isCurrent = !isInPlayoffs && week === currentWeek;
        const isPast = isInPlayoffs || week < currentWeek;

        const barColor = isCurrent
          ? "bg-highlights1"
          : isPast
            ? "bg-highlights1/45"
            : "bg-highlights1/12";

        const labelColor = isCurrent
          ? "text-highlights1 font-bold"
          : isPast
            ? "text-text2/50"
            : "text-text2/25";

        return (
          <div key={week} className="flex-1 flex flex-col items-center gap-px min-w-0">
            {/* Current-week triangle */}
            <div className="h-1.5 flex items-end justify-center w-full">
              {isCurrent && (
                <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent border-t-highlights1" />
              )}
            </div>
            {/* Bar strip */}
            <div className={`w-full h-[3px] ${barColor}`} />
            {/* Week label */}
            <div className="h-3 flex items-start justify-center w-full mt-0.5">
              {/* {LABELED_WEEKS.has(week) && ( */}
                <span className={`text-[7px] leading-none tabular-nums ${labelColor}`}>
                  {week}
                </span>
              {/* )} */}
            </div>
          </div>
        );
      })}

      {/* Separator */}
      <div className="flex flex-col items-center self-stretch mx-0.5 shrink-0">
        <div className="flex-1" />
        <div className="w-px flex-3 bg-highlights1/30" />
        <div className="flex-1" />
      </div>

      {/* Playoff rounds — each 3× the flex weight of a regular week */}
      {PLAYOFF_ROUNDS.map(({ round, label }) => {
        const isCurrent = isInPlayoffs && activePlayoffRound === round;
        const isPast = isInPlayoffs && (activePlayoffRound ?? 0) > round;

        const barColor = isCurrent
          ? "bg-highlights2"
          : isPast
            ? "bg-highlights2/45"
            : "bg-highlights2/12";

        const labelColor = isCurrent
          ? "text-highlights2 font-bold"
          : isPast
            ? "text-text2/50"
            : "text-text2/25";

        return (
          <div key={round} className="flex-3 flex flex-col items-center gap-px min-w-0">
            {/* Current-round triangle */}
            <div className="h-1.5 flex items-end justify-center w-full">
              {isCurrent && (
                <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent border-t-highlights2" />
              )}
            </div>
            {/* Bar strip */}
            <div className={`w-full h-[3px] ${barColor}`} />
            {/* Round label */}
            <div className="h-3 flex items-start justify-center w-full mt-0.5">
              <span className={`text-[7px] leading-none font-medium ${labelColor}`}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
