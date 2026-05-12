import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ParentSecion } from "../../Components/ParentSection";
import { useAuthUser } from "../../hooks/useAuthUser";
import { selectUniversityById } from "../../selectors/data.selectors";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateUniversities } from "../../store/slices/dataSlice";
import { saveUniversities } from "../../utils/saveGame";
import {
  OffensivePlaySystem,
  DefensivePlaySystem,
  OFFENSIVE_PLAY_LABELS,
  DEFENSIVE_PLAY_LABELS,
  PlaytypeEntry,
} from "../../types/PlaySystem";
import {
  createDefaultOffensivePlaySystem,
  createDefaultDefensivePlaySystem,
} from "../../utils/createPlaySystem";

const MAX_POINTS = 10;
const MIN_PER_PLAY = 0;
const MAX_PER_PLAY = 5;

type OffKey = keyof OffensivePlaySystem;
type DefKey = keyof DefensivePlaySystem;

function sumPoints(system: Record<string, PlaytypeEntry>): number {
  return Object.values(system).reduce((acc, e) => acc + e.practicingPoints, 0);
}

interface PlayTableProps {
  title: string;
  labels: Record<string, string>;
  system: Record<string, PlaytypeEntry>;
  onAdjust: (key: string, delta: 1 | -1) => void;
  usedPoints: number;
}

function PlayTable({ title, labels, system, onAdjust, usedPoints }: PlayTableProps) {
  const remaining = MAX_POINTS - usedPoints;

  return (
    <div className="rounded-xl bg-cardbg/75 border border-highlights1/15 overflow-hidden flex-1">
      {/* Header */}
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

      {/* Rows */}
      <div className="divide-y divide-highlights1/8">
        {Object.entries(labels).map(([key, label]) => {
          const entry = system[key];
          const pts = entry.practicingPoints;
          const fam = entry.familiarity;
          const canIncrease = pts < MAX_PER_PLAY && remaining > 0;
          const canDecrease = pts > MIN_PER_PLAY;

          return (
            <div key={key} className="flex items-center gap-3 px-5 py-3">
              <span className="text-[13px] text-text1 flex-1">{label}</span>

              {/* Familiarity bar */}
              <div className="flex items-center gap-1.5 w-28">
                <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-highlights2 rounded-full transition-all"
                    style={{ width: `${fam}%` }}
                  />
                </div>
                <span className="text-[10px] text-text2 w-6 text-right">{fam}</span>
              </div>

              {/* Points control */}
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
    </div>
  );
}

export default function TeamPractice() {
  const { t } = useTranslation();
  const user = useAuthUser();
  const dispatch = useAppDispatch();

  const university = useSelector(selectUniversityById(user.currentUniversity.id));

  const [offensive, setOffensive] = useState<OffensivePlaySystem>(
    () => university?.offensive ?? createDefaultOffensivePlaySystem(),
  );
  const [defensive, setDefensive] = useState<DefensivePlaySystem>(
    () => university?.defensive ?? createDefaultDefensivePlaySystem(),
  );
  const [isSaving, setIsSaving] = useState(false);

  const offPoints = sumPoints(offensive);
  const defPoints = sumPoints(defensive);

  const adjustOffensive = (key: string, delta: 1 | -1) => {
    setOffensive((prev) => ({
      ...prev,
      [key]: {
        ...prev[key as OffKey],
        practicingPoints: prev[key as OffKey].practicingPoints + delta,
      },
    }));
  };

  const adjustDefensive = (key: string, delta: 1 | -1) => {
    setDefensive((prev) => ({
      ...prev,
      [key]: {
        ...prev[key as DefKey],
        practicingPoints: prev[key as DefKey].practicingPoints + delta,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    dispatch(
      updateUniversities([{
        id: user.currentUniversity.id,
        changes: { offensive, defensive },
      }]),
    );
    const folderName = `${user.name}_${user.id}`;
    await saveUniversities(folderName);
    setIsSaving(false);
  };

  return (
    <ParentSecion className="px-4">
      <div className="flex items-center mb-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto px-4 py-1.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider bg-highlights1 text-mainbgdark hover:bg-highlights1light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {t("systemGeneral.savePractice")}
        </button>
      </div>

      <div className="flex gap-4">
        <PlayTable
          title="Offensive"
          labels={OFFENSIVE_PLAY_LABELS}
          system={offensive}
          onAdjust={adjustOffensive}
          usedPoints={offPoints}
        />
        <PlayTable
          title="Defensive"
          labels={DEFENSIVE_PLAY_LABELS}
          system={defensive}
          onAdjust={adjustDefensive}
          usedPoints={defPoints}
        />
      </div>
    </ParentSecion>
  );
}
