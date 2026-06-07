export function DashboardCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-cardbg/75 border border-highlights1/15 overflow-hidden flex flex-col ${className}`}
    >
      <div className="px-4 py-2.5 bg-cardbglight/75 border-b border-highlights1/15 shrink-0">
        <span className="text-[10px] font-medium tracking-widest uppercase text-text2">
          {title}
        </span>
      </div>
      <div className="px-4 py-3 flex-1">{children}</div>
    </div>
  );
}
