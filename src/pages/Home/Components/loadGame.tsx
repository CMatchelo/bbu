import { useState } from "react";
import { useUser } from "../../../Context/UserContext";
import {
  setCurrentWeek,
  setSchedule,
} from "../../../store/slices/scheduleSlice";
import { setPlayers, setUniversities } from "../../../store/slices/dataSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../utils/icons";
import { useTranslation } from "react-i18next";

type LoadGameProps = {
  saveIds: string[];
};

export const LoadGame = ({ saveIds }: LoadGameProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loadUser } = useUser();
  const [chosenId, setChosenId] = useState<number | null>(null);
  const { t } = useTranslation()

  const loadGame = async () => {
    if (chosenId == null || chosenId < 0) {
      return;
    }

    const saveFolder = saveIds[chosenId];
    const userLoaded = await window.api.loadGame(saveFolder);

    if (!userLoaded) {
      console.log("Save bugado");
      return;
    }

    dispatch(setUniversities(Object.values(userLoaded.universities)));
    dispatch(setSchedule(userLoaded.schedule.matches));
    dispatch(setCurrentWeek(userLoaded.schedule.currentWeek));
    dispatch(setPlayers(userLoaded.players));

    loadUser(userLoaded.user);
    navigate("/team");
  };

  return (
    <div className="flex flex-col gap-4 mt-2 w-full min-w-[280px]">

      {saveIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-text2">
          <span className="text-xs">Nenhum save encontrado</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {saveIds.map((save, i) => {
            const isChosen = chosenId === i;
            return (
              <button
                key={save}
                onClick={() => setChosenId(i)}
                className={`
                  text-left px-4 py-3 rounded-xl border transition-all duration-150
                  flex items-center gap-3
                  ${isChosen
                    ? "bg-highlights2/15 border-highlights2/50 shadow-sm"
                    : "bg-cardbgdark border-cardbglight hover:border-cardbglight/80 hover:bg-cardbglight/30"
                  }
                `}
              >
                {/* Indicator dot */}
                <span className={`
                  w-2 h-2 rounded-full shrink-0 transition-colors duration-150
                  ${isChosen ? "bg-highlights2" : "bg-cardbglight"}
                `} />

                <div className="flex flex-col min-w-0">
                  <span className={`
                    text-sm font-semibold truncate transition-colors duration-150
                    ${isChosen ? "text-highlights2" : "text-text1"}
                  `}>
                    {save.split("_")[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={loadGame}
        disabled={chosenId === null}
        className="
          w-full py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-widest
          bg-highlights1 text-mainbgdark
          hover:bg-highlights1light
          active:bg-highlights1dark
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors duration-150 shadow-lg shadow-highlights1/20
          flex items-center justify-center gap-2
        "
      >
        {Icons.IconLoad}
        {t('systemGeneral.loadGame')}
      </button>
    </div>
  );
};
