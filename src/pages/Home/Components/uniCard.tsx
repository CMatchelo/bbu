import { useTranslation } from "react-i18next";
import { University } from "../../../types/University";
import { LevelPips } from "../../../Components/levelPips";
import { Icons } from "../../../utils/icons";

interface UniCardProps {
  university: University | null;
}

interface DeptoCellProps {
  locale: string;
  level: number;
  icon: React.ReactNode;
}

const DeptoCell = ({ locale, level, icon }: DeptoCellProps) => {
  const { t } = useTranslation();

  // Color the pip/badge based on level (1-5 scale assumed)
  const levelColor =
    level >= 4
      ? "text-highlights1 bg-highlights1/10"
      : level === 3
      ? "text-highlights2 bg-highlights2/10"
      : "text-text2 bg-cardbglight";

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-cardbglight/60 last:border-0">
      {/* Icon */}
      <span className="text-text2 shrink-0 opacity-70">{icon}</span>

      {/* Label */}
      <span className="text-[13px] text-text2 flex-1">{t(locale)}</span>

      {/* Pips */}
      <LevelPips level={level} />

      {/* Level badge */}
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-16 text-center tabular-nums ${levelColor}`}>
        {t("generalLocale.level")} {level}
      </span>
    </div>
  );
};

export const UniCard = ({ university }: UniCardProps) => {
  const { t } = useTranslation();

  if (!university)
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-text2 w-full max-w-md mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth={1} stroke="currentColor" className="size-10 opacity-25">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
        <p className="text-sm text-center leading-relaxed">
          Selecione uma universidade<br />
          <span className="text-xs opacity-60">para ver os detalhes</span>
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-3 mt-4 w-[600px] max-w-md">
      <div className="bg-cardbgdark border border-cardbglight/40 rounded-xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-cardbglight/40 justify-between gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-text1">
              {university.name}
            </h2>
            <h3 className="text-sm text-text2 mt-0.5">
              {university.nickname}
            </h3>
          </div>
        </div>

        <div className="px-5 py-1">
          <DeptoCell
            locale="universityStrings.court"
            level={university.courtLevel}
            icon={Icons.IconCourt}
          />
          <DeptoCell
            locale="universityStrings.gym"
            level={university.gymLevel}
            icon={Icons.IconGym}
          />
          <DeptoCell
            locale="universityStrings.medicalCenter"
            level={university.medicalCenterLevel}
            icon={Icons.IconMedical}
          />
          <DeptoCell
            locale="universityStrings.physioDept"
            level={university.physioLevel}
            icon={Icons.IconPhysio}
          />
          <DeptoCell
            locale="universityStrings.eduSupport"
            level={university.educationSupportLevel}
            icon={Icons.IconEdu}
          />
          <DeptoCell
            locale="universityStrings.prestige"
            level={university.academicPrestige}
            icon={Icons.IconPrestige}
          />
        </div>

        <div className="px-5 py-3 bg-mainbgdark/40 border-t border-cardbglight/40">
          <p className="text-xs text-text2 leading-relaxed italic">
            Aqui irá breve descrição da uni
          </p>
        </div>
      </div>
    </div>
  );
};
