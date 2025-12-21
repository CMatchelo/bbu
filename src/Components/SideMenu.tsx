import { Link } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";

const MenuLink = ({ goTo, text }: { goTo: string; text: string }) => {
  return (
    <Link className="py-2 px-6 text-text1 hover:text-text2" to={goTo}>
      {text}
    </Link>
  );
};

export const SideMenu = () => {
  const { loadUser } = useUser();
  const { t } = useTranslation()

  const logout = () => {
    loadUser(null);
  };

  return (
    <div
      className="flex flex-col 
    bg-primary-1 bg-cardbg 
    h-full pt-10
    items-start"
    >
      <MenuLink goTo="/team" text={t("mainMenu.team")} />
      <MenuLink goTo="/" text={t("mainMenu.practice")} />
      <MenuLink goTo="/" text={t("mainMenu.medicalDept")} />
      <MenuLink goTo="/" text={t("mainMenu.stats")} />

      <MenuLink goTo="/" text={t("mainMenu.scouts")} />
      <MenuLink goTo="/" text={t("mainMenu.recruitingBoard")} />
      <MenuLink goTo="/" text={t("mainMenu.commitments")} />

      <MenuLink goTo="/calendar" text={t("mainMenu.calendar")} />
      <MenuLink goTo="/" text={t("mainMenu.leagues")} />
      <MenuLink goTo="/" text={t("mainMenu.champions")} />
      <MenuLink goTo="/" text={t("mainMenu.news")} />

      <MenuLink goTo="/" text={t("mainMenu.facilities")} />
      <MenuLink goTo="/university" text={t("mainMenu.university")} />
      <button onClick={logout}> Sair </button>
      <button onClick={() => changeLanguage("pt")}>PT</button>
      <button onClick={() => changeLanguage("en")}>EN</button>
    </div>
  );
};
