import { useState } from "react";
import { useUser } from "../../../Context/UserContext";
import {
  setCurrentWeek,
  setSchedule,
} from "../../../store/slices/scheduleSlice";
import { setPlayers, setUniversities } from "../../../store/slices/dataSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";

type LoadGameProps = {
  saveIds: string[];
};

export const LoadGame = ({ saveIds }: LoadGameProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loadUser } = useUser();
  const [chosenId, setChosenId] = useState<number | null>(null);

  const loadGame = async () => {
    if (chosenId == null || chosenId < 0) {
      console.log("Escolha um jogo para carregar");
      return;
    }

    const saveFolder = saveIds[chosenId];
    const userLoaded = await window.api.loadGame(saveFolder);

    if (!userLoaded) {
      console.log("Save bugado");
      return;
    }

    // Carregar universidades da pasta de save (com roster já populado)
    dispatch(setUniversities(Object.values(userLoaded.universities)));
    
    dispatch(setSchedule(userLoaded.schedule.matches));
    dispatch(setCurrentWeek(userLoaded.schedule.currentWeek));
    dispatch(setPlayers(userLoaded.players));

    loadUser(userLoaded.user);
    navigate("/team");
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <h2 className="text-text1 text-lg">
        Escolha um save
      </h2>

      {saveIds.map((save, i) => (
        <button
          key={save}
          onClick={() => setChosenId(i)}
          className={`text-left p-3 rounded-md transition
        ${
          chosenId === i
            ? "bg-highlights2 text-black"
            : "bg-cardbglight text-text1"
        }
      `}
        >
          {save.split("_")[0]}
        </button>
      ))}

      <button onClick={loadGame} className="btn-primary">
        Carregar
      </button>
    </div>
  );
};
