import db from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const id = Number(params.id);
  const b = await request.json().catch(() => ({}));
  const { name, sku, category, price, stock } = b;
  if (!name?.trim() || !sku?.trim() || !category?.trim()) {
    return NextResponse.json({ error: 'Name, SKU and category are required.' }, { status: 400 });
  }
  const info = db
    .prepare('UPDATE products SET name = ?, sku = ?, category = ?, price = ?, stock = ? WHERE id = ?')
    .run(name.trim(), sku.trim(), category.trim(), Number(price) || 0, Number(stock) || 0, id);
  if (info.changes === 0) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }
  return NextResponse.json(db.prepare('SELECT * FROM products WHERE id = ?').get(id));
}

export function DELETE(request, { params }) {
  const id = Number(params.id);
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  if (info.changes === 0) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
