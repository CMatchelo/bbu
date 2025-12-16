export const TableTD = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  return (
    <td
      className={`px-4 py-2 font-medium ${
        index % 2 === 0 ? "bg-cardbgdark" : "bg-cardbg"
      }`}
    >
      {children}
    </td>
  );
};
