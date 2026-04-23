type TableCardProps = {
  title: string;
  badge?: string;
  children: React.ReactNode;
};

export const TableCard = ({ title, badge, children }: TableCardProps) => {
  return (
    <div className="rounded-xl border border-highlights1/20 bg-mainbg">
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-cardbg border-b border-highlights1/25 rounded-t-lg">
        <div className="w-1.5 h-1.5 rounded-full bg-highlights1 shrink-0" />
        <span className="text-[13px] font-medium tracking-widest uppercase text-text2">
          {title}
        </span>
        {badge && (
          <span className="ml-auto text-[11px] font-medium text-highlights1 bg-highlights1/10 border border-highlights1/30 rounded-full px-3 py-0.5">
            {badge}
          </span>
        )}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
};
