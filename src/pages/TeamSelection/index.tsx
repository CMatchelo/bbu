/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector, useDispatch } from "react-redux";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  AttackType,
  setAttackPreferences,
  setStarters,
} from "../../store/slices/gameSettingsSlice";
import { RootState } from "../../store";
import { Player } from "../../types/Player";

const attackOptions = [
  { label: "Three Points", value: "threept" },
  { label: "Two Points", value: "twopt" },
  { label: "Layup", value: "layup" },
];

export default function TeamSelection() {
  const dispatch = useDispatch();
  const { user } = useUser();
  const navigate = useNavigate();

  const universities = useSelector(
    (state: RootState) => state.data.universities
  );

  const attackPreferences = useSelector(
    (state: any) => state.gameSettings.attackPreferences
  );

  const starters = useSelector((state: any) => state.gameSettings.starters);

  if (!user) {
    navigate("/");
    return null; // prevent render
  }

  const university = universities.find(
    (u) => u.id === user.currentUniversity.id
  );

  const players = university?.players ?? [];

  // selecionar starters
  const toggleStarter = (player: Player) => {
    let newStarters = [...starters];

    if (newStarters.includes(player)) {
      newStarters = newStarters.filter((p) => p.id !== player.id);
    } else {
      if (newStarters.length < 5) newStarters.push(player);
    }

    dispatch(setStarters(newStarters));
  };

  const updateAttackPref = (index: number, newValue: string) => {
    const updated = [...attackPreferences];
    updated[index] = newValue as any;

    // garantir que não repita
    const unique = Array.from(new Set(updated));

    if (unique.length === 3) {
      dispatch(setAttackPreferences(updated as any));
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-cardbg p-4 rounded-lg shadow">
        <h2 className="text-xl mb-3 text-highlights1 font-bold">
          Ordem de Ataque
        </h2>

        <div className="space-y-3">
          {attackPreferences.map((atk: AttackType, idx: number) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-32 font-semibold">
                {idx + 1}ª preferência:
              </span>
              <select
                value={atk}
                onChange={(e) => updateAttackPref(idx, e.target.value)}
                className="bg-cardbglight border border-highlights2 rounded p-2"
              >
                {attackOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Selecionar titulares */}
      <div className="bg-cardbg p-4 rounded-lg shadow">
        <h2 className="text-xl mb-3 text-highlights1 font-bold">
          Selecionar Titulares
        </h2>

        <p className="mb-2 text-gray-400">Escolha até 5 titulares:</p>

        <div className="grid grid-cols-2 gap-2">
          {players.map((p: Player) => {
            const isStarter = starters.includes(p);
            return (
              <button
                key={p.id}
                onClick={() => toggleStarter(p)}
                className={`px-3 py-2 rounded border transition
                  ${
                    isStarter
                      ? "bg-highlights1 text-black border-highlights1dark"
                      : "bg-cardbglight border-highlights2 hover:bg-cardbglight/70"
                  }`}
              >
                {p.firstName} {p.lastName} ({p.inCourtPosition})
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-sm text-gray-400">
          Titulares selecionados: {starters.length}/5
        </p>
      </div>
      <button onClick={() => console.log(starters)}>
        Ver titulares
      </button>
    </div>
  );
}
