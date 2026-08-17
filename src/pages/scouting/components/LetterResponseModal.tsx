import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LetterOutcome } from "../../../game/sendLetter";

export interface LetterModalResult {
  outcome: LetterOutcome;
  otherUniversityName?: string;
}

interface LetterResponseModalProps {
  result: LetterModalResult | null;
  onClose: () => void;
}

export function LetterResponseModal({ result, onClose }: LetterResponseModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!result) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [result, onClose]);

  if (!result) return null;

  const accepted = result.outcome === "accepted";
  const title = accepted
    ? t("scouting.letterAcceptedTitle")
    : result.outcome === "declined-other"
      ? t("scouting.letterDeclinedOtherTitle")
      : t("scouting.letterDeclinedWaitTitle");
  const message = accepted
    ? t("scouting.letterAcceptedMessage")
    : result.outcome === "declined-other"
      ? t("scouting.letterDeclinedOtherMessage", { university: result.otherUniversityName })
      : t("scouting.letterDeclinedWaitMessage");

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-xl border border-highlights1/20 bg-mainbgdark shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label={t("universityStrings.closeBtn")}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-md text-text2 hover:text-text1 hover:bg-white/10 transition-colors"
        >
          ×
        </button>

        <div className={`px-5 py-3.5 border-b ${accepted ? "border-highlights1/20 bg-highlights1/10" : "border-red-500/20 bg-red-500/10"}`}>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${accepted ? "bg-highlights1" : "bg-red-400"}`} />
            <span className="text-[11px] font-medium tracking-widest uppercase text-text2">
              {title}
            </span>
          </div>
        </div>

        <div className="px-5 py-5">
          <p className="text-[13px] leading-relaxed text-text1 whitespace-pre-line">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
