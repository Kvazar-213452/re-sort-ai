import { NextResponse } from "next/server";
import { hashPassword, setSessionCookie } from "@/server/session";
import { getUsersCollection, toPublicUser, type UserDocument } from "@/server/repositories/user-repository";
import { isValidEmail } from "@/domain/validators";
import { errorResponse } from "@/utils/api-error";

export async function POST(request: Request) {
  let payload: { email?: string; password?: string; name?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  const password = payload.password;
  const name = payload.name?.trim();

  if (!name || name.length < 2 || name.length > 60) {
    return NextResponse.json({ error: "Enter your name (2-60 characters)." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const users = await getUsersCollection();
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const newUser: UserDocument = {
      email,
      name,
      passwordHash: await hashPassword(password),
      avatar: null,
      xp: 0,
      scannedHashes: [],
      createdAt: new Date(),
    };
    const result = await users.insertOne(newUser);
    newUser._id = result.insertedId;

    await setSessionCookie(result.insertedId.toString());

    return NextResponse.json({ user: toPublicUser(newUser) });
  } catch (error) {
    return errorResponse(error, "Could not create your account.");
  }
}
