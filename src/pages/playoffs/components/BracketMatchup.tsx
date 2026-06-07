import { SeriesState } from "../../../types/SeriesState";
import { University } from "../../../types/University";
import { Match } from "../../../types/Match";

interface BracketMatchupProps {
  series: SeriesState | null;
  uniById: Record<string, University>;
  currentSeason: number;
  userUniId: string | undefined;
  games: Match[];
  winsNeeded: number;
}

function TeamRow({
  uni,
  seed,
  wins,
  isWinner,
  isUser,
}: {
  uni: University | undefined;
  seed: number | undefined;
  wins: number;
  isWinner: boolean;
  isUser: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 py-2 ${
        isWinner ? "bg-highlights2/8" : ""
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {seed != null && (
          <span className="text-[10px] font-medium text-text2/60 w-4 shrink-0 text-right">
            {seed}
          </span>
        )}
        <span
          className={`text-[12px] font-semibold truncate ${
            isWinner
              ? "text-highlights2"
              : isUser
                ? "text-highlights1"
                : "text-text1"
          }`}
        >
          {uni?.nickname ?? "—"}
        </span>
      </div>
      <span
        className={`text-[14px] font-bold tabular-nums shrink-0 ${
          isWinner ? "text-highlights2" : "text-text2"
        }`}
      >
        {wins}
      </span>
    </div>
  );
}

function TbdRow() {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span className="text-[10px] font-medium text-text2/40 w-4 shrink-0 text-right">—</span>
      <span className="text-[12px] font-medium text-text2/40">TBD</span>
    </div>
  );
}

export function BracketMatchup({
  series,
  uniById,
  currentSeason,
  userUniId,
  games,
  winsNeeded,
}: BracketMatchupProps) {
  const isUserMatch =
    series != null &&
    (series.homeId === userUniId || series.awayId === userUniId);

  const home = series ? uniById[series.homeId] : undefined;
  const away = series ? uniById[series.awayId] : undefined;

  const homeSeed = home?.seasonRecords?.find((r) => r.season === currentSeason)?.regionalRank;
  const awaySeed = away?.seasonRecords?.find((r) => r.season === currentSeason)?.regionalRank;

  const isHomeWinner = series?.decided && series.winnerId === series?.homeId;
  const isAwayWinner = series?.decided && series.winnerId === series?.awayId;

  const sortedGames = [...games].sort((a, b) => (a.seriesGame ?? 0) - (b.seriesGame ?? 0));

  return (
    <div
      className={`rounded-xl overflow-hidden border flex flex-col ${
        isUserMatch
          ? "border-highlights1/40 bg-cardbg/90"
          : "border-highlights1/15 bg-cardbg/60"
      }`}
    >
      {/* Series label */}
      <div className="px-3 pt-2 pb-1 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-widest text-text2/50">
          Best of {winsNeeded * 2 - 1}
        </span>
        {series?.decided && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-highlights2/70">
            Final
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex flex-col divide-y divide-highlights1/10">
        {series ? (
          <>
            <TeamRow
              uni={home}
              seed={homeSeed}
              wins={series.homeWins}
              isWinner={!!isHomeWinner}
              isUser={home?.id === userUniId}
            />
            <TeamRow
              uni={away}
              seed={awaySeed}
              wins={series.awayWins}
              isWinner={!!isAwayWinner}
              isUser={away?.id === userUniId}
            />
          </>
        ) : (
          <>
            <TbdRow />
            <TbdRow />
          </>
        )}
      </div>

      {/* Per-game results */}
      {sortedGames.length > 0 && (
        <div className="px-3 py-1.5 flex flex-wrap gap-x-3 gap-y-0.5 border-t border-highlights1/10">
          {sortedGames.map((game) => {
            if (!game.played || !game.result) {
              return (
                <span key={game.id} className="text-[10px] text-text2/30 tabular-nums">
                  G{game.seriesGame}
                </span>
              );
            }
            const { homeScore, awayScore } = game.result;
            const homeWon = homeScore > awayScore;
            return (
              <span key={game.id} className="text-[10px] tabular-nums text-text2/60">
                <span className={homeWon ? "text-highlights2/80 font-semibold" : ""}>{homeScore}</span>
                <span className="text-text2/30">-</span>
                <span className={!homeWon ? "text-highlights2/80 font-semibold" : ""}>{awayScore}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
