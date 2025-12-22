import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import { RootState } from "../../../store";
import { setAttackPreferences } from "../../../store/slices/gameSettingsSlice";
import { PlayType } from "../../../types/PlayType";

export const PlayTypeSelection = () => {
  const dispatch = useAppDispatch();

  const attackPreferences = useAppSelector(
    (state: RootState) => state.gameSettings.attackPreferences
  );

  const attackOptions = [
    { label: "Three Points", value: "THREE" },
    { label: "Two Points", value: "TWO" },
    { label: "Layup", value: "LAYUP" },
  ];

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
    <div className="bg-cardbg p-4 rounded-lg shadow w-full">
      <h2 className="text-xl mb-3 text-highlights1 font-bold">
        Ordem de Ataque
      </h2>

      <div className="space-y-3">
        {attackPreferences.map((atk: PlayType, idx: number) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="w-32 font-semibold">{idx + 1}ª preferência:</span>
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
  );
};
