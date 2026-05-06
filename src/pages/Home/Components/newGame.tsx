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
import { generateAllPlayers, generateHighSchoolPlayers } from "../../../utils/createPlayer";
import {
  setPlayers,
  setUniversities,
  setHighSchoolPlayers,
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
import { UniCard } from "./uniCard";
import { UniSelect } from "./UniSelect";

/* ── Difficulty config ────────────────────────────────────────────────────── */
type Difficulty = 1 | 2 | 3;

const DIFFICULTIES: {
  key: Difficulty;
  label: string;
  description: string;
  activeClasses: string;
  dotColor: string;
}[] = [
  {
    key: 1,
    label: "easy",
    description: "easyDesc",
    activeClasses: "bg-highlights1/10 border-highlights1/40",
    dotColor: "bg-highlights1",
  },
  {
    key: 2,
    label: "medium",
    description: "mediumDesc",
    activeClasses: "bg-highlights2/10 border-highlights2/40",
    dotColor: "bg-highlights2",
  },
  {
    key: 3,
    label: "hard",
    description: "hardDesc",
    activeClasses: "bg-red-500/10 border-red-500/40",
    dotColor: "bg-red-400",
  },
];

/* ── Section wrapper ─────────────────────────────────────────────────────── */
function Section({
  label,
  loading,
  children,
}: {
  label: string;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-cardbgdark border border-cardbglight/40 rounded-xl overflow-hidden shadow-lg">
      <div className="px-5 py-3 border-b border-cardbglight/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-0.5 bg-highlights1 rounded-full opacity-80" />
          <span className="text-xs font-bold uppercase tracking-widest text-highlights1 opacity-80">
            {label}
          </span>
        </div>
        {loading && (
          <span className="text-xs text-text2 animate-pulse">Carregando…</span>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

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
  const [difficulty, setDifficulty] = useState<Difficulty>(2);

  useMemo(() => {
    if (universities.length === 0) dispatch(loadUniversitiesFromFiles());
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
      if (!playersByUni[p.currentUniversity])
        playersByUni[p.currentUniversity] = [];
      playersByUni[p.currentUniversity].push(p.id);
    }
    return universities.map((uni) => ({
      ...uni,
      stats: { [2026]: createEmptyTeamSeasonStats(2026) },
      roster: playersByUni[uni.id] || [],
    }));
  };

  const createUser = (uni: University): User => ({
    id: crypto.randomUUID(),
    name,
    currentUniversity: uni,
    reputation: 50,
    currentSeason: 2026,
  });

  const startGame = async () => {
    if (!selectedUni || !name.trim()) return;
    try {
      const user = createUser(selectedUni);
      const folderName = `${user.name}_${user.id}`;
      const schedule = generateLeagueSchedules(universities);
      dispatch(setSchedule(schedule));
      dispatch(setCurrentWeek(1));

      const players = generateAllPlayers(
        universities,
        difficulty,
        selectedUni.id,
      );
      const universitiesWithRoster = buildUniversitiesWithRoster(players);
      const hsPlayers = generateHighSchoolPlayers();
      dispatch(setPlayers(players));
      dispatch(setHighSchoolPlayers(hsPlayers));

      await window.api.saveGame(user);
      await window.api.saveSchedule(folderName, {
        matches: schedule,
        currentWeek: 1,
      });
      await window.api.savePlayers(folderName, toRecord(players));
      await window.api.saveUniversities(
        folderName,
        toRecord(universitiesWithRoster),
      );
      await window.api.saveHighSchoolPlayers(folderName, toRecord(hsPlayers));

      dispatch(setUniversities(universitiesWithRoster));
      dispatch(setPlayers(toRecord(players)));

      loadUser(user);
      navigate("/team");
    } catch (err) {
      console.error("Erro ao iniciar jogo:", err);
    }
  };

  const canStart = !!name.trim() && !!selectedUni && !loading;

  return (
    <div className="flex flex-row gap-6 mt-2 min-w-[600px] items-start">
      <div className="flex flex-col gap-3 w-[600px] max-w-md">
        <Section label={t("generalLocale.manager")}>
          <input
            className="
              w-full bg-mainbgdark border border-cardbglight rounded-lg
              text-[13px] text-text1 font-medium
              px-3 py-2.5 placeholder-text2/30
              hover:border-highlights1/40 focus:border-highlights1/60 focus:outline-none
              transition-colors duration-150
            "
            placeholder={t("systemGeneral.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Section>

        <Section label={t("generalLocale.university")} loading={loading}>
          <UniSelect
            grouped={grouped}
            selectedUniId={selectedUniId}
            onSelect={setSelectedUniId}
            disabled={loading}
            t={t}
          />
        </Section>

        <Section label={t("systemGeneral.difficulty")}>
          <div className="flex flex-col min-w-1/2 gap-2">
            {DIFFICULTIES.map((d) => {
              const isSelected = difficulty === d.key;
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDifficulty(d.key)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-lg border
                    text-left transition-all duration-150 cursor-pointer
                    ${
                      isSelected
                        ? d.activeClasses
                        : "bg-mainbgdark border-cardbglight hover:border-cardbglight/80"
                    }
                  `}
                >
                  <span
                    className={`
                    w-2 h-2 rounded-full transition-colors duration-150
                    ${isSelected ? d.dotColor : "bg-cardbglight"}
                  `}
                  />

                  <div className="flex-1 flex flex-row gap-3 min-w-0 items-baseline">
                    <span
                      className={`text-sm font-semibold transition-colors duration-150 ${isSelected ? "text-text1" : "text-text2"}`}
                    >
                      {t(`systemGeneral.${d.label}`)}
                    </span>
                    <p className="text-xs text-text2 leading-relaxed truncate">
                      {t(`systemGeneral.${d.description}`)}
                    </p>
                  </div>

                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="size-3.5 text-text2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </Section>

        <button
          onClick={startGame}
          disabled={!canStart}
          className="
            flex items-center justify-center gap-2 w-full
            bg-highlights1 text-mainbgdark font-bold text-sm uppercase tracking-widest
            px-5 py-3 rounded-xl
            hover:bg-highlights1light active:bg-highlights1dark
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-colors duration-150 shadow-lg shadow-highlights1/20
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
            />
          </svg>
          Começar jogo
        </button>
      </div>
      {selectedUni && <UniCard university={selectedUni} />}
    </div>
  );
}
