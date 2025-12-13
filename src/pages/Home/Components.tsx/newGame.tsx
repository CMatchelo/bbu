import { useState } from "react";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types/User";
import { University } from "../../../types/University";
import { useUser } from "../../../Context/UserContext";

export default function NewGame() {
  const universities = useSelector(
    (state: RootState) => state.data.universities
  );

  const { login } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [uni, setUni] = useState<University | null>(null);

  const selectUni = (id: string) => {
    const selectedUni = universities.find((u) => u.id === id);
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
      isStartSeason: true,
    };
    await window.api.saveGame(newUser);
    login(newUser);
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
        {universities.map((uni) => (
          <option key={uni.id} value={uni.id}>
            {uni.name} {uni.nickname}
          </option>
        ))}
      </select>
      <button onClick={startGame}>Começar jogo</button>
    </div>
  );
}
