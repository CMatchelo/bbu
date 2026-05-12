import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import { selectAllUniversities } from "../../selectors/data.selectors";
import { toRecord } from "../../utils/toRecord";
import { Pill } from "../../Components/Pill";
import { ParentSecion } from "../../Components/ParentSection";

const LEAGUE_KEYS = ["ne_league", "n_league", "cw_league", "se_league", "s_league"] as const;

const STAT_FIELDS = [
  { labelKey: "generalLocale.points", field: "leaders_points" as const },
  { labelKey: "generalLocale.assists", field: "leaders_assists" as const },
  { labelKey: "generalLocale.rebounds", field: "leaders_rebounds" as const },
  { labelKey: "generalLocale.threePtMade", field: "leaders_tpm" as const },
  { labelKey: "generalLocale.steals", field: "leaders_steals" as const },
] as const;

export default function ChampionsPage() {
  const { t } = useTranslation();

  const standingsHistory = useSelector(
    (state: RootState) => state.schedule.leagueStandingsHistory,
  );
  const allUniversities = useSelector(selectAllUniversities);
  const uniById = toRecord(allUniversities);

  const sorted = [...standingsHistory].sort((a, b) => b.year - a.year);

  return (
    <ParentSecion>
      <div className="flex flex-col gap-2 mb-5">
        <h1 className="text-[16px] font-semibold text-text1 tracking-wider uppercase">
          {t("generalLocale.champions")}
        </h1>
      </div>

      {sorted.length === 0 ? (
        <p className="text-[13px] text-text2 text-center mt-10">
          {t("generalLocale.noChampionsYet")}
        </p>
      ) : (
        <div className="flex flex-col gap-10 overflow-auto">
          {sorted.map((standings) => {
            const champion = standings.nationalChampion
              ? uniById[standings.nationalChampion]
              : null;

            return (
              <div key={standings.year} className="flex flex-col gap-4">

                {/* Season year */}
                <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-text2">
                  {t("generalLocale.season")} {standings.year}
                </p>

                {/* National champion — hero */}
                <div className="flex flex-col items-center gap-2 py-8 rounded-2xl bg-highlights2/8 border border-highlights2/20">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-highlights2/70">
                    {t("generalLocale.nationalChampion")}
                  </span>
                  <span className="text-[32px] font-bold text-text1 leading-tight mt-1">
                    {champion?.nickname ?? standings.nationalChampion}
                  </span>
                  {champion && (
                    <span className="text-[12px] text-text2">{champion.name}</span>
                  )}
                  <Pill variant="yellow" className="mt-1">
                    {standings.nationalChampion.toUpperCase()}
                  </Pill>
                </div>

                {/* Regional + Stat leaders — compact side by side */}
                <div className="grid grid-cols-2 gap-3">

                  {/* Regional champions */}
                  <div className="rounded-xl bg-cardbg/60 border border-highlights1/12 overflow-hidden">
                    <div className="px-4 py-2 border-b border-highlights1/12">
                      <span className="text-[9px] font-medium tracking-widest uppercase text-text2/70">
                        {t("generalLocale.regionalChampions")}
                      </span>
                    </div>
                    <div className="divide-y divide-highlights1/8">
                      {LEAGUE_KEYS.map((leagueKey) => {
                        const uniId = standings[leagueKey];
                        const uni = uniById[uniId];
                        return (
                          <div key={leagueKey} className="flex items-center justify-between px-4 py-2">
                            <span className="text-[10px] text-text2/70">
                              {t(`championshipLocale.${leagueKey}`)}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-text1">
                                {uni?.nickname ?? uniId}
                              </span>
                              <Pill variant="muted">{uniId.toUpperCase()}</Pill>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stat leaders */}
                  <div className="rounded-xl bg-cardbg/60 border border-highlights1/12 overflow-hidden">
                    <div className="px-4 py-2 border-b border-highlights1/12">
                      <span className="text-[9px] font-medium tracking-widest uppercase text-text2/70">
                        {t("generalLocale.seasonLeaders")}
                      </span>
                    </div>
                    <div className="divide-y divide-highlights1/8">
                      {STAT_FIELDS.map(({ labelKey, field }) => {
                        const leader = standings[field];
                        return (
                          <div key={field} className="flex items-center justify-between px-4 py-2">
                            <span className="text-[10px] text-text2/70 w-16">{t(labelKey)}</span>
                            {leader ? (
                              <>
                                <span className="text-[11px] text-text1 flex-1 truncate mx-1">
                                  {leader.firstName} {leader.lastName}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <Pill variant="muted">{leader.universityId.toUpperCase()}</Pill>
                                  <span className="text-[11px] font-semibold text-highlights2 w-8 text-right">
                                    {leader.value}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="text-[11px] text-text2">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </ParentSecion>
  );
}
