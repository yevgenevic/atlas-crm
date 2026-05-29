import db from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

export function GET() {
  const rows = db
    .prepare(
      `SELECT o.*, c.company AS customer_company, c.name AS customer_name
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       ORDER BY o.created_at DESC, o.id DESC`
    )
    .all();
  return NextResponse.json(rows);
}

export async function POST(request) {
  const b = await request.json().catch(() => ({}));
  const { order_number, customer_id, status, total, items_count } = b;
  if (!order_number?.trim()) {
    return NextResponse.json({ error: 'Order number is required.' }, { status: 400 });
  }
  if (status && !STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  }
  const info = db
    .prepare(
      'INSERT INTO orders (order_number, customer_id, status, total, items_count) VALUES (?, ?, ?, ?, ?)'
    )
    .run(
      order_number.trim(),
      customer_id || null,
      status || 'pending',
      Number(total) || 0,
      Number(items_count) || 0
    );
  const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(info.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
