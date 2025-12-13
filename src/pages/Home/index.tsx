import { useEffect, useState } from "react";
import NewGame from "./Components.tsx/newGame";
import { LoadGame } from "./Components.tsx/loadGame";

export default function MainScreen() {
  const [savesIds, setSavesId] = useState<string[]>([]);

  useEffect(() => {
    const loadGame = async () => {
      const folders = await window.api.loadFolders();
      setSavesId(folders);
    };
    loadGame();
  }, []);

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
