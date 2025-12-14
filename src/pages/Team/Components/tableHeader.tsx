type TableHeaderProps = {
  children: React.ReactNode;
};

export const TableHeader = ({
  children,
}: TableHeaderProps) => {


  return (
    <th
      className="px-4 py-2 text-left font-medium text-text1 cursor-pointer select-none"
    >
      {children}
    </th>
  );
};
