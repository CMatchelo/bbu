import { RootState } from "../../store";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { PlayTypeSelection } from "./components/PlayTypeSelection";
import { PlayerSelection } from "./components/PlayersSelection";

export default function TeamSelection() {
  const navigate = useNavigate();

  const starters = useAppSelector(
    (state: RootState) => state.gameSettings.starters
  );

  const startGame = () => {
    if (starters.length < 5) {
      console.log("Select all players");
      return;
    }
    navigate("/gameScreen");
  };

  return (
    <div className="p-4 space-y-6">
      <PlayTypeSelection />
      <PlayerSelection />
      <button onClick={startGame}>Start game</button>
    </div>
  );
}
