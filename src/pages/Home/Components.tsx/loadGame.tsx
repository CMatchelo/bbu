import { useEffect, useState } from "react";
import { useUser } from "../../../Context/UserContext";
import { useNavigate } from "react-router-dom";

type LoadGameProps = {
  saveIds: string[];
};

export const LoadGame = ({ saveIds }: LoadGameProps) => {

  const navigate = useNavigate()
  const { loadUser } = useUser()
  const [chosenId, setChosenId] = useState<number | null>(null)

  useEffect(() => {
    console.log(chosenId)
  }, [chosenId])

  const loadGame = async () => {
    if (chosenId == null || chosenId < 0) {
      console.log("Escolha um jogo para carregar")
      return
    }
    const userLoaded = await window.api.loadGame(saveIds[chosenId])
    if (!userLoaded) {
      console.log("Save bugado")
      return
    }
    loadUser(userLoaded);
    navigate("/team")
  }

  return (
  <div className="flex flex-col">
    <h2> Escolha um save para carregar</h2>
    {saveIds.map((save, i) => (
      <button className="p-2 bg-amber-950" key={save} onClick={() => setChosenId(i)}>{save.split("_")[0]}</button>
    ))}
    <button onClick={loadGame}>Carregar</button>
  </div>
);
};
