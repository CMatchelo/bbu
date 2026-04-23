import { useTranslation } from "react-i18next";

const MAX_LEVEL = 5;

type FacilityCardProps = {
  title: string;
  level?: number;
  description: string;
  onImprove: () => void;
};

function LevelPips({ level = 0 }: { level?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: MAX_LEVEL }, (_, i) => (
        <div
          key={i}
          className={`w-[18px] h-1 rounded-full transition-colors ${
            i < level
              ? level >= 4
                ? "bg-highlights1light"
                : level <= 2
                ? "bg-highlights1dark"
                : "bg-highlights1"
              : "bg-white/[0.08]"
          }`}
        />
      ))}
    </div>
  );
}

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