export function StatRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-highlights1/8 last:border-0">
      <span className="text-[11px] uppercase tracking-widest text-text2">{label}</span>
      <span
        className={`text-[13px] font-semibold tabular-nums ${accent ? "text-highlights1" : "text-text1"}`}
      >
        {value}
      </span>
    </div>
  );
}
