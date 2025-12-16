import { ScheduleState } from "./types/ScheduleState";
import { User } from "./types/User";

export {};

declare global {
  interface Window {
    api: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      loadJson: (string) => Promise<any>;
      saveGame: (user: User) => Promise<void>;
      loadGame: (userId: string) => Promise<{user: User, schedule: ScheduleSave} | null>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      loadFolders: () => Promise<any>;
      saveSchedule: (userId: string, schedule: ScheduleSave) => Promise<void>
    };
  }
}
