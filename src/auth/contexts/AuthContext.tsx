import { createContext } from "react";
import type { AuthState, RegisterData } from "../types/AuthReducerInterfaces";

export interface AuthContextValue {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  // Returns null when everything went well, or the error message to show.
  register: (data: RegisterData) => Promise<string | null>;
  logout: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);