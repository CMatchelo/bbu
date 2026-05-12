import { useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "../../store";
import { ParentSecion } from "../../Components/ParentSection";
import { useUser } from "../../Context/UserContext";
import { selectAllPlayers, selectAllUniversities } from "../../selectors/data.selectors";
import { useEndOfSeason } from "../../game/useEndOfSeason";
import { toRecord } from "../../utils/toRecord";

const LEAGUE_LABELS: Record<string, string> = {
  ne_league: "Northeast",
  n_league: "North",
  cw_league: "Central-West",
  se_league: "Southeast",
  s_league: "South",
};

interface StatLeader {
  name: string;
  uniId: string;
  value: number;
}

function getLeader(
  players: ReturnType<typeof selectAllPlayers>,
  uniById: ReturnType<typeof toRecord<ReturnType<typeof selectAllUniversities>[number]>>,
  season: number,
  statKey: "points" | "assists" | "rebounds" | "tpm" | "steals",
): StatLeader | null {
  let best: StatLeader | null = null;
  for (const p of players) {
    const stats = p.stats[season];
    if (!stats || stats.matches === 0) continue;
    const value = parseFloat((stats[statKey] / stats.matches).toFixed(1));
    if (!best || value > best.value) {
      best = {
        name: `${p.firstName} ${p.lastName}`,
        uniId: uniById[p.currentUniversity]?.id ?? p.currentUniversity,
        value,
      };
    }
  }
  return best;
}

export default function EndOfSeasonPage() {
  const { user } = useUser();
  const [isStarting, setIsStarting] = useState(false);
  const startNewSeason = useEndOfSeason();

  const standingsHistory = useSelector(
    (state: RootState) => state.schedule.leagueStandingsHistory,
  );
  const allPlayers = useSelector(selectAllPlayers);
  const allUniversities = useSelector(selectAllUniversities);

  const uniById = toRecord(allUniversities);
  const season = user?.currentSeason ?? 0;
  const standings = standingsHistory.find((s) => s.year === season);

  const STAT_LEADERS: { label: string; key: "points" | "assists" | "rebounds" | "tpm" | "steals" }[] = [
    { label: "Points", key: "points" },
    { label: "Assists", key: "assists" },
    { label: "Rebounds", key: "rebounds" },
    { label: "3PT Made", key: "tpm" },
    { label: "Steals", key: "steals" },
  ];

  const handleStartNewSeason = async () => {
    setIsStarting(true);
    await startNewSeason();
  };

  return (
    <ParentSecion className="px-6 py-4">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-semibold text-text1 tracking-wider uppercase">
            Season {season} — Final
          </h1>
          <button
            onClick={handleStartNewSeason}
            disabled={isStarting}
            className="px-6 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider bg-highlights1/15 text-highlights1 border border-highlights1/40 hover:bg-highlights1/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isStarting ? "Loading…" : `Start Season ${season + 1}`}
          </button>
        </div>

        {/* National Champion */}
        {standings?.nationalChampion && (
          <div className="flex flex-col items-center gap-1 py-5 rounded-xl bg-highlights2/10 border border-highlights2/25">
            <span className="text-[10px] text-highlights2 tracking-[0.15em] uppercase">National Champion</span>
            <span className="text-[22px] font-bold text-text1 mt-1">
              {uniById[standings.nationalChampion]?.nickname ?? standings.nationalChampion}
            </span>
            <span className="text-[12px] text-text2">{uniById[standings.nationalChampion]?.name}</span>
          </div>
        )}

        {/* League Champions */}
        {standings && (
          <div className="rounded-xl bg-cardbg/75 border border-highlights1/15 overflow-hidden">
            <div className="px-5 py-3 bg-cardbglight/75 border-b border-highlights1/15">
              <span className="text-[11px] font-medium tracking-widest uppercase text-text2">League Champions</span>
            </div>
            <div className="grid grid-cols-5 divide-x divide-highlights1/10">
              {(["ne_league", "n_league", "cw_league", "se_league", "s_league"] as const).map((leagueKey) => {
                const uniId = standings[leagueKey];
                const uni = uniById[uniId];
                return (
                  <div key={leagueKey} className="flex flex-col items-center gap-1 py-4 px-2">
                    <span className="text-[9px] text-text2 tracking-widest uppercase">{LEAGUE_LABELS[leagueKey]}</span>
                    <span className="text-[13px] font-semibold text-text1 mt-1 text-center">{uni?.nickname ?? uniId}</span>
                    <span className="text-[10px] text-text2 text-center">{uni?.id}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stat Leaders */}
        <div className="rounded-xl bg-cardbg/75 border border-highlights1/15 overflow-hidden">
          <div className="px-5 py-3 bg-cardbglight/75 border-b border-highlights1/15">
            <span className="text-[11px] font-medium tracking-widest uppercase text-text2">Season Leaders</span>
          </div>
          <div className="divide-y divide-highlights1/8">
            {STAT_LEADERS.map(({ label, key }) => {
              const leader = getLeader(allPlayers, uniById, season, key);
              return (
                <div key={key} className="flex items-center justify-between px-5 py-3">
                  <span className="text-[12px] text-text2 w-24">{label}</span>
                  {leader ? (
                    <>
                      <span className="text-[13px] font-medium text-text1 flex-1">{leader.name}</span>
                      <span className="text-[11px] text-text2 mx-3">{uniById[leader.uniId]?.id}</span>
                      <span className="text-[13px] font-semibold text-highlights2 w-12 text-right">{leader.value}</span>
                    </>
                  ) : (
                    <span className="text-[12px] text-text2">—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </ParentSecion>
  );
}
