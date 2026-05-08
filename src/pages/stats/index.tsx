import { useSelector } from "react-redux";
import { selectAllPlayers } from "../../selectors/data.selectors";
import { ParentSecion } from "../../Components/ParentSection";
import { PlayerStats } from "../../Components/PlayerStats";

export default function Stats() {
  const players = useSelector(selectAllPlayers);

  return (
    <ParentSecion className="px-4">
      <div className="flex-1 min-h-0 flex flex-col">
        <PlayerStats players={players} />
      </div>
    </ParentSecion>
  );
}
