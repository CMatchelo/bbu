import { PlayLog } from '../../../types/PlayLog';
import { PlayLineRow } from './playLineRow'

interface TeamPlayColProps {
  logPlays: PlayLog[];
  team: "HOME" | "AWAY";
}

export const TeamPlayCol = ({ logPlays, team }: TeamPlayColProps) => {
  return (
    <div className="col-span-3 flex flex-col-reverse">
      {logPlays.map((play, i) => (
        <PlayLineRow key={i} play={play} team={team} />
      ))}
    </div>
  );
};
