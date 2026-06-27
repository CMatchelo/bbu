import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MatchNews } from "../../../types/MatchNews";
import { University } from "../../../types/University";
import { Player } from "../../../types/Player";
import {
  getNewsTitle,
  getNewsSubtitle,
  getNewsMatchText,
  getNewsPlayerTexts,
} from "../../../utils/newsContent";

interface NewsPopupProps {
  item: MatchNews | null;
  universities: University[];
  players: Player[];
  onClose: () => void;
}

export function NewsPopup({ item, universities, players, onClose }: NewsPopupProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const homeTeam = universities.find((u) => u.id === item.homeTeamId);
  const awayTeam = universities.find((u) => u.id === item.awayTeamId);
  const homeWon = item.winnerTeamId === item.homeTeamId;

  const title = getNewsTitle(item, lang, universities);
  const subtitle = getNewsSubtitle(item, lang, universities);
  const matchText = getNewsMatchText(item, lang, universities);
  const playerTexts = getNewsPlayerTexts(item, lang, players);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl mx-4 rounded-xl border border-highlights1/20 bg-mainbgdark shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-highlights1/20 bg-highlights1/8 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-highlights1" />
            <span className="text-[11px] font-medium tracking-widest uppercase text-text2">
              {t("newsLocale.matchReport")}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 pt-5 pb-4 flex flex-col gap-4">

          {/* Score */}
          <div className="flex items-center justify-center gap-4 pb-3 border-b border-highlights1/10">
            <div className={`flex-1 text-right ${homeWon ? "text-highlights1" : "text-text2"}`}>
              <p className="text-[13px] font-semibold">{homeTeam?.nickname ?? "—"}</p>
              <p className={`text-3xl font-bold ${homeWon ? "text-highlights1" : "text-text1"}`}>
                {item.homeScore}
              </p>
            </div>
            <div className="text-[11px] text-text2 font-medium tracking-wider px-2">vs</div>
            <div className={`flex-1 text-left ${!homeWon ? "text-highlights1" : "text-text2"}`}>
              <p className="text-[13px] font-semibold">{awayTeam?.nickname ?? "—"}</p>
              <p className={`text-3xl font-bold ${!homeWon ? "text-highlights1" : "text-text1"}`}>
                {item.awayScore}
              </p>
            </div>
          </div>

          {/* Title & subtitle */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-semibold text-text1 leading-snug">{title}</h2>
            <p className="text-[12px] text-highlights1">{subtitle}</p>
          </div>

          {/* Match narrative */}
          <p className="text-[12px] text-text2 leading-relaxed">{matchText}</p>

          {/* Player highlights */}
          <div className="flex flex-col gap-2 pt-2 border-t border-highlights1/10">
            <p className="text-[9px] font-medium tracking-[0.12em] uppercase text-text2 opacity-70">
              {t("newsLocale.statLeaders")}
            </p>
            {[
              { text: playerTexts.points },
              { text: playerTexts.rebounds },
              { text: playerTexts.assists },
              { text: playerTexts.steals },
            ].map(({ text }, i) => (
              <p key={i} className="text-[12px] text-text2 leading-relaxed">{text}</p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wider bg-highlights1 text-mainbgdark hover:bg-highlights1light transition-colors"
          >
            {t("newsLocale.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
