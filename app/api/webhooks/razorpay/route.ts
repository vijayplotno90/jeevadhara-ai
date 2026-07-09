import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDb } from "@/lib/db";

/**
 * Razorpay webhook — the ONLY place payment_status is allowed to become
 * 'paid'. Verifies the HMAC signature against RAZORPAY_KEY_SECRET before
 * trusting the payload. This is what makes revenue evidence for the
 * hackathon submission real rather than self-reported.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event;

  if (event === "payment.captured") {
    const razorpayOrderId = payload.payload.payment.entity.order_id;
    const razorpayPaymentId = payload.payload.payment.entity.id;

    const db = getDb();
    await db.query(
      `UPDATE orders
       SET payment_status = 'paid', razorpay_payment_id = $2
       WHERE razorpay_order_id = $1`,
      [razorpayOrderId, razorpayPaymentId]
    );
  }

  if (event === "payment.failed") {
    const razorpayOrderId = payload.payload.payment.entity.order_id;
    const db = getDb();
    await db.query(
      `UPDATE orders SET payment_status = 'failed' WHERE razorpay_order_id = $1`,
      [razorpayOrderId]
    );
  }

  return NextResponse.json({ received: true });
}
