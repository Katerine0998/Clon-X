import { useContext } from "react";
import { AuthContext } from "../auth/contexts/AuthContext";
import type { User } from "../auth/types/AuthReducerInterfaces";

// Only use inside private routes (there is always a logged user there).
export const useCurrentUser = (): User => {
  const { authState } = useContext(AuthContext);
  if (!authState.user) throw new Error("useCurrentUser must be used inside a private route.");
  return authState.user;
};
