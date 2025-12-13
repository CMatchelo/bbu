import { TableHeader } from "./Components/tableHeader";
import { TableTD } from "./Components/tableTd";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAuthUser } from "../../hooks/useAuthUser";


export default function Team() {
  const user = useAuthUser()

  const universities = useSelector(
    (state: RootState) => state.data.universities
  );

  const uni = universities.find((u) => u.id === user.currentUniversity.id);
  const playersSorted = uni?.players
    ?.slice() // opcional, para não mutar o original
    .sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition));

  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <h1>TEAM AND STRATEGY</h1>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-highlights1 bg-cardbg shadow rounded-lg">
          <thead className="bg-gray-cardbg">
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
            {playersSorted?.map((player) => (
              <tr key={player.id} className="hover:bg-cardbglight transition">
                <TableTD>
                  {player.firstName} {player.lastName}
                </TableTD>
                <TableTD>{player.inCourtPosition}</TableTD>
                <TableTD>{player.skills.defense}</TableTD>
                <TableTD>{player.skills.dribble}</TableTD>
                <TableTD>{player.skills.pass}</TableTD>
                <TableTD>{player.skills.speedBall}</TableTD>
                <TableTD>{player.skills.block}</TableTD>
                <TableTD>{player.skills.steal}</TableTD>
                <TableTD>{player.skills.rebound}</TableTD>
                <TableTD>{player.skills.layup}</TableTD>
                <TableTD>{player.skills.threept}</TableTD>
                <TableTD>{player.skills.twopt}</TableTD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
