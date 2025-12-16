import { useEffect, useState } from "react";
import NewGame from "./Components.tsx/newGame";
import { LoadGame } from "./Components.tsx/loadGame";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";

export default function MainScreen() {
  const [savesIds, setSavesId] = useState<string[]>([]);
  const { user } = useUser();
  const navigate = useNavigate()

  useEffect(() => {
    const loadGame = async () => {
      const folders = await window.api.loadFolders();
      setSavesId(folders);
    };
    loadGame();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/team")
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
    <div>
      <div className="flex flex-col">
        <button onClick={openNewScreen}>New game</button>
        <button onClick={openLoadScreen}>Load game</button>
      </div>
      {!isLoad && isNew && <NewGame />}
      {isLoad && !isNew && <LoadGame saveIds={savesIds} />}
    </div>
  );
}
