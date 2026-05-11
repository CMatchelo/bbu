import { RootState } from "../../store";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { PlayTypeSelection } from "./components/PlayTypeSelection";
import { PlayerSelection } from "./components/PlayersSelection";
import { ParentSecion } from "../../Components/ParentSection";
import { useAuthUser } from "../../hooks/useAuthUser";
import { selectcurrentWeekMatchByUniversity } from "../../selectors/data.scheduleSelector";
import { selectUniversitiesGrouped } from "../../selectors/data.selectors";

function useNextMatchInfo() {
  const user = useAuthUser();
  const match = useAppSelector((state: RootState) =>
    selectcurrentWeekMatchByUniversity(state, user.currentUniversity.id),
  );
  const universitiesByLeague = useAppSelector(selectUniversitiesGrouped);

  if (!match) return null;

  const allUnis = Object.values(universitiesByLeague).flat();
  const homeUni = allUnis.find((u) => u.id === match.home);
  const awayUni = allUnis.find((u) => u.id === match.away);
  if (!homeUni || !awayUni) return null;

  const leagueTeams = universitiesByLeague[homeUni.leagueId] ?? [];
  const sorted = [...leagueTeams].sort(
    (a, b) => (b.stats[user.currentSeason]?.wins ?? 0) - (a.stats[user.currentSeason]?.wins ?? 0),
  );
  const homePos = sorted.findIndex((u) => u.id === homeUni.id) + 1;
  const awayPos = sorted.findIndex((u) => u.id === awayUni.id) + 1;

  return { homeUni, awayUni, homePos, awayPos };
}

export default function TeamSelection() {
  const navigate = useNavigate();
  const starters = useAppSelector((state: RootState) => state.gameSettings.starters);
  const matchInfo = useNextMatchInfo();

  const startGame = () => {
    if (starters.length < 5) return;
    navigate("/gameScreen");
  };

  const ready = starters.length === 5;

  return (
    <ParentSecion className="px-4">
      <div className="flex flex-col gap-4">
        {matchInfo && (
          <div className="flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-cardbg/75 border border-highlights1/15">
            <span className="text-[11px] text-text2">({matchInfo.homePos})</span>
            <span className="text-[13px] font-medium text-text1 tracking-wider uppercase">{matchInfo.homeUni.id}</span>
            <span className="text-[14px] text-text1">{matchInfo.homeUni.nickname}</span>
            <span className="text-[13px] text-text2 mx-1">x</span>
            <span className="text-[14px] text-text1">{matchInfo.awayUni.nickname}</span>
            <span className="text-[13px] font-medium text-text1 tracking-wider uppercase">{matchInfo.awayUni.id}</span>
            <span className="text-[11px] text-text2">({matchInfo.awayPos})</span>
          </div>
        )}

        <PlayTypeSelection />
        <PlayerSelection />

        <div className="flex items-center justify-between pt-2">
          <span className="text-[12px] text-text2">
            {ready
              ? "Elenco pronto. Boa sorte!"
              : `Selecione mais ${5 - starters.length} titular(es) para continuar.`}
          </span>
          <button
            onClick={startGame}
            disabled={!ready}
            className={`px-6 py-2.5 rounded-lg text-[13px] font-medium tracking-wider uppercase border transition-all ${
              ready
                ? "bg-highlights1/15 text-highlights1 border-highlights1/40 hover:bg-highlights1/25 hover:border-highlights1"
                : "bg-white/4 text-text2 border-white/8 cursor-not-allowed"
            }`}
          >
            Iniciar Jogo
          </button>
        </div>
      </div>
    </ParentSecion>
  );
}
