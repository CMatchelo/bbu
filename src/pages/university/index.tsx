import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { University } from "../../types/University";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { selectUniversityById } from "../../selectors/data.selectors";
import { FacilityCard } from "./components/FacilityCard";
import { useTranslation } from "react-i18next";
import { ParentSecion } from "../../Components/ParentSection";

export default function UniversityPage() {
  const { user } = useUser();
  const [uni, setUni] = useState<University | null>(null);
  const uniId = user?.currentUniversity.id ?? null;
  const selectedUni = useAppSelector(selectUniversityById(uniId));
  const { t } = useTranslation();

  useEffect(() => { setUni(selectedUni); }, [selectedUni]);

  const askImprovement = (depto: string) => console.log("improve:", depto);

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
        />
        <FacilityCard
          title={t("universityStrings.gym")}
          level={uni?.gymLevel}
          description={t("universityStrings.gymDesc")}
          onImprove={() => askImprovement("gym")}
        />
        <FacilityCard
          title={t("universityStrings.medicalCenter")}
          level={uni?.medicalCenterLevel}
          description={t("universityStrings.medicalCenterDesc")}
          onImprove={() => askImprovement("medicalCenter")}
        />
        <FacilityCard
          title={t("universityStrings.physioDept")}
          level={uni?.physioLevel}
          description={t("universityStrings.physioDeptDesc")}
          onImprove={() => askImprovement("physio")}
        />
        <FacilityCard
          title={t("universityStrings.eduSupport")}
          level={uni?.educationSupportLevel}
          description={t("universityStrings.eduSupportDesc")}
          onImprove={() => askImprovement("education")}
        />
        <FacilityCard
          title={t("universityStrings.prestige")}
          level={uni?.academicPrestige}
          description={t("universityStrings.prestigeDesc")}
          onImprove={() => askImprovement("academicPrestige")}
        />
      </div>
    </ParentSecion>
  );
}