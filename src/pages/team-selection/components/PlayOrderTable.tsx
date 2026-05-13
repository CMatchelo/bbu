const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

interface PlayOrderTableProps<K extends string> {
  title: string;
  order: K[];
  labels: Record<string, string>;
  familiarity: Record<string, number>;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
}

export function PlayOrderTable<K extends string>({
  title,
  order,
  labels,
  familiarity,
  onMoveUp,
  onMoveDown,
}: PlayOrderTableProps<K>) {
  return (
    <div className="rounded-xl overflow-hidden border border-highlights1/15 bg-mainbg flex-1">
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-cardbg border-b border-highlights1/25">
        <div className="w-1.5 h-1.5 rounded-full bg-highlights1 shrink-0" />
        <span className="text-[13px] font-medium tracking-widest uppercase text-text2">
          {title}
        </span>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2">
        {order.map((key, idx) => {
          const fam = familiarity[key] ?? 50;
          return (
            <div key={key} className="flex items-center gap-2.5">
              <span className="text-[10px] text-text2 w-6 shrink-0">
                {ORDINALS[idx]}
              </span>

              <div className="flex-1 flex items-center gap-2 bg-white/3 border border-white/8 rounded-lg px-3 py-2">
                <span className="text-[12px] text-text1 flex-1">
                  {labels[key]}
                </span>
                <div className="flex items-center gap-1.5 w-20">
                  <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-highlights2 rounded-full"
                      style={{ width: `${fam}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-text2 w-5 text-right">
                    {fam}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => onMoveUp(idx)}
                  disabled={idx === 0}
                  className="w-5 h-5 flex items-center justify-center rounded text-text2 hover:text-text1 hover:bg-white/8 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-[10px]"
                >
                  ▲
                </button>
                <button
                  onClick={() => onMoveDown(idx)}
                  disabled={idx === order.length - 1}
                  className="w-5 h-5 flex items-center justify-center rounded text-text2 hover:text-text1 hover:bg-white/8 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-[10px]"
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
