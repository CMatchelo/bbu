import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { inGame as inGameEN } from "./en/inGame";
import { mainMenu as mainMenuEN } from "./en/mainMenu";
import { universityStrings as universityStringsEN } from "./en/university";

import { inGame as inGamePT } from "./pt/inGame";
import { mainMenu as mainMenuPT } from "./pt/mainMenu";
import { universityStrings as universityStringsPT } from "./pt/university";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        inGame: inGameEN,
        mainMenu: mainMenuEN,
        universityStrings: universityStringsEN
      },
    },
    pt: {
      translation: {
        inGame: inGamePT,
        mainMenu: mainMenuPT,
        universityStrings: universityStringsPT
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
