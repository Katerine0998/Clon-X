import { useEffect, useReducer, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { AuthReducer } from "../reducers/AuthReducer";
import type { AuthState } from "../types/AuthReducerInterfaces";
import { FirebaseAuth } from "../../firebase/config";
import {
  loginUserByCredentials,
  loginUserWithGoogle,
  logoutFirebase,
  type AuthResult,
} from "../../firebase/providers";

const initialState: AuthState = {
  logged: false,
  checking: true,
  user: null,
  errorMessage: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(AuthReducer, initialState);

  // Firebase tells us whether there is an active session (it also works after refreshing the page).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch({
          type: "login",
          payload: {
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? "",
              photoURL: firebaseUser.photoURL,
              username: firebaseUser.displayName,
            },
          },
        });
      } else {
        dispatch({ type: "logout" });
      }
    });

    return unsubscribe;
  }, []);

  // Common logic for email/password and Google sign in.
  const handleAuthResult = (result: AuthResult): boolean => {
    if (result.ok) {
      dispatch({
        type: "login",
        payload: {
          user: {
            uid: result.uid,
            email: result.email,
            photoURL: result.photoURL,
            username: result.displayName,
          },
        },
      });
      return true;
    }

    dispatch({ type: "error", payload: { errorMessage: result.errorMessage } });
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> =>
    handleAuthResult(await loginUserByCredentials(email, password));

  const loginWithGoogle = async (): Promise<boolean> => handleAuthResult(await loginUserWithGoogle());

  const logout = async (): Promise<boolean> => {
    await logoutFirebase();
    dispatch({ type: "logout" });
    return true;
  };

  return (
    <AuthContext.Provider value={{ authState, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};