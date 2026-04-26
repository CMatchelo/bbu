interface TableHeadProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  accent?: boolean;
  className?: string;
  onClick?: () => void;
}

export function TableHead({
  children,
  align = "center",
  accent = false,
  className = "",
  onClick
}: TableHeadProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <div
      className={`table-cell py-2.5 px-2 text-[10px] font-medium tracking-widest uppercase border-b border-highlights1/15 whitespace-nowrap ${alignClass} ${
        accent ? "text-highlights1" : "text-text2"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
