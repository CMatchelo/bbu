import { Player } from "./types/Player";
import { University } from "./types/University";
import { User } from "./types/User";
import { HighSchoolPlayer } from "./types/HighSchoolPlayer";
import { LeagueStandings } from "./types/LeagueStandings";
import { MatchNews } from "./types/MatchNews";

export {};

declare global {
  interface Window {
    api: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      loadJson: (string) => Promise<any>;
      saveGame: (user: User) => Promise<void>;
      loadGame: (userId: string) => Promise<{
        user: User;
        schedule: ScheduleSave;
        players: Record<string, Player>;
        universities: Record<string, University>;
        highSchoolPlayers: Record<string, HighSchoolPlayer> | null;
        leagueStandingsHistory: LeagueStandings[];
        news: Record<number, MatchNews[]> | null;
      } | null>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      loadFolders: () => Promise<any>;
      saveSchedule: (userId: string, schedule: ScheduleSave) => Promise<void>;
      savePlayers: (
        userId: string,
        players: Record<string, Player>,
      ) => Promise<void>;
      saveUniversities: (
        userId: string,
        universities: Record<string, University>,
      ) => Promise<void>;
      saveHighSchoolPlayers: (
        userId: string,
        data: Record<string, HighSchoolPlayer>,
      ) => Promise<void>;
      saveLeagueStandings: (
        userId: string,
        data: LeagueStandings[],
      ) => Promise<void>;
      saveGraduatedPlayers: (
        userId: string,
        players: Player[],
      ) => Promise<void>;
      saveNews: (
        userId: string,
        data: Record<number, MatchNews[]>,
      ) => Promise<void>;
      loadNews: (userId: string) => Promise<Record<number, MatchNews[]> | null>;
    };
  }
}
