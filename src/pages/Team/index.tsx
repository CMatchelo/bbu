import { TableHeader } from "./Components/tableHeader";
import { TableTD } from "./Components/tableTd";
import { useSelector } from "react-redux";
import { useAuthUser } from "../../hooks/useAuthUser";
import { selectUniversitiesWithPlayers } from "../../selectors/data.selectors";
import { updatePlayerSkill } from "../../store/slices/dataSlice";
import { useDispatch } from "react-redux";

export default function Team() {
  const user = useAuthUser();
  const dispatch = useDispatch();

  const universities = useSelector(selectUniversitiesWithPlayers);

  const uni = universities.find((u) => u.id === user.currentUniversity.id);
  const playersSorted = uni?.players
    ?.slice() // opcional, para não mutar o original
    .sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition));

  const testFunc = () => {
    dispatch(
      updatePlayerSkill({
        id: "p00031",
        skill: "defense",
        value: 2,
      })
    );
    console.log("ajustou")
  };

  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <button onClick={testFunc}>Atualizar o jogador teste</button>
      <h1>TEAM AND STRATEGY</h1>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-highlights1  shadow rounded-lg">
          <thead className="bg-gray-cardbg bg-cardbglight">
            <tr>
              <TableHeader>Player</TableHeader>
              <TableHeader>POS</TableHeader>
              <TableHeader>DEF</TableHeader>
              <TableHeader>DRI</TableHeader>
              <TableHeader>PAS</TableHeader>
              <TableHeader>SPD</TableHeader>
              <TableHeader>BLK</TableHeader>
              <TableHeader>STL</TableHeader>
              <TableHeader>REB</TableHeader>
              <TableHeader>LAY</TableHeader>
              <TableHeader>3PT</TableHeader>
              <TableHeader>2PT</TableHeader>
            </tr>
          </thead>

          <tbody className="divide-y divide-highlights1">
            {playersSorted?.map((player, index) => (
              <tr key={player.id} className="hover:bg-cardbglight transition">
                <TableTD index={index}>
                  {player.firstName} {player.lastName}
                </TableTD>
                <TableTD index={index}>{player.inCourtPosition}</TableTD>
                <TableTD index={index}>{player.skills.defense}</TableTD>
                <TableTD index={index}>{player.skills.dribble}</TableTD>
                <TableTD index={index}>{player.skills.pass}</TableTD>
                <TableTD index={index}>{player.skills.speedBall}</TableTD>
                <TableTD index={index}>{player.skills.block}</TableTD>
                <TableTD index={index}>{player.skills.steal}</TableTD>
                <TableTD index={index}>{player.skills.rebound}</TableTD>
                <TableTD index={index}>{player.skills.layup}</TableTD>
                <TableTD index={index}>{player.skills.threept}</TableTD>
                <TableTD index={index}>{player.skills.twopt}</TableTD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
