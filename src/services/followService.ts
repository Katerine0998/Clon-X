import { collection, doc, getCountFromServer, getDoc, getDocs,limit, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { FirebaseDB } from "../firebase/config";
import type { AppUser } from "../types/models";

// Firestore structure:
//   follows/{followerUid}_{followedUid} -> { followerUid, followerUsername, followerFullName,
//                                            followedUid, followedUsername, followedFullName, createdAt }
const FOLLOWS = "follows";

export type FollowResult = "followed" | "already" | "self";

const followId = (followerUid: string, followedUid: string) => `${followerUid}_${followedUid}`;

export const isFollowing = async (followerUid: string, followedUid: string): Promise<boolean> => {
  const snap = await getDoc(doc(FirebaseDB, FOLLOWS, followId(followerUid, followedUid)));
  return snap.exists();
};

export const followUser = async (follower: AppUser, target: AppUser): Promise<FollowResult> => {
  if (follower.uid === target.uid) return "self";
  if (await isFollowing(follower.uid, target.uid)) return "already";

  await setDoc(doc(FirebaseDB, FOLLOWS, followId(follower.uid, target.uid)), {
    followerUid: follower.uid,
    followerUsername: follower.username,
    followerFullName: follower.fullName,
    followedUid: target.uid,
    followedUsername: target.username,
    followedFullName: target.fullName,
    createdAt: serverTimestamp(),
  });
  return "followed";
};

// People that `uid` follows
export const getFollowing = async (uid: string): Promise<AppUser[]> => {
  const snap = await getDocs(query(collection(FirebaseDB, FOLLOWS), where("followerUid", "==", uid)));
  return snap.docs.map((d) => {
    const data = d.data();
    return { uid: data.followedUid, fullName: data.followedFullName, username: data.followedUsername };
  });
};

// People that follow `uid`
export const getFollowers = async (uid: string): Promise<AppUser[]> => {
  const snap = await getDocs(query(collection(FirebaseDB, FOLLOWS), where("followedUid", "==", uid)));
  return snap.docs.map((d) => {
    const data = d.data();
    return { uid: data.followerUid, fullName: data.followerFullName, username: data.followerUsername };
  });
};

export const getFollowCounts = async (uid: string): Promise<{ followers: number; following: number }> => {
  const [followers, following] = await Promise.all([
    getCountFromServer(query(collection(FirebaseDB, FOLLOWS), where("followedUid", "==", uid))),
    getCountFromServer(query(collection(FirebaseDB, FOLLOWS), where("followerUid", "==", uid))),
  ]);
  return { followers: followers.data().count, following: following.data().count };
};

// Up to `max` users that the person does not follow yet (for the "A quién seguir" box)
export const getSuggestedUsers = async (uid: string, max = 4): Promise<AppUser[]> => {
  const [usersSnap, following] = await Promise.all([
    getDocs(query(collection(FirebaseDB, "users"), limit(30))),
    getFollowing(uid),
  ]);
  const followedUids = new Set(following.map((user) => user.uid));

  return usersSnap.docs
    .map((d) => ({ uid: d.id, fullName: d.data().fullName as string, username: d.data().username as string }))
    .filter((user) => user.uid !== uid && !followedUids.has(user.uid))
    .slice(0, max);
};