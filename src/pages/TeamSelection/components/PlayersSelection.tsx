import { playerAverage } from "../../../game/skillsAverage";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { selectUniversitiesWithPlayers } from "../../../selectors/data.selectors";
import { RootState } from "../../../store";
import { setStarters } from "../../../store/slices/gameSettingsSlice";
import { Player } from "../../../types/Player";

export const PlayerSelection = () => {

  const user = useAuthUser()
  const dispatch = useAppDispatch();
  const universities = useAppSelector(selectUniversitiesWithPlayers);

  const starters = useAppSelector(
    (state: RootState) => state.gameSettings.starters
  );

  const university = universities.find(
    (u) => u.id === user.currentUniversity.id
  );

  const players =
    university?.players
      ?.slice()
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

  return (
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
              className={`
                  px-3 py-2 rounded border transition
                  grid grid-cols-9
                  ${
                    isStarter
                      ? "bg-highlights1 text-black border-highlights1dark"
                      : "bg-cardbglight border-highlights2 hover:bg-cardbglight/70"
                  }`}
            >
              <div className="col-span-1">({p.inCourtPosition})</div>
              <div className="col-span-7">
                {p.firstName} {p.lastName}
              </div>
              <div className="col-span-1">{playerAverage(p)}</div>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-sm text-gray-400">
        Titulares selecionados: {starters.length}/5
      </p>
    </div>
  );
};
