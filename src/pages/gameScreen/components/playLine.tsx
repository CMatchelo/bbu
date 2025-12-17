import { PlayLog } from '../../../types/PlayLog';
import { PlayLineRow } from './playLineRow'

interface PlayLineProps {
  logPlays: PlayLog[];
  team: "HOME" | "AWAY";
}

export const PlayLine = ({ logPlays, team }: PlayLineProps) => {
  return (
    <div className="col-span-3 flex flex-col-reverse">
      {logPlays.map((play, i) => (
        <PlayLineRow key={i} play={play} team={team} />
      ))}
    </div>
  );
};
