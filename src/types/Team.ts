import type { Player } from "./Player";

export type Team = {
  id: string;
  name: string;
  roster: Player[];
};