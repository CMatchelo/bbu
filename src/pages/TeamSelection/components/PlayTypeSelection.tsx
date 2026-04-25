import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import { RootState } from "../../../store";
import { setAttackPreferences } from "../../../store/slices/gameSettingsSlice";
import { PlayType } from "../../../types/PlayType";

const ATTACK_OPTIONS = [
  { label: "3 Pontos", value: "THREE" },
  { label: "2 Pontos", value: "TWO"   },
  { label: "Bandeja",  value: "LAYUP" },
] as const;

const ORDINALS = ["1ª", "2ª", "3ª"];

export const PlayTypeSelection = () => {
  const dispatch = useAppDispatch();
  const attackPreferences = useAppSelector(
    (state: RootState) => state.gameSettings.attackPreferences
  );

  const updateAttackPref = (index: number, newValue: string) => {
    const updated = [...attackPreferences];
    const oldIndex = updated.indexOf(newValue as PlayType);
    if (oldIndex !== -1) {
      [updated[index], updated[oldIndex]] = [updated[oldIndex], updated[index]];
    } else {
      updated[index] = newValue as PlayType;
    }
    dispatch(setAttackPreferences(updated as PlayType[]));
  };

  return (
    <div className="rounded-xl overflow-hidden border border-highlights1/15 bg-mainbg">
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-cardbg border-b border-highlights1/25">
        <div className="w-1.5 h-1.5 rounded-full bg-highlights1 shrink-0" />
        <span className="text-[13px] font-medium tracking-widest uppercase text-text2">
          Ordem de Ataque
        </span>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        {attackPreferences.map((atk: PlayType, idx: number) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="text-[11px] font-medium tracking-wider text-text2 w-10">
              {ORDINALS[idx]}
            </span>

            <div className="flex gap-2">
              {ATTACK_OPTIONS.map((opt) => {
                const active = atk === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => updateAttackPref(idx, opt.value)}
                    className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium border transition-all ${
                      active
                        ? "bg-highlights1/15 text-highlights1 border-highlights1/40"
                        : "bg-white/3 text-text2 border-white/8 hover:bg-white/[0.07] hover:text-text1"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};