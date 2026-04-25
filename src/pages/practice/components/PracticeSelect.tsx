import { Player } from "../../../types/Player";
import { Skill } from "../../../types/Skill";

const SKILLS = [
  { label: "Defense", key: "defense" },
  { label: "Dribble", key: "ballHandling" },
  { label: "Pass", key: "pass" },
  { label: "Agility", key: "speedWithBall" },
  { label: "Block", key: "block" },
  { label: "Steal", key: "steal" },
  { label: "Rebound", key: "rebound" },
  { label: "Layup", key: "layup" },
  { label: "3 pts shot", key: "threept" },
  { label: "2 pts shot", key: "twopt" },
] as const;

interface PracticeSelectProps {
  player: Player;
  pendingUpdates: { id: string; changes: Partial<Player> }[];
  onUpdate: (key: keyof Skill, playerId: string) => void;
}

export const PracticeSelect = ({
  player,
  pendingUpdates,
  onUpdate,
}: PracticeSelectProps) => {
  const pending = pendingUpdates.find((p) => p.id === player.id);
  const currentValue = (pending?.changes.practicing ?? player.practicing) as
    | keyof Skill
    | undefined;

  return (
    <select
      className="rounded-2xl"
      value={currentValue ?? ""}
      onChange={(e) => onUpdate(e.target.value as keyof Skill, player.id)}
    >
      {SKILLS.map((skill) => {
        const value = player.skills[skill.key as keyof Skill]
        return (
          <option 
            className="bg-cardbglight rounded-2xl flex justify-around" 
            value={skill.key} key={skill.key}>
            {skill.label} ({value})
          </option>
        );
      })}
    </select>
  );
};
