import { useSelector } from "react-redux";
import { playerAverage } from "../../../game/skillsAverage";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { selectPlayersFromUniversity } from "../../../selectors/data.selectors";
import { RootState } from "../../../store";
import { setStarters } from "../../../store/slices/gameSettingsSlice";
import { Player } from "../../../types/Player";
import { Icons } from "../../../utils/icons";

export const PlayerSelection = () => {
  const user = useAuthUser();
  const dispatch = useAppDispatch();
  const starters = useAppSelector(
    (state: RootState) => state.gameSettings.starters,
  );

  const players = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, user.currentUniversity.id).sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition)),
  );

  const toggleStarter = (player: Player) => {
    let updated = [...starters];
    if (updated.find((p) => p.id === player.id)) {
      updated = updated.filter((p) => p.id !== player.id);
    } else if (updated.length < 5) {
      updated.push(player);
    }
    dispatch(setStarters(updated));
  };

  const count = starters.length;

  return (
    <div className="rounded-xl overflow-hidden border border-highlights1/15 bg-mainbg">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-cardbg border-b border-highlights1/25">
        <div className="w-1.5 h-1.5 rounded-full bg-highlights1 shrink-0" />
        <span className="text-[13px] font-medium tracking-widest uppercase text-text2">
          Selecionar Titulares
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < count ? "bg-highlights1" : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-text2">{count}/5</span>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2">
        {players.map((p: Player) => {
          const isStarter = !!starters.find((s) => s.id === p.id);
          const avg = playerAverage(p);
          return (
            <button
              key={p.id}
              disabled={p.injured || !p.available}
              onClick={() => toggleStarter(p)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-left transition-all
                ${
                  p.injured || !p.available
                    ? "cursor-not-allowed! bg-red-500/20"
                    : isStarter
                      ? "bg-highlights1/20 border-highlights1/40 text-highlights1"
                      : "bg-white/2 border-white/[0.07] text-text2 hover:bg-white/5 hover:text-text1 hover:border-white/15"
                } 
              `}
            >
              <span
                className={`text-[10px] font-medium border rounded px-1.5 py-0.5 tracking-wider shrink-0 ${
                  isStarter
                    ? "text-highlights1 bg-highlights1/15 border-highlights1/30"
                    : "text-highlights2 bg-highlights2/10 border-highlights2/25"
                }`}
              >
                {p.inCourtPosition}
              </span>

              <span className="text-[16px] flex-1 truncate">
                {p.firstName} {p.lastName}
              </span>
              {p.injured && Icons.MedicalSymbol}
              {!p.available && Icons.AcademicWarning}

              <span
                className={`text-[14px] shrink-0 ${
                  isStarter ? "text-highlights1" : "text-text2"
                }`}
              >
                {avg}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
