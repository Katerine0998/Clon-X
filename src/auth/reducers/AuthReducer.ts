import type { AuthReducerAction, AuthState } from "../types/AuthReducerInterfaces";

export const AuthReducer = (state: AuthState, action: AuthReducerAction): AuthState => {
  switch (action.type) {
    case "login":
      return {
        logged: true,
        checking: false,
        user: action.payload?.user ?? null,
        errorMessage: null,
      };

    case "logout":
      return {
        logged: false,
        checking: false,
        user: null,
        errorMessage: null,
      };

    case "error":
      return {
        logged: false,
        checking: false,
        user: null,
        errorMessage: action.payload?.errorMessage ?? null,
      };

    default:
      return state;
  }
};