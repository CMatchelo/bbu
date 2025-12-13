import { useUser } from "../Context/UserContext";
import { User } from "../types/User";

export function useAuthUser(): User {
  const { user } = useUser()

  if (!user) {
    throw new Error("useAuthUser usado fora do AuthLayout");
  }

  return user;
}