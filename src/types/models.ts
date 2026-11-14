export interface AppUser {
  uid: string;
  fullName: string;
  username: string; // always lowercase, unique
  email?: string;
}

export interface Tweet {
  id: string;
  authorUid: string;
  authorUsername: string;
  authorFullName: string;
  body: string;
  createdAt: string; // ISO date string
}
