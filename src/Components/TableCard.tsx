import { useTranslation } from "react-i18next";
import { useUser } from "../Context/UserContext";

type TableCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  flexible?: boolean;
};

export const TableCard = ({ title, children, className, flexible }: TableCardProps) => {
  const { user } = useUser();
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-xl max-h-full border border-highlights1/20 bg-mainbg/75 backdrop-blur-sm ${flexible ? "flex flex-col h-full" : ""} ${className ?? ""}`}
    >
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-cardbg/75 border-b border-highlights1/25 rounded-t-lg shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-highlights1 shrink-0" />
        <span className="text-[13px] font-medium tracking-widest uppercase text-text2">
          {title}
        </span>
        <span className="ml-auto text-[11px] font-medium text-highlights1 bg-highlights1/10 border border-highlights1/30 rounded-full px-3 py-0.5">
          {`${t("generalLocale.season")} ${user?.currentSeason}`}
        </span>
      </div>
      <div className={flexible ? "flex-1 min-h-0 overflow-auto" : "overflow-x-auto"}>{children}</div>
    </div>
  );
};
