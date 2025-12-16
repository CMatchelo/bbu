import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { University } from "../../types/University";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { selectUniversityById } from "../../selectors/data.selectors";
import { FacilityCard } from "./components/facilityCard";

export default function UniversityPage() {
  const { user } = useUser();
  const [uni, setUni] = useState<University | null>(null);
  const uniId = user?.currentUniversity.id ?? null;
  const selectedUni = useAppSelector(selectUniversityById(uniId));

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
          title="Court"
          level={uni?.courtLevel}
          description="Improves technical training quality. Higher levels accelerate development of shooting, passing, and ball handling skills."
          onImprove={() => askImprovement("court")}
        />

        <FacilityCard
          title="Gym"
          level={uni?.gymLevel}
          description="Enhances physical conditioning and defensive work, improving strength, speed, rebounding, and defensive attributes."
          onImprove={() => askImprovement("gym")}
        />

        <FacilityCard
          title="Medical Center"
          level={uni?.medicalCenterLevel}
          description="Reduces injury recovery time, allowing players to return to match fitness faster."
          onImprove={() => askImprovement("medicalCenter")}
        />

        <FacilityCard
          title="Physio Department"
          level={uni?.physioLevel}
          description="Manages player fatigue and conditioning, slowing stamina loss during matches and improving recovery."
          onImprove={() => askImprovement("physio")}
        />

        <FacilityCard
          title="Education Support"
          level={uni?.educationSupportLevel}
          description="Supports academic performance, reducing off-court issues and improving player discipline."
          onImprove={() => askImprovement("education")}
        />

        <FacilityCard
          title="Academic Prestige"
          level={uni?.academicPrestige}
          description="Reflects the university’s academic reputation, influencing recruiting success and transfer interest."
          onImprove={() => askImprovement("academicPrestige")}
        />
      </div>
    </div>
  );
}
