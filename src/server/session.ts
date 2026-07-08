import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { config } from "@/config";
import { getUsersCollection, type UserDocument } from "@/server/repositories/user-repository";

const COOKIE_NAME = config.auth.cookieName;
const SESSION_SECONDS = config.auth.sessionSeconds;

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured. Add it to .env.local and restart the dev server.");
  }
  return new TextEncoder().encode(secret);
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, config.auth.bcryptSaltRounds);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

async function createSessionToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(getSecretKey());
}

async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getCurrentUser(): Promise<UserDocument | null> {
  const userId = await getSessionUserId();
  if (!userId || !ObjectId.isValid(userId)) return null;
  const users = await getUsersCollection();
  return users.findOne({ _id: new ObjectId(userId) });
}

/** Same as `getCurrentUser`, but resolves to `null` instead of throwing when the session/DB lookup fails. */
export async function getOptionalUser(): Promise<UserDocument | null> {
  return getCurrentUser().catch(() => null);
}
