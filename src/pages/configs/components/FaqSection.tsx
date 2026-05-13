import { useState } from "react";

export interface FaqSectionProps {
  title: string;
  items: string[];
}

export function FaqSection({ title, items }: FaqSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl bg-cardbg/75 border border-highlights1/15 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 bg-cardbglight/75 border-b border-highlights1/15 hover:bg-cardbglight transition-colors"
      >
        <span className="text-[11px] font-medium tracking-widest uppercase text-text2">
          {title}
        </span>
        <span className={`text-text2 text-[11px] transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {open && (
        <ul className="divide-y divide-highlights1/8">
          {items.map((item, i) => (
            <li key={i} className="px-5 py-3 text-[13px] text-text1 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}