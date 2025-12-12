import type { University } from "./University"

export type User = {
  id: string
  name: string
  currentUniversity: University
  //championships: CompletedTournament[]
  reputation: number    // 0–100 (influencia propostas, recrutamento, IAs respeitarem mais o técnico)
}

export type UserContextType = {
  user: User | null;
  login: (data: User) => void;
  updateUser: (changes: Partial<User>) => void;
  logout: () => void;
};