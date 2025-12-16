type TableHeaderProps = {
  children: React.ReactNode;
  colspan?: number
};

export const TableHeader = ({
  children,
  colspan = 1
}: TableHeaderProps) => {


  return (
    <th colSpan={colspan}
      className="px-4 py-2 font-medium text-text1 cursor-pointer select-none"
    >
      {children}
    </th>
  );
};
