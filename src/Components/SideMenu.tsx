import { Link } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import { Icons } from "../utils/icons";
import { useHsTick } from "../game/useHsTick";
import { useSimulateToWeek35 } from "../game/useSimulateToWeek35";

interface NavItemProps {
  goTo: string;
  text: string;
  icon: React.ReactNode;
}

const NavItem = ({ goTo, text, icon }: NavItemProps) => {
  const isActive = location.pathname === goTo;

  return (
    <Link
      to={goTo}
      className={`flex items-center gap-2.5 px-[18px] py-2 text-[13px] border-l-2 transition-all duration-150 ${
        isActive
          ? "bg-highlights2/10 text-highlights1 border-highlights2 font-medium"
          : "text-text2 border-transparent hover:bg-highlights2/6 hover:text-text1 hover:border-highlights2/30"
      }`}
    >
      <span
        className={`w-3.5 h-3.5 shrink-0 ${isActive ? "opacity-100" : "opacity-50"}`}
      >
        {icon}
      </span>
      {text}
    </Link>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="px-[18px] pt-3.5 pb-1.5 text-[9px] font-medium tracking-[0.12em] uppercase text-text2 opacity-70">
    {children}
  </p>
);

const Divider = () => <div className="h-px bg-highlights1/12 my-1.5" />;

export const SideMenu = () => {
  const { loadUser, user } = useUser();
  const { t, i18n } = useTranslation();
  const runHsTick = useHsTick();
  const simulateToWeek35 = useSimulateToWeek35();

  return (
    <div className="flex flex-col bg-mainbg border-r border-highlights1/15 h-full w-[220px] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-[18px] py-5 bg-mainbgdark border-b border-highlights1/20">
        <div className="w-7 h-7 rounded-full bg-highlights2 flex items-center justify-center text-sm shrink-0">
          🏀
        </div>
        <div>
          <p className="text-[13px] font-medium text-text1 tracking-widest uppercase">
            BBU
          </p>
          <p className="text-[10px] text-highlights1 tracking-wider">
            {t("generalLocale.season")} {user?.currentSeason}
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-highlights1/20">
        {/* Team */}
        <SectionLabel>{t("mainMenu.sections.team", "Time")}</SectionLabel>
        <NavItem goTo="/team" text={t("mainMenu.team")} icon={Icons.roster} />
        <NavItem
          goTo="/practice"
          text={t("mainMenu.practice")}
          icon={Icons.practice}
        />
        <NavItem
          goTo="/medicalDept"
          text={t("mainMenu.medicalDept")}
          icon={Icons.medical}
        />
        <NavItem
          goTo="/calendar"
          text={t("mainMenu.calendar")}
          icon={Icons.calendar}
        />

        <Divider />
        {/* Draft */}
        <SectionLabel>
          {t("mainMenu.sections.recruiting", "Recrutamento")}
        </SectionLabel>
        <NavItem goTo="/scouting" text={t("mainMenu.scouts")} icon={Icons.scouts} />
        <NavItem
          goTo="/recruitingBoard"
          text={t("mainMenu.recruitingBoard")}
          icon={Icons.board}
        />
        <NavItem
          goTo="/commitments"
          text={t("mainMenu.commitments")}
          icon={Icons.commitments}
        />

        <Divider />
        {/* League */}
        <SectionLabel>{t("mainMenu.sections.league", "Liga")}</SectionLabel>
        <NavItem goTo="/stats" text={t("mainMenu.stats")} icon={Icons.stats} />
        <NavItem
          goTo="/leagues"
          text={t("mainMenu.leagues")}
          icon={Icons.leagues}
        />
        <NavItem
          goTo="/playoffs"
          text={t("mainMenu.playoffs")}
          icon={Icons.playoffs}
        />
        <NavItem
          goTo="/champions"
          text={t("mainMenu.champions")}
          icon={Icons.champions}
        />
        <NavItem goTo="/leaguesInjuries" text={t("mainMenu.leaguesInjuries")} icon={Icons.news} />

        <Divider />
        {/* DEV */}
        <SectionLabel>DEV</SectionLabel>
        <button
          onClick={runHsTick}
          className="flex items-center gap-2.5 px-[18px] py-2 text-[13px] w-full text-left text-yellow-400/80 border-l-2 border-transparent hover:bg-yellow-400/6 hover:border-yellow-400/30 transition-all duration-150"
        >
          ⚡ HS Tick
        </button>
        <button
          onClick={simulateToWeek35}
          className="flex items-center gap-2.5 px-[18px] py-2 text-[13px] w-full text-left text-yellow-400/80 border-l-2 border-transparent hover:bg-yellow-400/6 hover:border-yellow-400/30 transition-all duration-150"
        >
          ⚡ Sim to W35
        </button>

        <Divider />
        {/* University */}
        <SectionLabel>{t("mainMenu.sections.club", "Clube")}</SectionLabel>
        <NavItem
          goTo="/team"
          text={t("mainMenu.facilities")}
          icon={Icons.facilities}
        />
        <NavItem
          goTo="/university"
          text={t("mainMenu.university")}
          icon={Icons.university}
        />
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-highlights1/12 bg-mainbgdark flex flex-col gap-1.5">
        <button
          onClick={() => loadUser(null)}
          className="flex items-center gap-2 w-full px-2.5 py-1.5 text-[12px] text-text2 bg-transparent border border-white/8 rounded-md hover:bg-red-500/8 hover:text-red-300 hover:border-red-400/20 transition-all"
        >
          <span className="w-3.5 h-3.5 shrink-0">{Icons.logout}</span>
          Sair
        </button>

        <div className="flex gap-1.5">
          {(["pt", "en"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`flex-1 py-1 text-[11px] font-medium tracking-wider border rounded-md transition-all ${
                i18n.language === lang
                  ? "text-highlights1 bg-highlights1/10 border-highlights1/30"
                  : "text-text2 bg-transparent border-white/8 hover:text-text1 hover:border-white/20"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
