import { useEffect, useReducer, useRef, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { AuthReducer } from "../reducers/AuthReducer";
import type { AuthState, RegisterData, User } from "../types/AuthReducerInterfaces";
import { FirebaseAuth } from "../../firebase/config";
import {
  getErrorMessage,
  loginUserByCredentials,
  loginUserWithGoogle,
  logoutFirebase,
  registerUserByCredentials,
  type AuthResult,
} from "../../firebase/providers";
import { ensureUserProfile } from "../../services/userService";

const initialState: AuthState = {
  logged: false,
  checking: true,
  user: null,
  errorMessage: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

interface BasicAuthInfo {
  uid: string;
  email: string;
  photoURL: string | null;
  displayName: string | null;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(AuthReducer, initialState);

  // While a registration is in progress we ignore Firebase's "session started" event,
  // because the Firestore profile is not saved yet. register() logs the user in at the end.
  const registeringRef = useRef(false);

  // Completes the Auth data with the profile stored in Firestore (full name and unique username).
  const buildUser = async (info: BasicAuthInfo): Promise<User> => {
    const profile = await ensureUserProfile({ uid: info.uid, email: info.email, displayName: info.displayName });
    return {
      uid: info.uid,
      email: info.email,
      photoURL: info.photoURL,
      fullName: profile.fullName,
      username: profile.username,
    };
  };

  // Firebase tells us whether there is an active session (it also works after refreshing the page).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, async (firebaseUser) => {
      if (registeringRef.current) return;

      if (!firebaseUser) {
        dispatch({ type: "logout" });
        return;
      }

      try {
        const user = await buildUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? "",
          photoURL: firebaseUser.photoURL,
          displayName: firebaseUser.displayName,
        });
        dispatch({ type: "login", payload: { user } });
      } catch (error) {
        dispatch({ type: "error", payload: { errorMessage: getErrorMessage(error) } });
      }
    });

    return unsubscribe;
  }, []);

  // Common logic for email/password and Google sign in.
  const handleAuthResult = async (result: AuthResult): Promise<boolean> => {
    if (result.ok) {
      try {
        const user = await buildUser({
          uid: result.uid,
          email: result.email,
          photoURL: result.photoURL,
          displayName: result.displayName,
        });
        dispatch({ type: "login", payload: { user } });
        return true;
      } catch (error) {
        dispatch({ type: "error", payload: { errorMessage: getErrorMessage(error) } });
        return false;
      }
    }

    dispatch({ type: "error", payload: { errorMessage: result.errorMessage } });
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> =>
    handleAuthResult(await loginUserByCredentials(email, password));

  const loginWithGoogle = async (): Promise<boolean> => handleAuthResult(await loginUserWithGoogle());

  const register = async (data: RegisterData): Promise<string | null> => {
    registeringRef.current = true;
    try {
      const result = await registerUserByCredentials(data);
      if (!result.ok) return result.errorMessage;

      const user = await buildUser({
        uid: result.uid,
        email: result.email,
        photoURL: result.photoURL,
        displayName: result.displayName,
      });
      dispatch({ type: "login", payload: { user } });
      return null;
    } catch (error) {
      return getErrorMessage(error);
    } finally {
      registeringRef.current = false;
    }
  };

  const logout = async (): Promise<boolean> => {
    await logoutFirebase();
    dispatch({ type: "logout" });
    return true;
  };

  return (
    <AuthContext.Provider value={{ authState, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};