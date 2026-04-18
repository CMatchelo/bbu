import { useState } from "react";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types/User";
import { University } from "../../../types/University";
import { useUser } from "../../../Context/UserContext";
import { selectUniversitiesGrouped } from "../../../selectors/data.selectors";
import { generateLeagueSchedules } from "../../../utils/managerSchedule";
import { useTranslation } from "react-i18next";

export default function NewGame() {
  const universities = useSelector(
    (state: RootState) => state.data.universitiesById,
  );

  const grouped = useSelector(selectUniversitiesGrouped);

  const { loadUser } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [name, setName] = useState<string>("");
  const [uni, setUni] = useState<University | null>(null);

  const selectUni = (id: string) => {
    const selectedUni = Object.values(universities).find((u) => u.id === id);
    if (selectedUni) {
      setUni(selectedUni);
    }
  };

  const test = () => {
    const schedule = generateLeagueSchedules(
      Object.values(universities)
    );
    const newSchedule = {
      matches: schedule,
      currentWeek: 1,
    };
    console.log(newSchedule);
  };

  const startGame = async () => {
    console.log("0", name, uni)
    if (!uni || !name) return;
    console.log("1")
    const newUser: User = {
      id: crypto.randomUUID(),
      name: name,
      currentUniversity: uni,
      reputation: 50,
      currentSeason: 2025,
      isStartSeason: false,
    };
    console.log("2")
    await window.api.saveGame(newUser);
    const schedule = generateLeagueSchedules(Object.values(universities));
    const newSchedule = {
      matches: schedule,
      currentWeek: 1,
    };
    const folderName = `${newUser.name}_${newUser.id}`;
    await window.api.saveSchedule(folderName, newSchedule);
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
      <select
        className="bg-amber-950"
        onChange={(e) => selectUni(e.target.value)}
      >
        {Object.entries(grouped).map(([leagueId, unis]) => (
          <optgroup key={leagueId} label={t(`championshipLocale.${leagueId}`)}>
            {unis.map((uni) => (
              <option key={uni.id} value={uni.id}>
                {uni.name} {uni.nickname}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <button onClick={test}>Gerar tabelas</button>
      <button onClick={startGame}>Começar jogo</button>
    </div>
  );
}
