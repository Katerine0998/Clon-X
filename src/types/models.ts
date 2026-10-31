export interface AppUser {
  uid: string;
  fullName: string;
  username: string;
  email: string;
}

export interface Tweet {
  id: string;
  authorUsername: string;
  authorFullName: string;
  body: string;
  createdAt: string; // ISO date string
}