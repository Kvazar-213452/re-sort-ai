import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword, verifyPassword } from "@/server/session";
import { getUsersCollection, toPublicUser } from "@/server/repositories/user-repository";
import { isValidEmail } from "@/domain/validators";
import { errorResponse } from "@/utils/api-error";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to edit your profile." }, { status: 401 });
  }

  let payload: {
    name?: string;
    email?: string;
    avatar?: string | null;
    currentPassword?: string;
    newPassword?: string;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const users = await getUsersCollection();
    const update: Partial<{ name: string; email: string; avatar: string | null; passwordHash: string }> = {};

    if (payload.name !== undefined) {
      const name = payload.name.trim();
      if (name.length < 2 || name.length > 60) {
        return NextResponse.json({ error: "Enter your name (2-60 characters)." }, { status: 400 });
      }
      update.name = name;
    }

    if (payload.email !== undefined) {
      const email = payload.email.trim().toLowerCase();
      if (!isValidEmail(email)) {
        return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
      }
      if (email !== user.email) {
        const existing = await users.findOne({ email, _id: { $ne: user._id } });
        if (existing) {
          return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
        }
        update.email = email;
      }
    }

    if (payload.avatar !== undefined) {
      update.avatar = payload.avatar;
    }

    if (payload.newPassword) {
      if (!payload.currentPassword || !(await verifyPassword(payload.currentPassword, user.passwordHash))) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
      }
      if (payload.newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
      }
      update.passwordHash = await hashPassword(payload.newPassword);
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ user: toPublicUser(user) });
    }

    await users.updateOne({ _id: user._id }, { $set: update });
    const updated = await users.findOne({ _id: user._id });

    return NextResponse.json({ user: toPublicUser(updated!) });
  } catch (error) {
    return errorResponse(error, "Could not save your changes.");
  }
}
