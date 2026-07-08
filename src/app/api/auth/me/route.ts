import { NextResponse } from "next/server";
import { getOptionalUser } from "@/server/session";
import { toPublicUser } from "@/server/repositories/user-repository";

export async function GET() {
  const user = await getOptionalUser();
  return NextResponse.json({ user: user ? toPublicUser(user) : null });
}
