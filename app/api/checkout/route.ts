import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { getRazorpay } from "@/lib/razorpay";

const bodySchema = z.object({
  consumerId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().positive(),
});

/**
 * Creates a real Razorpay order and an internal `orders` row with
 * payment_status = 'pending'. The row only ever flips to 'paid' via the
 * webhook route after Razorpay confirms the signature — never here.
 */
export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { consumerId, productId, quantity } = parsed.data;

  const db = getDb();
  const { rows } = await db.query(
    `SELECT price, farmer_id FROM products WHERE id = $1 AND is_active = true`,
    [productId]
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: "product_not_found" }, { status: 404 });
  }
  const totalAmount = Number(rows[0].price) * quantity;

  const razorpay = getRazorpay();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100), // paise
    currency: "INR",
    receipt: `jd_${Date.now()}`,
  });

  const insert = await db.query(
    `INSERT INTO orders (consumer_id, product_id, quantity, total_amount, payment_status, razorpay_order_id)
     VALUES ($1, $2, $3, $4, 'pending', $5)
     RETURNING id`,
    [consumerId, productId, quantity, totalAmount, razorpayOrder.id]
  );

  return NextResponse.json({
    orderId: insert.rows[0].id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
