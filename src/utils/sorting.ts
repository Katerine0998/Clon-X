import type { AppUser, Tweet } from "../types/models";

export const sortByFullName = (users: AppUser[]): AppUser[] =>
  [...users].sort((a, b) => a.fullName.localeCompare(b.fullName, "es"));

export const sortTweetsNewestFirst = (tweets: Tweet[]): Tweet[] =>
  [...tweets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());