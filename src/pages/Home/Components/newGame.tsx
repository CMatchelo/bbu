import { useState } from "react";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types/User";
import { University } from "../../../types/University";
import { useUser } from "../../../Context/UserContext";
import { selectUniversitiesArray } from "../../../selectors/data.selectors";
import { GenerateSchedule } from "../../../utils/managerSchedule";

export default function NewGame() {
  const universities = useSelector(
    (state: RootState) => state.data.universitiesById
  );

  const universitiesArray = useSelector(selectUniversitiesArray);

  const { loadUser } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [uni, setUni] = useState<University | null>(null);

  const selectUni = (id: string) => {
    const selectedUni = Object.values(universities).find((u) => u.id === id);
    if (selectedUni) {
      setUni(selectedUni);
    }
  };

  const startGame = async () => {
    if (!uni || !name) return;
    const newUser: User = {
      id: crypto.randomUUID(),
      name: name,
      currentUniversity: uni,
      reputation: 50,
      currentSeason: 2025,
      isStartSeason: false,
    };
    await window.api.saveGame(newUser);
    const schedule = GenerateSchedule(universitiesArray)
    const newSchedule = {
      matches: schedule,
      currentRound: 1
    }
    const folderName = `${newUser.name}_${newUser.id}`
    await window.api.saveSchedule(folderName, newSchedule)
    loadUser(newUser);
    navigate("/team");
  };

  return (
    <div className="flex flex-col">
      <input
        className="bg-white w-40 text-black"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <span>Selecione uma universidade para treinar</span>
      <select onChange={(e) => selectUni(e.target.value)}>
        {Object.values(universities).map((uni) => (
          <option key={uni.id} value={uni.id}>
            {uni.name} {uni.nickname}
          </option>
        ))}
      </select>
      <button onClick={startGame}>Começar jogo</button>
    </div>
  );
}
