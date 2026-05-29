import db from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  const rows = db.prepare('SELECT * FROM customers ORDER BY id DESC').all();
  return NextResponse.json(rows);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { name, email, phone, company, address } = body;
  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  const info = db
    .prepare('INSERT INTO customers (name, email, phone, company, address) VALUES (?, ?, ?, ?, ?)')
    .run(name.trim(), email.trim(), phone?.trim() || null, company?.trim() || null, address?.trim() || null);
  const created = db.prepare('SELECT * FROM customers WHERE id = ?').get(info.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
