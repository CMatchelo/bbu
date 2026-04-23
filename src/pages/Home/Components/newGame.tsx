import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types/User";
import { University } from "../../../types/University";
import { useUser } from "../../../Context/UserContext";
import {
  selectUniversitiesGrouped,
  selectAllUniversities,
} from "../../../selectors/data.selectors";
import { generateLeagueSchedules } from "../../../utils/managerSchedule";
import { useTranslation } from "react-i18next";
import { generateAllPlayers } from "../../../utils/createPlayer";
import {
  setPlayers,
  setUniversities,
  loadUniversitiesFromFiles,
} from "../../../store/slices/dataSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { RootState } from "../../../store";
import { toRecord } from "../../../utils/toRecord";
import {
  setCurrentWeek,
  setSchedule,
} from "../../../store/slices/scheduleSlice";
import { createEmptyTeamSeasonStats } from "../../../utils/createEmptySeasonStats";

export default function NewGame() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loadUser } = useUser();

  const grouped = useSelector(selectUniversitiesGrouped);
  const universities = useSelector(selectAllUniversities);

  const loading = useSelector((state: RootState) => state.data.loading);

  const [name, setName] = useState<string>("");
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);

  // Load universities from original files when component mounts (new game always uses originals)
  useMemo(() => {
    if (universities.length === 0) {
      dispatch(loadUniversitiesFromFiles());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedUni = useMemo(
    () => universities.find((u) => u.id === selectedUniId) ?? null,
    [selectedUniId, universities],
  );

  const buildUniversitiesWithRoster = (
    players: ReturnType<typeof generateAllPlayers>,
  ) => {
    const playersByUni: Record<string, string[]> = {};

    for (const p of players) {
      if (!playersByUni[p.currentUniversity]) {
        playersByUni[p.currentUniversity] = [];
      }
      playersByUni[p.currentUniversity].push(p.id);
    }

    return universities.map((uni) => ({
      ...uni,
      stats: {
        [2026]: createEmptyTeamSeasonStats(2026),
      },
      roster: playersByUni[uni.id] || [],
    }));
  };

  const createUser = (uni: University): User => ({
    id: crypto.randomUUID(),
    name,
    currentUniversity: uni,
    reputation: 50,
    currentSeason: 2026,
    isStartSeason: false,
  });

  const startGame = async () => {
    if (!selectedUni || !name.trim()) return;

    try {
      const user = createUser(selectedUni);
      const folderName = `${user.name}_${user.id}`;

      // schedule
      const schedule = generateLeagueSchedules(universities);
      const scheduleData = { matches: schedule, currentWeek: 1 };
      dispatch(setSchedule(schedule));

      // players + roster
      const players = generateAllPlayers(universities);
      const universitiesWithRoster = buildUniversitiesWithRoster(players);
      dispatch(setPlayers(players));

      dispatch(setCurrentWeek(1));

      // persist
      await window.api.saveGame(user);
      await window.api.saveSchedule(folderName, scheduleData);
      await window.api.savePlayers(folderName, toRecord(players));
      await window.api.saveUniversities(
        folderName,
        toRecord(universitiesWithRoster),
      );

      // redux — update stores with generated data
      dispatch(setUniversities(universitiesWithRoster));
      dispatch(setPlayers(toRecord(players)));

      // context + navigation
      loadUser(user);
      navigate("/team");
    } catch (err) {
      console.error("Erro ao iniciar jogo:", err);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <input
        className="bg-cardbglight text-text1 p-2 rounded-md outline-none focus:ring-2 focus:ring-highlights1"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <span className="text-text2 text-sm">Selecione uma universidade</span>

      {loading && <span className="text-sm">Carregando...</span>}

      <select
        className="bg-cardbglight text-text1 p-2 rounded-md"
        value={selectedUniId ?? ""}
        onChange={(e) => setSelectedUniId(e.target.value)}
        disabled={loading}
      >
        <option value="" disabled>
          -- selecionar --
        </option>

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

      <button
        onClick={startGame}
        disabled={!name || !selectedUni || loading}
        className="btn-primary disabled:opacity-50"
      >
        Começar jogo
      </button>
    </div>
  );
}
