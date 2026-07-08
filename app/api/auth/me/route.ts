import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { toPublicUser } from "@/app/lib/user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user: user ? toPublicUser(user) : null });
  } catch {
    return NextResponse.json({ user: null });
  }
}