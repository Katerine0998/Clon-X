import { createContext } from "react";
import type { AuthState } from "../types/AuthReducerInterfaces";

export interface AuthContextValue {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);