import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface FacilityResponseModalProps {
  open: boolean;
  accepted: boolean;
  onClose: () => void;
}

export function FacilityResponseModal({ open, accepted, onClose }: FacilityResponseModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-4 rounded-xl border border-highlights1/20 bg-mainbgdark shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-5 py-3.5 border-b ${accepted ? "border-highlights1/20 bg-highlights1/10" : "border-red-500/20 bg-red-500/10"}`}>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${accepted ? "bg-highlights1" : "bg-red-400"}`} />
            <span className="text-[11px] font-medium tracking-widest uppercase text-text2">
              {t("universityStrings.officialCommunication")}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-[13px] leading-relaxed text-text1 whitespace-pre-line">
            {accepted ? t("universityStrings.requestAccepted") : t("universityStrings.requestRejected")}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wider bg-highlights1 text-mainbgdark hover:bg-highlights1light transition-colors"
          >
            {t("universityStrings.closeBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
