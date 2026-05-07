import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import { ParentSecion } from "../../Components/ParentSection";
import { computeSeriesStates } from "../../utils/playoffsUtils";
import { selectAllUniversities } from "../../selectors/data.selectors";
import { toRecord } from "../../utils/toRecord";
import { useUser } from "../../Context/UserContext";
import { REGULAR_SEASON_WEEKS } from "../../constants/game.constants";
import { Match } from "../../types/Match";
import { SeriesState } from "../../types/SeriesState";
import { University } from "../../types/University";

const ROUND_LABELS: Record<number, string> = {
  1: "R1",
  2: "R2",
  3: "Quarters",
  4: "Semis",
  5: "Finals",
};

interface MatchupCardProps {
  series: SeriesState;
  uniById: Record<string, University>;
  currentSeason: number;
  games: Match[];
}

function MatchupCard({ series, uniById, currentSeason, games }: MatchupCardProps) {
  const home = uniById[series.homeId];
  const away = uniById[series.awayId];

  const homeSeed = home?.seasonRecords?.find((r) => r.season === currentSeason)?.regionalRank;
  const awaySeed = away?.seasonRecords?.find((r) => r.season === currentSeason)?.regionalRank;

  const isHomeWinner = series.decided && series.winnerId === series.homeId;
  const isAwayWinner = series.decided && series.winnerId === series.awayId;

  const sortedGames = [...games].sort((a, b) => (a.seriesGame ?? 0) - (b.seriesGame ?? 0));

  return (
    <div className="bg-cardbg border border-highlights1/15 rounded-xl p-4 flex flex-col gap-3">
      {/* Teams */}
      <div className="flex flex-col gap-1.5">
        <div className={`flex items-center justify-between ${isHomeWinner ? "text-highlights2" : "text-text1"}`}>
          <div className="flex items-center gap-2">
            {homeSeed != null && (
              <span className="text-[10px] font-medium text-text2 w-5 text-right shrink-0">#{homeSeed}</span>
            )}
            <span className={`text-[13px] font-semibold ${isHomeWinner ? "text-highlights2" : ""}`}>
              {home?.nickname ?? series.homeId}
            </span>
          </div>
          <span className={`text-[15px] font-bold tabular-nums ${isHomeWinner ? "text-highlights2" : ""}`}>
            {series.homeWins}
          </span>
        </div>

        <div className={`flex items-center justify-between ${isAwayWinner ? "text-highlights2" : "text-text1"}`}>
          <div className="flex items-center gap-2">
            {awaySeed != null && (
              <span className="text-[10px] font-medium text-text2 w-5 text-right shrink-0">#{awaySeed}</span>
            )}
            <span className={`text-[13px] font-semibold ${isAwayWinner ? "text-highlights2" : ""}`}>
              {away?.nickname ?? series.awayId}
            </span>
          </div>
          <span className={`text-[15px] font-bold tabular-nums ${isAwayWinner ? "text-highlights2" : ""}`}>
            {series.awayWins}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-highlights1/10" />

      {/* Per-game results */}
      <div className="flex flex-wrap gap-2">
        {sortedGames.map((game) => {
          if (!game.played || !game.result) {
            return (
              <div key={game.id} className="text-[11px] text-text2/40 tabular-nums">
                G{game.seriesGame} —
              </div>
            );
          }
          const homeScore = game.result.homeScore;
          const awayScore = game.result.awayScore;
          const homeWon = homeScore > awayScore;

          return (
            <div key={game.id} className="flex items-center gap-0.5 text-[11px] tabular-nums">
              <span className="text-text2/50 mr-0.5">G{game.seriesGame}</span>
              <span className={homeWon ? "text-green-400 font-semibold" : "text-text2"}>
                {homeScore}
              </span>
              <span className="text-text2/40">-</span>
              <span className={!homeWon ? "text-green-400 font-semibold" : "text-text2"}>
                {awayScore}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PlayoffsPage() {
  const { t } = useTranslation();
  const { user } = useUser();
  const currentWeek = useSelector((state: RootState) => state.schedule.currentWeek);
  const matchesById = useSelector((state: RootState) => state.schedule.matchesById);
  const allUniversities = useSelector(selectAllUniversities);
  const uniById = toRecord(allUniversities);

  const playoffMatchesExist = Object.values(matchesById).some(
    (m) => m.championship === "playoffs",
  );

  const allSeries = playoffMatchesExist ? computeSeriesStates(matchesById) : [];

  const availableRounds = [...new Set(allSeries.map((s) => s.round))].sort(
    (a, b) => a - b,
  ) as (1 | 2 | 3 | 4 | 5)[];

  const [selectedRound, setSelectedRound] = useState<1 | 2 | 3 | 4 | 5 | null>(
    availableRounds[0] ?? null,
  );

  const effectiveRound = selectedRound ?? availableRounds[0] ?? null;

  const seriesForRound = allSeries.filter((s) => s.round === effectiveRound);

  const gamesByMatchup = (matchupId: string): Match[] =>
    Object.values(matchesById).filter((m) => m.playoffMatchupId === matchupId);

  const currentSeason = user?.currentSeason ?? 0;

  const isEmpty = currentWeek <= REGULAR_SEASON_WEEKS || !playoffMatchesExist;

  return (
    <ParentSecion className="px-4 pb-10">
      <div className="flex flex-col gap-2">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-text2">
            {t("mainMenu.playoffs")}
          </span>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <span className="text-[13px] text-text2">
              {t("generalLocale.regularSeasonOngoing")}
            </span>
          </div>
        ) : (
          <>
            <div className="flex self-center bg-cardbg border border-highlights1/20 rounded-lg w-fit">
              {availableRounds.map((round) => (
                <button
                  key={round}
                  onClick={() => setSelectedRound(round)}
                  className={`px-4 py-2 text-[12px] font-medium whitespace-nowrap transition-all
                    ${effectiveRound === round
                      ? "bg-highlights2/12 text-highlights2"
                      : "text-text2 hover:bg-highlights2/6 hover:text-text1"
                    }`}
                >
                  {ROUND_LABELS[round]}
                </button>
              ))}
            </div>

            <div className={`grid gap-4 p-4 ${seriesForRound.length <= 2 ? "grid-cols-1 max-w-lg mx-auto w-full" : seriesForRound.length <= 8 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
              {seriesForRound.map((series) => (
                <MatchupCard
                  key={series.matchupId}
                  series={series}
                  uniById={uniById}
                  currentSeason={currentSeason}
                  games={gamesByMatchup(series.matchupId)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </ParentSecion>
  );
}
