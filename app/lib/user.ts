import type { Collection, ObjectId } from "mongodb";
import { getDb } from "./db";

export interface UserDocument {
  _id?: ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  avatar: string | null;
  xp: number;
  scannedHashes: string[];
  createdAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  xp: number;
}

export function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id!.toString(),
    email: user.email,
    name: user.name ?? user.email.split("@")[0],
    avatar: user.avatar,
    xp: user.xp,
  };
}

export async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const db = await getDb();
  return db.collection<UserDocument>("users");
}