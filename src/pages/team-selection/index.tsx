import { RootState } from "../../store";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { PlayTypeSelection } from "./components/PlayTypeSelection";
import { PlayerSelection } from "./components/PlayersSelection";
import { ParentSecion } from "../../Components/ParentSection";

export default function TeamSelection() {
  const navigate = useNavigate();
  const starters = useAppSelector((state: RootState) => state.gameSettings.starters);

  const startGame = () => {
    if (starters.length < 5) {
      return;
    }
    navigate("/gameScreen");
  };

  const ready = starters.length === 5;

  return (
    <ParentSecion className="px-4">
      <div className="flex flex-col gap-4">
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