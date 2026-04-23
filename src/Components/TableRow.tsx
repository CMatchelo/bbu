// components/TableRow.tsx
interface TableRowProps {
  index: number;
  children: React.ReactNode;
}

export function TableRow({ index, children }: TableRowProps) {
  return (
    <tr
      className={`border-b border-white/4 hover:bg-highlights1/5 transition-colors ${
        index % 2 === 0 ? "bg-white/[0.018]" : ""
      }`}
    >
      {children}
    </tr>
  );
}