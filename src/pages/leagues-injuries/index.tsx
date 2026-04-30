import { ParentSecion } from "../../Components/ParentSection";
import { selectInjuredPlayers } from "../../selectors/data.selectors";
import { store } from "../../store";
import MedicalDeptoTable from "../../Components/MedicalDeptoTable";

export default function LeaguesInjuries() {
  const playersInjured = selectInjuredPlayers(store.getState());
  return (
    <ParentSecion className="px-4">
      <MedicalDeptoTable players={playersInjured} />
    </ParentSecion>
  );
}
