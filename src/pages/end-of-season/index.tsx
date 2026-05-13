import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import { useUser } from "../../Context/UserContext";
import { selectAllPlayers, selectAllUniversities } from "../../selectors/data.selectors";
import { useEndOfSeason } from "../../game/useEndOfSeason";
import { toRecord } from "../../utils/toRecord";
import { Pill } from "../../Components/Pill";

interface StatLeaderDisplay {
  name: string;
  universityId: string;
  value: number;
}

function getLeader(
  players: ReturnType<typeof selectAllPlayers>,
  season: number,
  key: "points" | "assists" | "rebounds" | "tpm" | "steals",
): StatLeaderDisplay | null {
  let best: StatLeaderDisplay | null = null;
  for (const p of players) {
    const s = p.stats[season];
    if (!s || s.matches === 0) continue;
    const value = parseFloat((s[key] / s.matches).toFixed(1));
    if (!best || value > best.value) {
      best = { name: `${p.firstName} ${p.lastName}`, universityId: p.currentUniversity, value };
    }
  }
  return best;
}

const LEAGUE_KEYS = ["ne_league", "n_league", "cw_league", "se_league", "s_league"] as const;

export default function EndOfSeasonPage() {
  const { t } = useTranslation();
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

  const STAT_LEADERS = [
    { labelKey: "generalLocale.points", statKey: "points" as const },
    { labelKey: "generalLocale.assists", statKey: "assists" as const },
    { labelKey: "generalLocale.rebounds", statKey: "rebounds" as const },
    { labelKey: "generalLocale.threePtMade", statKey: "tpm" as const },
    { labelKey: "generalLocale.steals", statKey: "steals" as const },
  ];

  const handleStartNewSeason = async () => {
    setIsStarting(true);
    await startNewSeason();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-mainbg">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-[18px] font-semibold text-text1 tracking-wider uppercase">
              {t("generalLocale.season")} {season} — Final
            </h1>
            <button
              onClick={handleStartNewSeason}
              disabled={isStarting}
              className="px-6 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider bg-highlights1/15 text-highlights1 border border-highlights1/40 hover:bg-highlights1/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isStarting ? "Loading…" : `${t("generalLocale.startNextSeason")} ${season + 1}`}
            </button>
          </div>

          {/* National Champion */}
          {standings?.nationalChampion && (
            <div className="flex flex-col items-center gap-1 py-5 rounded-xl bg-highlights2/10 border border-highlights2/25">
              <span className="text-[10px] text-highlights2 tracking-[0.15em] uppercase">
                {t("generalLocale.nationalChampion")}
              </span>
              <span className="text-[22px] font-bold text-text1 mt-1">
                {uniById[standings.nationalChampion]?.nickname ?? standings.nationalChampion}
              </span>
              <Pill className="min-w-20" variant="muted">{standings.nationalChampion.toUpperCase()}</Pill>
            </div>
          )}

          {/* Regional Champions */}
          {standings && (
            <div className="rounded-xl bg-cardbg/75 border border-highlights1/15 overflow-hidden">
              <div className="px-5 py-3 bg-cardbglight/75 border-b border-highlights1/15">
                <span className="text-[11px] font-medium tracking-widest uppercase text-text2">
                  {t("generalLocale.regionalChampions")}
                </span>
              </div>
              <div className="grid grid-cols-5 divide-x divide-highlights1/10">
                {LEAGUE_KEYS.map((leagueKey) => {
                  const uniId = standings[leagueKey];
                  const uni = uniById[uniId];
                  return (
                    <div key={leagueKey} className="flex flex-col items-center gap-1 py-4 px-2">
                      <span className="text-[9px] text-text2 tracking-widest uppercase">
                        {t(`championshipLocale.${leagueKey}`)}
                      </span>
                      <span className="text-[13px] font-semibold text-text1 mt-1 text-center">
                        {uni?.nickname ?? uniId}
                      </span>
                      <Pill className="min-w-20" variant="muted">{uniId.toUpperCase()}</Pill>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stat Leaders */}
          <div className="rounded-xl bg-cardbg/75 border border-highlights1/15 overflow-hidden">
            <div className="px-5 py-3 bg-cardbglight/75 border-b border-highlights1/15">
              <span className="text-[11px] font-medium tracking-widest uppercase text-text2">
                {t("generalLocale.seasonLeaders")}
              </span>
            </div>
            <div className="divide-y divide-highlights1/8">
              {STAT_LEADERS.map(({ labelKey, statKey }) => {
                const leader = getLeader(allPlayers, season, statKey);
                return (
                  <div key={statKey} className="flex items-center justify-between px-5 py-3">
                    <span className="text-[12px] text-text2 w-24">{t(labelKey)}</span>
                    {leader ? (
                      <>
                        <span className="text-[13px] font-medium text-text1 flex-1">
                          {leader.name}
                        </span>
                        <Pill variant="muted" className="mx-3 min-w-20">
                          {leader.universityId.toUpperCase()}
                        </Pill>
                        <span className="text-[13px] font-semibold text-highlights2 w-12 text-right">
                          {leader.value}
                        </span>
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
      </div>
    </div>
  );
}
