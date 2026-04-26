import { CSSProperties } from "react";

// components/TableRow.tsx
interface TableRowProps {
  index: number;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function TableRow({ index, children, style, className }: TableRowProps) {
  return (
    <div
      className={`${className} table-row border-b border-white/4 hover:bg-highlights1/5 transition-colors ${
        index % 2 === 0 ? "bg-white/[0.018]" : ""
      }`}
      style={style}
    >
      {children}
    </div>
  );
}