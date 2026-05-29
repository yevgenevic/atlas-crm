import db from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  const rows = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  return NextResponse.json(rows);
}

export async function POST(request) {
  const b = await request.json().catch(() => ({}));
  const { name, sku, category, price, stock } = b;
  if (!name?.trim() || !sku?.trim() || !category?.trim()) {
    return NextResponse.json({ error: 'Name, SKU and category are required.' }, { status: 400 });
  }
  const info = db
    .prepare('INSERT INTO products (name, sku, category, price, stock) VALUES (?, ?, ?, ?, ?)')
    .run(name.trim(), sku.trim(), category.trim(), Number(price) || 0, Number(stock) || 0);
  const created = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  return NextResponse.json(created, { status: 201 });
}
