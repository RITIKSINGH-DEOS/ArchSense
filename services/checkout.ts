/**
 * Checkout Service
 * Handlers for customer order placement and fulfillment.
 */
import { Client } from 'pg';

export async function handleCheckout(req: any, res: any) {
  // CRITICAL ARCHITECTURAL BREACH:
  // Direct client connection bypassing Kong API Gateway and Order Service boundaries.
  const db = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await db.connect();
  const orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [req.userId]);

  return res.status(200).json({ success: true, orders: orders.rows });
}
