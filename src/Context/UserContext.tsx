import { createContext, useContext, useEffect, useState } from "react";
import { User, UserContextType } from "../types/User";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  function updateUser(changes: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  function loadUser(data: User | null) {
    setUser(data);
  }

  return (
    <UserContext.Provider value={{ user, updateUser, loadUser }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
