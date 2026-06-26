import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import { ParentSecion } from "../../Components/ParentSection";
import { FaqSection, FaqSectionProps } from "./components/FaqSection";
import { ConfigCard } from "./components/ConfigCard";
import { useAudio } from "../../Context/AudioContext";

export default function ConfigsPage() {
  const { t, i18n } = useTranslation();
  const { isAudioOn, setAudioOn } = useAudio();

  const faqSections: FaqSectionProps[] = [
    {
      title: t("configLocale.faqTeamTitle"),
      items: [
        t("configLocale.faqTeamRoster"),
        t("configLocale.faqTeamTryouts"),
      ],
    },
    {
      title: t("configLocale.faqEducationTitle"),
      items: [
        t("configLocale.faqEducationGrades"),
        t("configLocale.faqEducationTutors"),
        t("configLocale.faqEducationTutoringEffect"),
        t("configLocale.faqEducationGraduate"),
      ],
    },
    {
      title: t("configLocale.faqDevTitle"),
      items: [
        t("configLocale.faqDevGeneral"),
        t("configLocale.faqDevSkill"),
        t("configLocale.faqDevStats"),
      ],
    },
    {
      title: t("configLocale.faqSystemTitle"),
      items: [
        t("configLocale.faqSystemFocus"),
        t("configLocale.faqSystemFamiliarity"),
      ],
    },
    {
      title: t("configLocale.faqScoutingTitle"),
      items: [
        t("configLocale.faqScoutingSlots"),
        t("configLocale.faqScoutingTutors"),
        t("configLocale.faqScoutingTutoringEffect"),
        t("configLocale.faqScoutingKnowledge"),
        t("configLocale.faqScoutingLetter"),
        t("configLocale.faqScoutingBoard"),
        t("configLocale.faqScoutingCommitted"),
      ],
    },
    {
      title: t("configLocale.faqLeagueTitle"),
      items: [
        t("configLocale.faqLeagueDivisions"),
        t("configLocale.faqLeagueQualifiers"),
        t("configLocale.faqLeagueSpots"),
        t("configLocale.faqLeagueSeeding"),
        t("configLocale.faqLeagueRounds"),
      ],
    },
    {
      title: t("configLocale.faqInGameTitle"),
      items: [
        t("configLocale.faqInGamePlayOrder"),
        t("configLocale.faqInGamePossession"),
        t("configLocale.faqInGamePlayEffect"),
        t("configLocale.faqInGameTimeouts"),
        t("configLocale.faqInGameSubstitutions"),
      ],
    },
    {
      title: t("configLocale.faqUniversityTitle"),
      items: [
        t("configLocale.faqUniversityCourt"),
        t("configLocale.faqUniversityGym"),
        t("configLocale.faqUniversityMedical"),
        t("configLocale.faqUniversityPhysio"),
        t("configLocale.faqUniversityEducation"),
        t("configLocale.faqUniversityPrestige"),
        t("configLocale.faqUniversityImprove"),
        t("configLocale.faqUniversityReputation"),
      ],
    },
  ];

  return (
    <ParentSecion className="px-4 pb-10">
      <div className="absolute inset-0 overflow-y-auto">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full py-4 px-4">
        {/* Header */}
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-text2">
            {t("configLocale.config")}
          </span>
        </div>

        {/* Language + Audio — side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Language */}
          <ConfigCard title="Language / Idioma">
            {(["en", "pt"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`flex-1 py-1.5 text-[12px] font-medium tracking-wider border rounded-lg transition-all ${
                  i18n.language === lang
                    ? "text-highlights1 bg-highlights1/10 border-highlights1/30"
                    : "text-text2 bg-transparent border-white/10 hover:text-text1 hover:border-white/20"
                }`}
              >
                {lang === "en" ? "English" : "Português"}
              </button>
            ))}
          </ConfigCard>

          {/* Audio */}
          <ConfigCard title={t("configLocale.audio")}>
            {(["on", "off"] as const).map((val) => (
              <button
                key={val}
                onClick={() => setAudioOn(val === "on")}
                className={`flex-1 py-1.5 text-[12px] font-medium tracking-wider border rounded-lg transition-all ${
                  (val === "on") === isAudioOn
                    ? "text-highlights1 bg-highlights1/10 border-highlights1/30"
                    : "text-text2 bg-transparent border-white/10 hover:text-text1 hover:border-white/20"
                }`}
              >
                {val === "on"
                  ? t("configLocale.audioOn")
                  : t("configLocale.audioOff")}
              </button>
            ))}
          </ConfigCard>
        </div>

        {/* Credits — full width */}
        <ConfigCard title={t("configLocale.credits")} classname="flex-col">
          {/* Creator */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] text-text2 shrink-0">
              {t("configLocale.creatorDeveloper")}
            </span>
            <span className="text-[13px] font-medium text-text1">
              Cicero Leite
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] text-text2 shrink-0">
              {t("configLocale.visitWebsite")}
            </span>
            <span className="text-[13px] font-medium text-highlights1">
              ciceromll.dev.br
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-highlights1/15 my-1" />

          {/* Music */}
          <p className="text-[11px] font-medium tracking-widest uppercase text-text2">
            {t("configLocale.music")}
          </p>
          {(
            [
              { file: "menu01_song01.mp3", artist: "Mykola Sosin", source: "Pixabay" },
              { file: "menu02_song02.mp3", artist: "Mykola Sosin", source: "Pixabay" },
              { file: "menu03_song03.mp3", artist: "Mykola Sosin", source: "Pixabay" },
            ] as const
          ).map(({ file, artist, source }) => (
            <div key={file} className="flex items-center justify-between gap-4">
              <span className="text-[12px] font-mono text-text2">{file}</span>
              <span className="text-[12px] text-text1">{artist} — {source}</span>
            </div>
          ))}

          {/* Sound Effects */}
          <p className="text-[11px] font-medium tracking-widest uppercase text-text2 mt-1">
            {t("configLocale.soundEffects")}
          </p>
          {(
            [
              { file: "click01.wav", artist: "Jaszunio15", source: "Freesound", license: "CC0" },
              { file: "inGame02_crowd01.m4a", artist: "egg_leg420", source: "Freesound", license: "CC0" },
              { file: "inGame03_crowd02.m4a", artist: "True_Killian", source: "Freesound", license: "CC0" },
              { file: "inGame04_crowd03.m4a", artist: "True_Killian", source: "Freesound", license: "CC0" },
            ] as const
          ).map(({ file, artist, source, license }) => (
            <div key={file} className="flex items-center justify-between gap-4">
              <span className="text-[12px] font-mono text-text2">{file}</span>
              <span className="text-[12px] text-text1">{artist} — {source} — {license}</span>
            </div>
          ))}
        </ConfigCard>

        {/* FAQ */}
        <div className="flex flex-col gap-2 ove">
          <p className="text-[11px] font-medium tracking-widest uppercase text-text2 px-1">
            {t("configLocale.faq")}
          </p>
          {faqSections.map((section) => (
            <FaqSection
              key={section.title}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>
      </div>
      </div>
    </ParentSecion>
  );
}
