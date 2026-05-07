import type { University } from "./University"

export type User = {
  id: string
  name: string
  currentUniversity: University
  reputation: number;
  currentSeason: number;
}

export type UserContextType = {
  user: User | null;
  updateUser: (changes: Partial<User>) => void;
  loadUser: (data: User | null) => void;
};