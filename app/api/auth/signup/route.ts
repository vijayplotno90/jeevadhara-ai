import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

const bodySchema = z.object({
  phone: z.string().min(10).max(15),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2),
  role: z.enum(["farmer", "consumer", "provider"]), // admin accounts aren't self-service
  village: z.string().optional(),
  consentShareWithJudges: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { phone, password, fullName, role, village, consentShareWithJudges } = parsed.data;

  const db = getDb();

  const existing = await db.query(`SELECT id FROM users WHERE phone = $1`, [phone]);
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: "phone_already_registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const result = await db.query(
    `INSERT INTO users (phone, password_hash, full_name, role, village, consent_share_with_judges)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, role, full_name`,
    [phone, passwordHash, fullName, role, village ?? null, consentShareWithJudges]
  );

  const user = result.rows[0];
  await createSession({ userId: user.id, role: user.role, fullName: user.full_name });

  return NextResponse.json({ userId: user.id, role: user.role }, { status: 201 });
}
