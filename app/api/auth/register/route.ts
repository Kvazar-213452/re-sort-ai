import { NextResponse } from "next/server";
import { hashPassword, setSessionCookie } from "@/app/lib/auth";
import { getUsersCollection, toPublicUser } from "@/app/lib/user";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  if (!email || !EMAIL_RE.test(email)) {
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

    const passwordHash = await hashPassword(password);
    const result = await users.insertOne({
      email,
      name,
      passwordHash,
      avatar: null,
      xp: 0,
      scannedHashes: [],
      createdAt: new Date(),
    });

    await setSessionCookie(result.insertedId.toString());

    return NextResponse.json({
      user: toPublicUser({
        _id: result.insertedId,
        email,
        name,
        passwordHash,
        avatar: null,
        xp: 0,
        scannedHashes: [],
        createdAt: new Date(),
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create your account.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}