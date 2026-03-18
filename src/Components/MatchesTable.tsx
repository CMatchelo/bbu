import { MatchWithTeams } from "../types/Match";
import { TableHeader } from "./tableHeader";
import { TableTD } from "./tableTd";

interface MatchesTableProps {
  schedule: MatchWithTeams[];
}

export const MatchesTable = ({ schedule }: MatchesTableProps) => {
  return (
    <table className="w-full table-fixed divide-y divide-highlights1 shadow rounded-lg">
      <colgroup>
        <col className="w-1/12"></col>
        <col className="w-2/12"></col>
        <col className="w-1/12"></col>
        <col className="w-1/12"></col>
        <col className="w-1/12"></col>
        <col className="w-2/12"></col>
        <col className="w-1/12"></col>
        <col className="w-2/12"></col>
      </colgroup>
      <thead className="bg-gray-cardbg bg-cardbglight">
        <TableHeader colspan={2}>Home</TableHeader>
        <TableHeader colspan={3}>X</TableHeader>
        <TableHeader colspan={2}>Away</TableHeader>
        <TableHeader colspan={1}>Championship</TableHeader>
      </thead>
      <tbody className="divide-y divide-highlights1">
        {schedule.map((match, index) => (
          <tr key={match.id}>
            <TableTD index={index}>{match.homeTeam.id.toUpperCase()}</TableTD>
            <TableTD index={index}>{match.homeTeam.nickname}</TableTD>
            <TableTD index={index}>
              {match.played && <>{match.result?.homeScore}</>}
            </TableTD>
            <TableTD index={index}>vs</TableTD>
            <TableTD index={index}>
              {match.played && <>{match.result?.awayScore}</>}
            </TableTD>
            <TableTD index={index}>{match.awayTeam.nickname}</TableTD>
            <TableTD index={index}>{match.awayTeam.id.toUpperCase()}</TableTD>
            <TableTD index={index}>Regional</TableTD>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
