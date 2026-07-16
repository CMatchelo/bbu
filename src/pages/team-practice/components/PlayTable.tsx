import { useTranslation } from "react-i18next";
import { PlaytypeEntry, OFFENSIVE_PLAY_LABELS, DefensivePlaySystem, OffensivePlaySystem } from "../../../types/PlaySystem";
import { RadarData } from "../../../types/RadarData";
import { MATCHUP_TABLE } from "../../../game/playSelection";
import RadarCustom from "./RadarPractice";

const MAX_POINTS = 10;
const MIN_PER_PLAY = 0;
const MAX_PER_PLAY = 5;

interface PlayTableProps {
  title: string;
  variant: "offensive" | "defensive";
  labels: Record<string, string>;
  system: Record<string, PlaytypeEntry>;
  onAdjust: (key: string, delta: 1 | -1) => void;
  usedPoints: number;
}

function getDefenseMatchups(defenseKey: keyof DefensivePlaySystem) {
  const strongVs: string[] = [];
  const weakVs: string[] = [];

  (Object.keys(MATCHUP_TABLE) as (keyof OffensivePlaySystem)[]).forEach((offenseKey) => {
    const value = MATCHUP_TABLE[offenseKey][defenseKey];
    if (value < 0) strongVs.push(OFFENSIVE_PLAY_LABELS[offenseKey]);
    else if (value > 0) weakVs.push(OFFENSIVE_PLAY_LABELS[offenseKey]);
  });

  return { strongVs, weakVs };
}

export function PlayTable({
  title,
  variant,
  labels,
  system,
  onAdjust,
  usedPoints,
}: PlayTableProps) {
  const { t } = useTranslation();
  const remaining = MAX_POINTS - usedPoints;

  const radarDataList: RadarData[] = Object.entries(labels).map(
    ([key, label]) => ({
      subject: label,
      value: system[key].familiarity,
    }),
  );

  return (
    <div className="rounded-xl bg-cardbg/75 border border-highlights1/15 flex-1">
      <div className="flex items-center justify-between px-5 py-3 bg-cardbglight/75 border-b border-highlights1/15">
        <span className="text-[11px] font-medium tracking-widest uppercase text-text2">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: MAX_POINTS }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < usedPoints ? "bg-highlights1" : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-text2 w-10 text-right">
            {remaining} left
          </span>
        </div>
      </div>

      <div className="divide-y divide-highlights1/8">
        {Object.entries(labels).map(([key, label]) => {
          const entry = system[key];
          const pts = entry.practicingPoints;
          const fam = entry.familiarity;
          const canIncrease = pts < MAX_PER_PLAY && remaining > 0;
          const canDecrease = pts > MIN_PER_PLAY;

          const matchups =
            variant === "defensive"
              ? getDefenseMatchups(key as keyof DefensivePlaySystem)
              : null;

          return (
            <div key={key} className="flex items-center gap-3 px-5 py-3">
              <div className="flex-1 min-w-0">
                <span className="text-[13px] text-text1">{label}</span>

                {variant === "offensive" && (
                  <p className="text-[10.5px] text-text2 mt-0.5">
                    {t(`teamPractice.offTendency.${key}`)}
                  </p>
                )}

                {variant === "defensive" && matchups && (
                  <div className="flex flex-col gap-0.5 mt-1">
                    {matchups.strongVs.length > 0 && (
                      <p className="text-[10.5px] text-highlights1">
                        {t("teamPractice.strongVs")}: {matchups.strongVs.join(", ")}
                      </p>
                    )}
                    {matchups.weakVs.length > 0 && (
                      <p className="text-[10.5px] text-highlights2">
                        {t("teamPractice.weakVs")}: {matchups.weakVs.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 w-28">
                <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-highlights2 rounded-full transition-all"
                    style={{ width: `${fam}%` }}
                  />
                </div>
                <span className="text-[10px] text-text2 w-6 text-right">
                  {fam}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onAdjust(key, -1)}
                  disabled={!canDecrease}
                  className="w-6 h-6 rounded flex items-center justify-center text-[14px] border border-white/10 text-text2 hover:text-text1 hover:border-white/25 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <span className="text-[13px] font-semibold text-text1 w-4 text-center">
                  {pts}
                </span>
                <button
                  onClick={() => onAdjust(key, 1)}
                  disabled={!canIncrease}
                  className="w-6 h-6 rounded flex items-center justify-center text-[14px] border border-white/10 text-text2 hover:text-text1 hover:border-white/25 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-highlights1/15">
        <RadarCustom
          radarDataList={radarDataList}
          title={t("generalLocale.playbookFamiliarity")}
        />
      </div>
    </div>
  );
}
