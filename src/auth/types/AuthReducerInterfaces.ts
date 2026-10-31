export interface User {
  uid: string;
  email: string;
  photoURL: string | null;
  username: string | null;
}

export interface AuthState {
  logged: boolean;
  checking: boolean;
  user: User | null;
  errorMessage: string | null;
}

export type ActionType = "login" | "logout" | "error";

export interface AuthReducerAction {
  type: ActionType;
  payload?: {
    user?: User | null;
    errorMessage?: string | null;
  };
}