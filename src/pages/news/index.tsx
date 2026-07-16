import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import { MatchNews } from "../../types/MatchNews";
import { selectAllUniversities, selectAllPlayers } from "../../selectors/data.selectors";
import { ParentSection } from "../../Components/ParentSection";
import { NewsPopup } from "./components/NewsPopup";
import { NewsPost } from "./components/NewsPost";

export default function NewsPage() {
  const { t } = useTranslation();
  const newsByWeek = useSelector((state: RootState) => state.news.newsByWeek);
  const currentWeek = useSelector((state: RootState) => state.schedule.currentWeek);
  const universities = useSelector(selectAllUniversities);
  const players = useSelector(selectAllPlayers);

  const weeksWithNews = Object.keys(newsByWeek)
    .map(Number)
    .sort((a, b) => b - a);

  const initialWeek = weeksWithNews.includes(currentWeek - 1)
    ? currentWeek - 1
    : weeksWithNews[0] ?? currentWeek - 1;

  const [selectedWeek, setSelectedWeek] = useState(initialWeek);
  const [openItem, setOpenItem] = useState<MatchNews | null>(null);

  const currentIndex = weeksWithNews.indexOf(selectedWeek);
  const hasPrev = currentIndex < weeksWithNews.length - 1;
  const hasNext = currentIndex > 0;

  const items: MatchNews[] = newsByWeek[selectedWeek] ?? [];

  return (
    <ParentSection>
      <div className="relative flex flex-col h-full">
        <NewsPopup
          item={openItem}
          universities={universities}
          players={players}
          onClose={() => setOpenItem(null)}
        />

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-highlights1/12">
          <div>
            <p className="text-[9px] font-medium tracking-[0.12em] uppercase text-text2 opacity-70">
              {t("mainMenu.news")}
            </p>
            <h1 className="text-[18px] font-semibold text-text1 mt-0.5">
              {t("newsLocale.weekNews", { week: selectedWeek })}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedWeek(weeksWithNews[currentIndex + 1])}
              disabled={!hasPrev}
              className="px-3 py-1.5 rounded-lg text-[11px] border border-highlights1/20 text-text2 hover:text-text1 hover:border-highlights1/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ‹
            </button>
            <span className="text-[12px] text-text1 font-medium min-w-[70px] text-center">
              {t("newsLocale.week")} {selectedWeek}
            </span>
            <button
              onClick={() => setSelectedWeek(weeksWithNews[currentIndex - 1])}
              disabled={!hasNext}
              className="px-3 py-1.5 rounded-lg text-[11px] border border-highlights1/20 text-text2 hover:text-text1 hover:border-highlights1/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ›
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-2 text-text2">
              <p className="text-[13px]">{t("newsLocale.noNews")}</p>
            </div>
          ) : (
            items.map((item) => (
              <NewsPost
                key={item.id}
                item={item}
                universities={universities}
                players={players}
                onReadMore={() => setOpenItem(item)}
              />
            ))
          )}
        </div>
      </div>
    </ParentSection>
  );
}
