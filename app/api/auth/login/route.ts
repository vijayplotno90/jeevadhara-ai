import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

const bodySchema = z.object({
  phone: z.string().min(10).max(15),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { phone, password } = parsed.data;

  const db = getDb();
  const result = await db.query(
    `SELECT id, password_hash, role, full_name FROM users WHERE phone = $1`,
    [phone]
  );

  // Same error for "no such user" and "wrong password" -- don't leak which
  // phone numbers are registered.
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const user = result.rows[0];
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await createSession({ userId: user.id, role: user.role, fullName: user.full_name });
  return NextResponse.json({ userId: user.id, role: user.role });
}
