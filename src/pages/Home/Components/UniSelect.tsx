import { useState } from "react";
import { University } from "../../../types/University";
import { Icons } from "../../../utils/icons";

interface UniSelectProps {
  grouped: Record<string, University[]>;
  selectedUniId: string | null;
  onSelect: (id: string) => void;
  disabled: boolean;
  t: (key: string) => string;
}

export const UniSelect = ({
  grouped,
  selectedUniId,
  onSelect,
  disabled,
  t,
}: UniSelectProps) => {
  const [open, setOpen] = useState(false);

  const allUnis = Object.values(grouped).flat();
  const selected = allUnis.find((u) => u.id === selectedUniId) ?? null;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="
          w-full flex items-center justify-between gap-2
          bg-mainbgdark border border-cardbglight rounded-lg
          px-3 py-2.5 text-[13px] font-medium
          hover:border-highlights1/40 transition-colors duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        <span className={selected ? "text-text1" : "text-text2/40"}>
          {selected
            ? `${selected.name} — ${selected.nickname}`
            : "— selecionar —"}
        </span>
        {Icons.IconArrowDown}
      </button>

      {open && (
        <div
          className="
            fixed z-500 mt-1 w-1/3
            bg-cardbgdark border border-cardbglight/60 rounded-xl
            shadow-2xl shadow-black/50 overflow-hidden
          "
        >
          <ul
            className="
              max-h-64 overflow-y-auto py-1
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-mainbgdark
              [&::-webkit-scrollbar-thumb]:bg-cardbglight
              [&::-webkit-scrollbar-thumb]:rounded-full
            "
          >
            {Object.entries(grouped).map(([leagueId, unis]) => (
              <li key={leagueId}>
                {/* League divider */}
                <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
                  <span className="h-px flex-1 bg-cardbglight/60" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-highlights1/60">
                    {t(`championshipLocale.${leagueId}`)}
                  </span>
                  <span className="h-px flex-1 bg-cardbglight/60" />
                </div>

                {unis.map((uni) => {
                  const isSelected = uni.id === selectedUniId;
                  return (
                    <button
                      key={uni.id}
                      type="button"
                      onClick={() => {
                        onSelect(uni.id);
                        setOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between gap-3
                        px-3 py-2 text-[13px] text-left
                        transition-colors duration-100 cursor-pointer
                        ${
                          isSelected
                            ? "bg-highlights1/10 text-highlights1 font-semibold"
                            : "text-text1 hover:bg-cardbglight/30"
                        }
                      `}
                    >
                      <span>{uni.name}</span>
                      <span className="text-xs text-text2">{uni.nickname}</span>
                    </button>
                  );
                })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
