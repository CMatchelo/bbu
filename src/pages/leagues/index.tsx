import { useSelector } from "react-redux";
import { selectAllMatchesByLeague } from "../../selectors/data.scheduleSelector";
import { MatchesTable } from "../../Components/MatchesTable";
import { ParentSecion } from "../../Components/ParentSection";
import { useEffect, useState } from "react";
import { RootState } from "../../store";
import { useUser } from "../../Context/UserContext";
import { useTranslation } from "react-i18next";

export const Leagues = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [leagueId, setLeagueId] = useState(
    user?.currentUniversity?.leagueId || "ne_league",
  );

  const schedule = useSelector((state: RootState) =>
    selectAllMatchesByLeague(state, leagueId),
  );

  useEffect(() => {
    setLeagueId(user?.currentUniversity?.leagueId || "ne_league");
  }, [user?.currentUniversity?.leagueId]);
  return (
    <ParentSecion>
      <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)}>
        <option value="ne_league">{t("championshipLocale.ne_league")}</option>
        <option value="n_league">{t("championshipLocale.n_league")}</option>
        <option value="cw_league">{t("championshipLocale.cw_league")}</option>
        <option value="se_league">{t("championshipLocale.se_league")}</option>
        <option value="s_league">{t("championshipLocale.n_league")}</option>
      </select>
      <MatchesTable schedule={schedule} />
    </ParentSecion>
  );
};
