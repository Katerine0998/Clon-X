import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { FirebaseAuth } from "./config";

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


const getErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Usuario o contraseña incorrectos.";
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

export const logoutFirebase = async (): Promise<void> => {
  await signOut(FirebaseAuth);
};