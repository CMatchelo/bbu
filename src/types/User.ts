import type { University } from "./University"

export type User = {
  id: string
  name: string
  currentUniversity: University
  //championships: CompletedTournament[]
  reputation: number;
  currentSeason: number;
  isStartSeason: boolean;
}

export type UserContextType = {
  user: User | null;
  updateUser: (changes: Partial<User>) => void;
  loadUser: (data: User | null) => void;
};