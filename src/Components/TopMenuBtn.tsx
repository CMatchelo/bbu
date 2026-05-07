import { useTranslation } from "react-i18next";

interface TopMenuBtnProps {
  tableId: string;
  currentTable: string;
  onClick: () => void;
  className?: string;
}

export const TopMenuBtn = ({
  tableId,
  currentTable,
  onClick,
  className,
}: TopMenuBtnProps) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={`
            px-4 py-2 text-[12px] font-medium whitespace-nowrap transition-all
            ${
              currentTable === tableId
                ? "bg-highlights2/12 text-highlights2"
                : "text-text2 hover:bg-highlights2/6 hover:text-text1"
            }
            ${className}
            `}
    >
      {t(`generalLocale.${tableId}`)}
    </button>
  );
};
