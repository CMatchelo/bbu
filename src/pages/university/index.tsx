import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { University } from "../../types/University";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { selectUniversityById } from "../../selectors/data.selectors";
import { FacilityCard } from "./components/FacilityCard";
import { FacilityResponseModal } from "./components/FacilityResponseModal";
import { useTranslation } from "react-i18next";
import { ParentSecion } from "../../Components/ParentSection";
import { calcFacilityAcceptance } from "../../game/facilityImprovement";
import { updateUniversities } from "../../store/slices/dataSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { saveUniversities } from "../../utils/saveGame";

type FacilityKey = keyof Pick<
  University,
  "courtLevel" | "gymLevel" | "medicalCenterLevel" | "physioLevel" | "educationSupportLevel" | "academicPrestige"
>;

const FACILITY_FIELDS: Record<string, FacilityKey> = {
  court: "courtLevel",
  gym: "gymLevel",
  medicalCenter: "medicalCenterLevel",
  physio: "physioLevel",
  education: "educationSupportLevel",
  academicPrestige: "academicPrestige",
};

export default function UniversityPage() {
  const { user, updateUser } = useUser();
  const dispatch = useAppDispatch();
  const [uni, setUni] = useState<University | null>(null);
  const uniId = user?.currentUniversity.id ?? null;
  const selectedUni = useAppSelector(selectUniversityById(uniId));
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const [lastAccepted, setLastAccepted] = useState(false);

  useEffect(() => { setUni(selectedUni); }, [selectedUni]);

  const askImprovement = async (depto: string) => {
    if (!user || !uni) return;
    const field = FACILITY_FIELDS[depto];
    if (!field) return;
    const currentLevel = uni[field] as number;
    if (currentLevel >= 5) return;

    const accepted = calcFacilityAcceptance(user.reputation ?? 50, currentLevel);
    setLastAccepted(accepted);
    setModalOpen(true);

    const folderName = `${user.name}_${user.id}`;

    if (accepted) {
      dispatch(updateUniversities([{ id: uni.id, changes: { [field]: currentLevel + 1 } }]));
      await saveUniversities(folderName);
      const updatedUser = { ...user, reputation: 40 };
      updateUser(updatedUser);
      await window.api.saveGame(updatedUser);
    } else {
      const newRep = Math.min(user.reputation ?? 50, 59);
      const updatedUser = { ...user, reputation: newRep };
      updateUser(updatedUser);
      await window.api.saveGame(updatedUser);
    }
  };

  return (
    <ParentSecion className="px-4">
      {/* Header */}
      <div className="pb-4 mb-2 border-b border-highlights1/15">
        <h2 className="text-lg font-semibold tracking-widest uppercase text-text1">
          {uni?.name}{" "}
          <span className="text-highlights1">
            — {uni?.city}/{uni?.state}
          </span>
        </h2>
        <p className="text-[11px] font-medium tracking-widest uppercase text-text2 mt-1">
          {uni?.nickname}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FacilityCard
          title={t("universityStrings.court")}
          level={uni?.courtLevel}
          description={t("universityStrings.courtDesc")}
          onImprove={() => askImprovement("court")}
          disabled={(uni?.courtLevel ?? 0) >= 5}
        />
        <FacilityCard
          title={t("universityStrings.gym")}
          level={uni?.gymLevel}
          description={t("universityStrings.gymDesc")}
          onImprove={() => askImprovement("gym")}
          disabled={(uni?.gymLevel ?? 0) >= 5}
        />
        <FacilityCard
          title={t("universityStrings.medicalCenter")}
          level={uni?.medicalCenterLevel}
          description={t("universityStrings.medicalCenterDesc")}
          onImprove={() => askImprovement("medicalCenter")}
          disabled={(uni?.medicalCenterLevel ?? 0) >= 5}
        />
        <FacilityCard
          title={t("universityStrings.physioDept")}
          level={uni?.physioLevel}
          description={t("universityStrings.physioDeptDesc")}
          onImprove={() => askImprovement("physio")}
          disabled={(uni?.physioLevel ?? 0) >= 5}
        />
        <FacilityCard
          title={t("universityStrings.eduSupport")}
          level={uni?.educationSupportLevel}
          description={t("universityStrings.eduSupportDesc")}
          onImprove={() => askImprovement("education")}
          disabled={(uni?.educationSupportLevel ?? 0) >= 5}
        />
        <FacilityCard
          title={t("universityStrings.prestige")}
          level={uni?.academicPrestige}
          description={t("universityStrings.prestigeDesc")}
          onImprove={() => askImprovement("academicPrestige")}
          disabled={(uni?.academicPrestige ?? 0) >= 5}
        />
      </div>

      <FacilityResponseModal
        open={modalOpen}
        accepted={lastAccepted}
        onClose={() => setModalOpen(false)}
      />
    </ParentSecion>
  );
}
