import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { University } from "../../types/University";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { selectUniversityById } from "../../selectors/data.selectors";
import { FacilityCard } from "./components/facilityCard";
import { useTranslation } from "react-i18next";

export default function UniversityPage() {
  const { user } = useUser();
  const [uni, setUni] = useState<University | null>(null);
  const uniId = user?.currentUniversity.id ?? null;
  const selectedUni = useAppSelector(selectUniversityById(uniId));
  const { t } = useTranslation()

  useEffect(() => {
    setUni(selectedUni);
  }, [selectedUni]);

  const askImprovement = (depto: string) => {
    console.log("Please pretty please", depto);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="border-b border-border pb-2">
        <h2 className="text-xl font-bold uppercase tracking-wide">
          {uni?.name} - {uni?.city}/{uni?.state}
        </h2>
        <h3 className="text-sm text-muted-foreground uppercase tracking-wide">
          {uni?.nickname}
        </h3>
      </div>
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
    </div>
  );
}
