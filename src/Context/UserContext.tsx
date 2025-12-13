import { createContext, useContext, useEffect, useState } from "react";
import { User, UserContextType } from "../types/User";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  function login(data: User) {
    setUser(data);
  }

  function updateUser(changes: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  function logout() {
    setUser(null)
  }

  function loadUser(data: User) {
  setUser(data);
}

  return (
    <UserContext.Provider value={{ user, login, updateUser, logout, loadUser }}>
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
