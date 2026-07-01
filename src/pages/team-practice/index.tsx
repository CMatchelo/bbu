import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ParentSection } from "../../Components/ParentSection";
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
import { PlayTable } from "./components/PlayTable";

type OffKey = keyof OffensivePlaySystem;
type DefKey = keyof DefensivePlaySystem;

function sumPoints(system: Record<string, PlaytypeEntry>): number {
  return Object.values(system).reduce((acc, e) => acc + e.practicingPoints, 0);
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
    <ParentSection className="px-4">
      <div className="flex items-center mb-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto px-4 py-1.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider bg-highlights1 text-mainbgdark hover:bg-highlights1light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {t("systemGeneral.savePractice")}
        </button>
      </div>

      <div className="flex gap-4 overflow-auto">
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
    </ParentSection>
  );
}
