import db from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const id = Number(params.id);
  const body = await request.json().catch(() => ({}));
  const { name, email, phone, company, address } = body;
  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  const info = db
    .prepare('UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, address = ? WHERE id = ?')
    .run(name.trim(), email.trim(), phone?.trim() || null, company?.trim() || null, address?.trim() || null, id);
  if (info.changes === 0) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  }
  const updated = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  return NextResponse.json(updated);
}

export function DELETE(request, { params }) {
  const id = Number(params.id);
  const info = db.prepare('DELETE FROM customers WHERE id = ?').run(id);
  if (info.changes === 0) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
