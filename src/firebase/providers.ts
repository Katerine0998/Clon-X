import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { FirebaseAuth } from "./config";
import { createUserProfile, getEmailByUsername, normalizeUsername } from "../services/userService";
import type { RegisterData } from "../auth/types/AuthReducerInterfaces";

export interface AuthSuccess {
  ok: true;
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthFailure {
  ok: false;
  errorMessage: string;
}

export type AuthResult = AuthSuccess | AuthFailure;

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message === "username-taken") {
    return "Ese nombre de usuario ya está en uso.";
  }

  const code = (error as { code?: string })?.code;

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Usuario o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Ese correo electrónico ya está registrado.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "permission-denied":
      return "Firestore rechazó la operación. Revisa que las reglas de seguridad estén publicadas.";
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Intenta de nuevo más tarde.";
    case "auth/popup-closed-by-user":
      return "Cerraste la ventana de Google antes de terminar.";
    case "auth/operation-not-allowed":
      return "Este método de inicio de sesión no está habilitado en Firebase.";
    case "auth/unauthorized-domain":
      return "Este dominio no está autorizado en Firebase Authentication.";
    default:
      return error instanceof Error ? error.message : "Error de autenticación inesperado.";
  }
};

export const loginUserByCredentials = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const { user } = await signInWithEmailAndPassword(FirebaseAuth, email, password);

    return {
      ok: true,
      uid: user.uid,
      email: user.email ?? email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    return { ok: false, errorMessage: getErrorMessage(error) };
  }
};

const googleProvider = new GoogleAuthProvider();

export const loginUserWithGoogle = async (): Promise<AuthResult> => {
  try {
    const { user } = await signInWithPopup(FirebaseAuth, googleProvider);

    return {
      ok: true,
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    return { ok: false, errorMessage: getErrorMessage(error) };
  }
};

// Registers a new user: creates the Auth account and saves the profile in Firestore.
// Neither the email nor the username can be repeated.
export const registerUserByCredentials = async ({
  fullName,
  username,
  email,
  password,
}: RegisterData): Promise<AuthResult> => {
  const cleanUsername = normalizeUsername(username);
  let createdUser: FirebaseUser | null = null;

  try {
    // Quick check before creating the account (the transaction below protects against race conditions)
    if (await getEmailByUsername(cleanUsername)) {
      return { ok: false, errorMessage: getErrorMessage(new Error("username-taken")) };
    }

    const credential = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
    createdUser = credential.user;

    await updateProfile(createdUser, { displayName: fullName.trim() });
    await createUserProfile({ uid: createdUser.uid, fullName: fullName.trim(), username: cleanUsername, email });

    return {
      ok: true,
      uid: createdUser.uid,
      email,
      displayName: fullName.trim(),
      photoURL: null,
    };
  } catch (error) {
    // Roll back: do not leave an Auth account without a profile
    if (createdUser) {
      try {
        await deleteUser(createdUser);
      } catch {
        /* nothing else we can do */
      }
    }
    return { ok: false, errorMessage: getErrorMessage(error) };
  }
};

export const logoutFirebase = async (): Promise<void> => {
  await signOut(FirebaseAuth);
};