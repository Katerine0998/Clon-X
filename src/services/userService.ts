import { doc, getDoc, runTransaction } from "firebase/firestore";
import { FirebaseDB } from "../firebase/config";
import type { AppUser } from "../types/models";

// Firestore structure:
//   users/{uid}            -> { fullName, username, email }
//   usernames/{username}   -> { uid, email }   (reserves the username so it can never repeat)
const USERS = "users";
const USERNAMES = "usernames";

export const USERNAME_REGEX = /^[a-z0-9_.]{3,20}$/;

export const normalizeUsername = (username: string): string => username.trim().toLowerCase();

export const getUserByUid = async (uid: string): Promise<AppUser | null> => {
  const snap = await getDoc(doc(FirebaseDB, USERS, uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return { uid, fullName: data.fullName, username: data.username, email: data.email };
};

export const getUserByUsername = async (username: string): Promise<AppUser | null> => {
  const snap = await getDoc(doc(FirebaseDB, USERNAMES, normalizeUsername(username)));
  if (!snap.exists()) return null;
  return getUserByUid(snap.data().uid as string);
};

// Used by the login form so people can sign in with their username.
export const getEmailByUsername = async (username: string): Promise<string | null> => {
  const snap = await getDoc(doc(FirebaseDB, USERNAMES, normalizeUsername(username)));
  return snap.exists() ? (snap.data().email as string) : null;
};

// Saves the profile and reserves the username in one atomic transaction.
export const createUserProfile = async (profile: AppUser): Promise<void> => {
  await runTransaction(FirebaseDB, async (transaction) => {
    const usernameRef = doc(FirebaseDB, USERNAMES, profile.username);
    const usernameSnap = await transaction.get(usernameRef);

    if (usernameSnap.exists()) throw new Error("username-taken");

    transaction.set(usernameRef, { uid: profile.uid, email: profile.email ?? "" });
    transaction.set(doc(FirebaseDB, USERS, profile.uid), {
      fullName: profile.fullName,
      username: profile.username,
      email: profile.email ?? "",
    });
  });
};

const slugify = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "");

interface BasicAuthInfo {
  uid: string;
  email: string;
  displayName: string | null;
}

// Makes sure the signed-in person has a profile in Firestore.
// Accounts that did not come from our register form (for example Google) get one automatically.
export const ensureUserProfile = async (info: BasicAuthInfo): Promise<AppUser> => {
  const existing = await getUserByUid(info.uid);
  if (existing) return existing;

  let base = slugify(info.email.split("@")[0] || info.displayName || "");
  if (base.length < 3) base = `user${base}`;
  base = base.slice(0, 16);

  const fullName = info.displayName?.trim() || info.email.split("@")[0] || "Usuario";

  for (let attempt = 0; attempt < 6; attempt++) {
    const username = attempt === 0 ? base : `${base}${Math.floor(100 + Math.random() * 900)}`;
    const profile: AppUser = { uid: info.uid, fullName, username, email: info.email };
    try {
      await createUserProfile(profile);
      return profile;
    } catch (error) {
      if (error instanceof Error && error.message === "username-taken") continue;
      throw error;
    }
  }
  throw new Error("No se pudo generar un nombre de usuario único.");
};
