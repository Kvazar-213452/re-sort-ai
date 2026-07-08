import { NextResponse } from "next/server";

/** Shapes a caught error into the `{ error: string }` JSON response every API route returns on failure. */
export function errorResponse(error: unknown, fallback: string, status = 500) {
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status });
}
