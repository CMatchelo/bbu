import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { inGame as inGameEN } from "./en/inGame";
import { mainMenu as mainMenuEN } from "./en/mainMenu";
import { universityStrings as universityStringsEN } from "./en/university";
import { championshipLocale as championshipLocaleEN } from "./en/championship";
import { generalLocale as generalLocaleEN } from "./en/generalLocale";
import { courseLocale as courseLocaleEN } from "./en/coursesLocale";
import { systemGeneral as systemGeneralEN } from "./en/systemGeneral";

import { inGame as inGamePT } from "./pt/inGame";
import { mainMenu as mainMenuPT } from "./pt/mainMenu";
import { universityStrings as universityStringsPT } from "./pt/university";
import { championshipLocale as championshipLocalePT } from "./pt/championship";
import { generalLocale as generalLocalePT } from "./pt/generalLocale";
import { courseLocale as courseLocalePT } from "./pt/coursesLocale";
import { systemGeneral as systemGeneralPT } from "./pt/systemGeneral";


i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        inGame: inGameEN,
        mainMenu: mainMenuEN,
        universityStrings: universityStringsEN,
        championshipLocale: championshipLocaleEN,
        generalLocale: generalLocaleEN,
        courseLocale: courseLocaleEN,
        systemGeneral: systemGeneralEN,
      },
    },
    pt: {
      translation: {
        inGame: inGamePT,
        mainMenu: mainMenuPT,
        universityStrings: universityStringsPT,
        championshipLocale: championshipLocalePT,
        generalLocale: generalLocalePT,
        courseLocale: courseLocalePT,
        systemGeneral: systemGeneralPT,
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
