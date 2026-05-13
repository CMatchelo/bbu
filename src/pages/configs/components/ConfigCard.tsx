interface ConfigCardProps {
  title: string;
  children: React.ReactNode;
  classname?: string;
}

export function ConfigCard({ title, children, classname }: ConfigCardProps) {
  return (
    <div className="rounded-xl bg-cardbg/75 border border-highlights1/15 overflow-hidden flex flex-col">
      <div className="px-5 py-3 bg-cardbglight/75 border-b border-highlights1/15">
        <span className="text-[11px] font-medium tracking-widest uppercase text-text2">
          {title}
        </span>
      </div>
      <div className="px-5 py-4">
        <div className={`flex gap-2 ${classname}`}>{children}</div>
      </div>
    </div>
  );
}
