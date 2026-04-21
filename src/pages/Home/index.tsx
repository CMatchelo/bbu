import { useEffect, useState } from "react";
import NewGame from "./Components/newGame";
import { LoadGame } from "./Components/loadGame";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";

export default function MainScreen() {
  const [savesIds, setSavesId] = useState<string[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadGame = async () => {
      const folders = await window.api.loadFolders();
      setSavesId(folders);
    };
    loadGame();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/team");
    }
  }, [user, navigate]);

  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);

  const openNewScreen = () => {
    setIsLoad(false);
    setIsNew(true);
  };

  const openLoadScreen = () => {
    setIsLoad(true);
    setIsNew(false);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: "url('/mainMenuBg.png')" }}
    >
      <div className="absolute inset-0 bg-mainbg/50 backdrop-blur-sm" />

      <div className="relative flex items-center justify-center min-h-screen">
        <div className="bg-cardbg p-8 rounded-2xl shadow-xl w-[320px] flex flex-col gap-4">
          <button onClick={openNewScreen} className="btn-primary">
            New game
          </button>
          <button onClick={openLoadScreen} className="btn-secondary">
            Load game
          </button>

          {!isLoad && isNew && <NewGame />}
          {isLoad && !isNew && <LoadGame saveIds={savesIds} />}
        </div>
      </div>
    </div>
  );
}
