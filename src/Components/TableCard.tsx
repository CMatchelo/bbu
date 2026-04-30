import { useTranslation } from "react-i18next";
import { useUser } from "../Context/UserContext";

type TableCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const TableCard = ({ title, children, className }: TableCardProps) => {
  const { user } = useUser();
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-xl max-h-full overflow-auto border border-highlights1/20 bg-mainbg ${className}`}
    >
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-cardbg border-b border-highlights1/25 rounded-t-lg">
        <div className="w-1.5 h-1.5 rounded-full bg-highlights1 shrink-0" />
        <span className="text-[13px] font-medium tracking-widest uppercase text-text2">
          {title}
        </span>
        <span className="ml-auto text-[11px] font-medium text-highlights1 bg-highlights1/10 border border-highlights1/30 rounded-full px-3 py-0.5">
          {`${t("generalLocale.season")} ${user?.currentSeason}`}
        </span>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
};
