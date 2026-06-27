import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import { ParentSection } from "../../Components/ParentSection";
import { computeSeriesStates } from "../../utils/playoffsUtils";
import { selectAllUniversities } from "../../selectors/data.selectors";
import { toRecord } from "../../utils/toRecord";
import { useUser } from "../../Context/UserContext";
import { REGULAR_SEASON_WEEKS } from "../../constants/game.constants";
import { Match } from "../../types/Match";
import { SeriesState } from "../../types/SeriesState";
import { BracketMatchup } from "./components/BracketMatchup";

const ROUND_META: Record<number, { label: string; size: number; winsNeeded: number }> = {
  1: { label: "Round 1",    size: 16, winsNeeded: 2 },
  2: { label: "Round 2",    size: 8,  winsNeeded: 3 },
  3: { label: "Quarters",   size: 4,  winsNeeded: 4 },
  4: { label: "Semis",      size: 2,  winsNeeded: 4 },
  5: { label: "Finals",     size: 1,  winsNeeded: 4 },
};

const ALL_ROUNDS = [1, 2, 3, 4, 5] as const;

function slotOf(matchupId: string): number {
  return parseInt(matchupId.split("-S")[1] ?? "0", 10);
}

export default function PlayoffsPage() {
  const { t } = useTranslation();
  const { user } = useUser();
  const currentWeek = useSelector((state: RootState) => state.schedule.currentWeek);
  const matchesById = useSelector((state: RootState) => state.schedule.matchesById);
  const allUniversities = useSelector(selectAllUniversities);
  const uniById = toRecord(allUniversities);

  const userUniId = user?.currentUniversity?.id;
  const currentSeason = user?.currentSeason ?? 0;

  const playoffMatchesExist = Object.values(matchesById).some(
    (m) => m.championship === "playoffs",
  );

  const allSeries = playoffMatchesExist ? computeSeriesStates(matchesById) : [];

  const availableRounds = new Set(allSeries.map((s) => s.round));

  const firstAvailable = ALL_ROUNDS.find((r) => availableRounds.has(r)) ?? 1;
  const [selectedRound, setSelectedRound] = useState<1 | 2 | 3 | 4 | 5>(firstAvailable);

  const isEmpty = currentWeek <= REGULAR_SEASON_WEEKS || !playoffMatchesExist;

  const seriesForRound = allSeries.filter((s) => s.round === selectedRound);
  const meta = ROUND_META[selectedRound];

  // Build a slot-indexed map for the selected round
  const seriesBySlot = new Map<number, SeriesState>();
  for (const s of seriesForRound) seriesBySlot.set(slotOf(s.matchupId), s);

  const gamesByMatchup = (matchupId: string): Match[] =>
    Object.values(matchesById).filter((m) => m.playoffMatchupId === matchupId);

  // Grid columns per round
  const gridCols =
    meta.size === 1 ? "grid-cols-1 max-w-xs mx-auto" :
    meta.size === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto" :
    meta.size <= 4  ? "grid-cols-2" :
    meta.size <= 8  ? "grid-cols-2 lg:grid-cols-4" :
                      "grid-cols-2 lg:grid-cols-4";

  return (
    <ParentSection className="px-4 pb-10">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full px-4 py-4">

          {/* Header */}
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text2">
              {t("mainMenu.playoffs")}
            </span>
          </div>

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="text-[13px] text-text2">
                {t("generalLocale.regularSeasonOngoing")}
              </span>
            </div>
          ) : (
            <>
              {/* Bracket round navigator */}
              <div className="flex items-center justify-center gap-0">
                {ALL_ROUNDS.map((round, i) => {
                  const roundMeta = ROUND_META[round];
                  const hasData = availableRounds.has(round);
                  const isActive = round === selectedRound;
                  const isCompleted = hasData && allSeries
                    .filter((s) => s.round === round)
                    .every((s) => s.decided);

                  return (
                    <div key={round} className="flex items-center">
                      <button
                        onClick={() => setSelectedRound(round)}
                        disabled={!hasData}
                        className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-highlights2/15 text-highlights2"
                            : hasData
                              ? "text-text2 hover:text-text1 hover:bg-white/5"
                              : "text-text2/25 cursor-default"
                        }`}
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          {roundMeta.label}
                        </span>
                        <span className="text-[10px] font-medium mt-0.5 opacity-60">
                          {isCompleted ? "✓" : `${roundMeta.size} ${roundMeta.size === 1 ? "match" : "matches"}`}
                        </span>
                      </button>
                      {i < ALL_ROUNDS.length - 1 && (
                        <span className="text-text2/20 text-[12px] px-1">›</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Matchup grid */}
              <div className={`grid gap-3 w-full ${gridCols}`}>
                {Array.from({ length: meta.size }, (_, i) => {
                  const slot = i + 1;
                  const series = seriesBySlot.get(slot) ?? null;
                  const games = series ? gamesByMatchup(series.matchupId) : [];

                  return (
                    <BracketMatchup
                      key={slot}
                      series={series}
                      uniById={uniById}
                      currentSeason={currentSeason}
                      userUniId={userUniId}
                      games={games}
                      winsNeeded={meta.winsNeeded}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </ParentSection>
  );
}
