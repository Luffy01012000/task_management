import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredUser = (): User | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (token, loggedInUser) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
