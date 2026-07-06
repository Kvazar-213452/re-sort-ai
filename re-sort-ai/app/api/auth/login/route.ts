import { NextResponse } from "next/server";
import { setSessionCookie, verifyPassword } from "@/app/lib/auth";
import { getUsersCollection, toPublicUser } from "@/app/lib/user";

export async function POST(request: Request) {
  let payload: { email?: string; password?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  const password = payload.password;
  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ email });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    await setSessionCookie(user._id!.toString());
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not sign you in.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}