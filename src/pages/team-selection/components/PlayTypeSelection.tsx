import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  setOffensivePlayOrder,
  setDefensivePlayOrder,
  OffensivePlayKey,
  DefensivePlayKey,
} from "../../../store/slices/gameSettingsSlice";
import { selectUniversityById } from "../../../selectors/data.selectors";
import { useAuthUser } from "../../../hooks/useAuthUser";
import {
  OFFENSIVE_PLAY_LABELS,
  DEFENSIVE_PLAY_LABELS,
  OffensivePlaySystem,
  DefensivePlaySystem,
} from "../../../types/PlaySystem";
import {
  createDefaultOffensivePlaySystem,
  createDefaultDefensivePlaySystem,
} from "../../../utils/createPlaySystem";
import { PlayOrderTable } from "./PlayOrderTable";

function swap<T>(arr: T[], i: number, j: number): T[] {
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export const PlayTypeSelection = () => {
  const dispatch = useAppDispatch();
  const user = useAuthUser();

  const offensivePlayOrder = useAppSelector(
    (state: RootState) => state.gameSettings.offensivePlayOrder,
  );
  const defensivePlayOrder = useAppSelector(
    (state: RootState) => state.gameSettings.defensivePlayOrder,
  );

  const university = useSelector(
    selectUniversityById(user.currentUniversity.id),
  );
  const offSystem: OffensivePlaySystem =
    university.offensive ?? createDefaultOffensivePlaySystem();
  const defSystem: DefensivePlaySystem =
    university.defensive ?? createDefaultDefensivePlaySystem();

  const offFamiliarity = Object.fromEntries(
    Object.entries(offSystem).map(([k, v]) => [k, v.familiarity]),
  );
  const defFamiliarity = Object.fromEntries(
    Object.entries(defSystem).map(([k, v]) => [k, v.familiarity]),
  );

  const moveOffUp = (idx: number) =>
    dispatch(
      setOffensivePlayOrder(
        swap(offensivePlayOrder, idx, idx - 1) as OffensivePlayKey[],
      ),
    );
  const moveOffDown = (idx: number) =>
    dispatch(
      setOffensivePlayOrder(
        swap(offensivePlayOrder, idx, idx + 1) as OffensivePlayKey[],
      ),
    );
  const moveDefUp = (idx: number) =>
    dispatch(
      setDefensivePlayOrder(
        swap(defensivePlayOrder, idx, idx - 1) as DefensivePlayKey[],
      ),
    );
  const moveDefDown = (idx: number) =>
    dispatch(
      setDefensivePlayOrder(
        swap(defensivePlayOrder, idx, idx + 1) as DefensivePlayKey[],
      ),
    );

  return (
    <div className="flex gap-3">
      <PlayOrderTable
        title="Offense"
        order={offensivePlayOrder}
        labels={OFFENSIVE_PLAY_LABELS}
        familiarity={offFamiliarity}
        onMoveUp={moveOffUp}
        onMoveDown={moveOffDown}
      />
      <PlayOrderTable
        title="Defense"
        order={defensivePlayOrder}
        labels={DEFENSIVE_PLAY_LABELS}
        familiarity={defFamiliarity}
        onMoveUp={moveDefUp}
        onMoveDown={moveDefDown}
      />
    </div>
  );
};
