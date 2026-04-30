import { useTranslation } from "react-i18next";
import { LevelPips } from "../../../Components/LevelPips";

type FacilityCardProps = {
  title: string;
  level?: number;
  description: string;
  onImprove: () => void;
};

export function FacilityCard({ title, level, description, onImprove }: FacilityCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl overflow-hidden border border-highlights1/15 bg-mainbg hover:border-highlights1/30 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-cardbg border-b border-highlights1/10">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium tracking-widest uppercase text-text1">
            {title}
          </span>
          {level !== undefined && (
            <span className="text-[10px] font-medium text-highlights2 bg-highlights2/10 border border-highlights2/25 rounded px-1.5 py-0.5">
              Nível {level}
            </span>
          )}
        </div>
        <button
          onClick={onImprove}
          className="text-[10px] font-medium tracking-wider uppercase px-3 py-1.5
            text-highlights1 bg-highlights1/10 border border-highlights1/30 rounded-md
            hover:bg-highlights1/20 hover:border-highlights1 transition-all"
        >
          {t("universityStrings.improveBtn")}
        </button>
      </div>

      {/* Body */}
      <div className="px-3.5 py-3 flex flex-col gap-2">
        <LevelPips level={level} />
        <p className="text-[11px] leading-relaxed text-text2">{description}</p>
      </div>
    </div>
  );
}