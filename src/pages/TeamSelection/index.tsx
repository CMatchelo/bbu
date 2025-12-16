import { useSelector } from "react-redux";
import {
  AttackType,
  setAttackPreferences,
  setStarters,
} from "../../store/slices/gameSettingsSlice";
import { RootState } from "../../store";
import { Player } from "../../types/Player";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { selectUniversitiesWithPlayers } from "../../selectors/data.selectors";

const attackOptions = [
  { label: "Three Points", value: "threept" },
  { label: "Two Points", value: "twopt" },
  { label: "Layup", value: "layup" },
];

export default function TeamSelection() {
  const dispatch = useAppDispatch();
  const user = useAuthUser();

  const universities = useSelector(selectUniversitiesWithPlayers);

  const attackPreferences = useSelector(
    (state: RootState) => state.gameSettings.attackPreferences
  );

  const starters = useSelector(
    (state: RootState) => state.gameSettings.starters
  );

  const university = universities.find((u) => u.id === user.currentUniversity.id);

  const players = university?.players?.slice()
    .sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition)) || [];

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

    const oldIndex = updated.indexOf(newValue as AttackType);

    if (oldIndex !== -1) {
      [updated[index], updated[oldIndex]] = [updated[oldIndex], updated[index]];
    } else {
      updated[index] = newValue as AttackType;
    }
    dispatch(setAttackPreferences(updated as AttackType[]));
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
      <button onClick={() => console.log(attackPreferences)}>
        Ver titulares
      </button>
    </div>
  );
}
