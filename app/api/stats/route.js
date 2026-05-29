import db from '@/lib/db';
import { NextResponse } from 'next/server';

// Always read fresh from SQLite (never statically cached at build time).
export const dynamic = 'force-dynamic';

export function GET() {
  const customers = db.prepare('SELECT COUNT(*) AS c FROM customers').get().c;
  const orders = db.prepare('SELECT COUNT(*) AS c FROM orders').get().c;
  const revenue = db.prepare('SELECT COALESCE(SUM(total), 0) AS s FROM orders').get().s;
  const activeShipments = db
    .prepare("SELECT COUNT(*) AS c FROM orders WHERE status = 'shipped'")
    .get().c;

  const recentOrders = db
    .prepare(
      `SELECT o.id, o.order_number, o.status, o.total, o.created_at,
              c.company AS customer
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       ORDER BY o.created_at DESC
       LIMIT 6`
    )
    .all();

  const statusBreakdown = { pending: 0, processing: 0, shipped: 0, delivered: 0 };
  for (const row of db.prepare('SELECT status, COUNT(*) AS c FROM orders GROUP BY status').all()) {
    statusBreakdown[row.status] = row.c;
  }

  return NextResponse.json({
    kpis: { customers, orders, revenue, activeShipments },
    recentOrders,
    statusBreakdown,
  });
}
