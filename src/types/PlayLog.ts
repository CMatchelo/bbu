import { PossessionResult } from "./PossessionResult"
import { OffensivePlaySystem } from "./PlaySystem"

export type PlayLog = {
  team: "HOME" | "AWAY",
  result: PossessionResult,
  offensivePlay?: keyof OffensivePlaySystem,
}