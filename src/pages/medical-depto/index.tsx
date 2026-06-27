import { ParentSection } from "../../Components/ParentSection";
import { useUser } from "../../Context/UserContext";
import { selectInjuredPlayers } from "../../selectors/data.selectors";
import { store } from "../../store";
import MedicalDeptoTable from "../../Components/MedicalDeptoTable";

export default function MedicalDepto() {
  const { user } = useUser();
  const playersInjured = selectInjuredPlayers(store.getState());
  const playersFiltered = playersInjured.filter(
    (p) => p.currentUniversity === user?.currentUniversity.id,
  );
  return (
    <ParentSection>
      <MedicalDeptoTable players={playersFiltered} />
    </ParentSection>
  );
}
