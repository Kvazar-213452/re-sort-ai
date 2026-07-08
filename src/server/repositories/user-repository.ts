import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/server/db";
import type { PublicUser } from "@/types/user";

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
