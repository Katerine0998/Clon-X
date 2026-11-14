import { addDoc, collection, getDocs, query, serverTimestamp, where, type Timestamp } from "firebase/firestore";
import { FirebaseDB } from "../firebase/config";
import type { Tweet } from "../types/models";
import { sortTweetsNewestFirst } from "../utils/sorting";

const TWEETS = "tweets";
export const MAX_TWEET_LENGTH = 280;

interface TweetAuthor {
  uid: string;
  username: string;
  fullName: string;
}

export const publishTweet = async (author: TweetAuthor, body: string): Promise<void> => {
  const text = body.trim();
  if (!text) throw new Error("El tweet no puede estar vacío.");
  if (text.length > MAX_TWEET_LENGTH) throw new Error(`El tweet no puede superar los ${MAX_TWEET_LENGTH} caracteres.`);

  await addDoc(collection(FirebaseDB, TWEETS), {
    authorUid: author.uid,
    authorUsername: author.username,
    authorFullName: author.fullName,
    body: text,
    createdAt: serverTimestamp(),
  });
};

const toTweets = (docs: { id: string; data: () => Record<string, unknown> }[]): Tweet[] =>
  docs.map((d) => {
    const data = d.data();
    const createdAt = (data.createdAt as Timestamp | null)?.toDate().toISOString() ?? new Date().toISOString();
    return {
      id: d.id,
      authorUid: data.authorUid as string,
      authorUsername: data.authorUsername as string,
      authorFullName: data.authorFullName as string,
      body: data.body as string,
      createdAt,
    };
  });

export const getTweetsByUser = async (uid: string): Promise<Tweet[]> => {
  const snap = await getDocs(query(collection(FirebaseDB, TWEETS), where("authorUid", "==", uid)));
  return sortTweetsNewestFirst(toTweets(snap.docs));
};

// Firestore "in" queries accept up to 30 values, so we split the authors in chunks.
export const getFeedTweets = async (authorUids: string[]): Promise<Tweet[]> => {
  const chunks: string[][] = [];
  for (let i = 0; i < authorUids.length; i += 30) chunks.push(authorUids.slice(i, i + 30));

  const results = await Promise.all(
    chunks.map((chunk) => getDocs(query(collection(FirebaseDB, TWEETS), where("authorUid", "in", chunk))))
  );

  return sortTweetsNewestFirst(results.flatMap((snap) => toTweets(snap.docs)));
};
