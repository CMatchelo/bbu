import { useTranslation } from "react-i18next";
import { Player } from "../../../types/Player";
import { PlayerBenchCard } from "./PlayerBenchCard";
import { COURT_SLOTS } from "./courtSlots";

interface PlayerBenchListProps {
  players: Player[];
  slotted: (Player | null)[];
  onAutoSelect: () => void;
}

export const PlayerBenchList = ({ players, slotted, onAutoSelect }: PlayerBenchListProps) => {
  const { t } = useTranslation();
  const count = slotted.filter(Boolean).length;

  return (
    <div className="rounded-xl border border-highlights1/15 bg-mainbg h-full flex flex-col">
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-cardbg border-b border-highlights1/25 shrink-0 rounded-t-lg">
        <div className="w-1.5 h-1.5 rounded-full bg-highlights1 shrink-0" />
        <span className="text-[13px] font-medium tracking-widest uppercase text-text2">
          {t("generalLocale.selectStarters")}{" "}
          <button
            onClick={onAutoSelect}
            className="rounded bg-cardbglight text-text1 cursor-pointer text-[9px]! py-1 px-2 hover:bg-cardbglight/50"
          >
            Selecionar automaticamente
          </button>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex gap-1">
            {COURT_SLOTS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  slotted[i] ? "bg-highlights1" : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-text2">{count}/5</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-4">
        <div className="grid grid-cols-12 auto-rows-fr gap-2 h-full">
          {players.map((player) => (
            <PlayerBenchCard
              key={player.id}
              player={player}
              isPlaced={slotted.some((s) => s?.id === player.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
