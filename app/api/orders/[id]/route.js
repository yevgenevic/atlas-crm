import db from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

export async function PUT(request, { params }) {
  const id = Number(params.id);
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
      'UPDATE orders SET order_number = ?, customer_id = ?, status = ?, total = ?, items_count = ? WHERE id = ?'
    )
    .run(
      order_number.trim(),
      customer_id || null,
      status || 'pending',
      Number(total) || 0,
      Number(items_count) || 0,
      id
    );
  if (info.changes === 0) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }
  return NextResponse.json(db.prepare('SELECT * FROM orders WHERE id = ?').get(id));
}

export function DELETE(request, { params }) {
  const id = Number(params.id);
  const info = db.prepare('DELETE FROM orders WHERE id = ?').run(id);
  if (info.changes === 0) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
