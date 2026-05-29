const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'crm.db');

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      phone      TEXT,
      company    TEXT,
      address    TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      sku        TEXT NOT NULL,
      category   TEXT NOT NULL,
      price      REAL NOT NULL DEFAULT 0,
      stock      INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL,
      customer_id  INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      status       TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
      total        REAL NOT NULL DEFAULT 0,
      items_count  INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function seed(db) {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM customers').get();
  if (count > 0) return;

  const customers = [
    ['Sarah Mitchell', 'sarah@urbanthreads.co.uk', '+44 20 7946 0123', 'Urban Threads Ltd', '14 Camden High Street, London, NW1 0JH'],
    ['James Carter', 'j.carter@coastalapparel.co.uk', '+44 117 496 0233', 'Coastal Apparel', '8 Harbourside, Bristol, BS1 5UH'],
    ['Priya Sharma', 'priya@meridianfashion.co.uk', '+44 161 850 4471', 'Meridian Fashion', '52 Deansgate, Manchester, M3 2EN'],
    ['Tom Baxter', 'tom@northgatestyle.co.uk', '+44 113 320 7788', 'Northgate Style', '21 Briggate, Leeds, LS1 6HD'],
    ['Elena Rossi', 'elena@belladonna.co.uk', '+44 131 556 9012', 'Belladonna Boutique', '3 Rose Street, Edinburgh, EH2 2PR'],
    ['Marcus Webb', 'marcus@webbandsons.co.uk', '+44 121 643 5566', 'Webb & Sons Outfitters', '77 Corporation Street, Birmingham, B4 6TB'],
    ['Aisha Khan', 'aisha@stitchcollective.co.uk', '+44 29 2087 1234', 'The Stitch Collective', '19 St Mary Street, Cardiff, CF10 1AT'],
    ['Daniel O\'Connor', 'dan@harbourtraders.ie', '+353 1 478 9900', 'Harbour Traders', '5 Grafton Street, Dublin 2, Ireland'],
  ];
  const insertCustomer = db.prepare(
    'INSERT INTO customers (name, email, phone, company, address) VALUES (?, ?, ?, ?, ?)'
  );

  const products = [
    ['Classic Cotton Crew Tee', 'TS-001', 'T-Shirts', 6.5, 1240],
    ['Heavyweight Pocket Tee', 'TS-014', 'T-Shirts', 8.25, 860],
    ['Premium Pullover Hoodie', 'HD-021', 'Hoodies', 14.0, 540],
    ['Zip-Through Hoodie', 'HD-028', 'Hoodies', 16.5, 95],
    ['Quilted Bomber Jacket', 'JK-033', 'Jackets', 28.0, 130],
    ['Waxed Field Jacket', 'JK-041', 'Jackets', 42.0, 0],
    ['Slim Stretch Chinos', 'TR-052', 'Trousers', 16.5, 410],
    ['Tapered Cargo Trousers', 'TR-058', 'Trousers', 19.0, 220],
    ['Merino Wool Jumper', 'KW-066', 'Knitwear', 22.0, 70],
    ['Cable-Knit Cardigan', 'KW-072', 'Knitwear', 24.5, 48],
    ['Canvas Tote Bag', 'AC-080', 'Accessories', 3.2, 2050],
    ['Ribbed Beanie Hat', 'AC-085', 'Accessories', 4.75, 1320],
  ];
  const insertProduct = db.prepare(
    'INSERT INTO products (name, sku, category, price, stock) VALUES (?, ?, ?, ?, ?)'
  );

  // [order_number, customer_id, status, total, items_count, created_at]
  const orders = [
    ['ORD-1001', 1, 'delivered', 2860.0, 440, '2026-05-04 10:12:00'],
    ['ORD-1002', 3, 'delivered', 1740.5, 210, '2026-05-07 14:30:00'],
    ['ORD-1003', 2, 'shipped', 980.0, 120, '2026-05-12 09:05:00'],
    ['ORD-1004', 5, 'processing', 3420.0, 510, '2026-05-15 16:48:00'],
    ['ORD-1005', 4, 'shipped', 645.75, 75, '2026-05-18 11:20:00'],
    ['ORD-1006', 6, 'pending', 1290.0, 160, '2026-05-21 13:00:00'],
    ['ORD-1007', 7, 'delivered', 2210.0, 300, '2026-05-22 08:40:00'],
    ['ORD-1008', 8, 'processing', 1875.5, 240, '2026-05-25 15:15:00'],
    ['ORD-1009', 1, 'shipped', 530.0, 60, '2026-05-27 10:00:00'],
    ['ORD-1010', 3, 'pending', 4120.0, 600, '2026-05-28 17:30:00'],
  ];
  const insertOrder = db.prepare(
    'INSERT INTO orders (order_number, customer_id, status, total, items_count, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const seedAll = db.transaction(() => {
    for (const c of customers) insertCustomer.run(...c);
    for (const p of products) insertProduct.run(...p);
    for (const o of orders) insertOrder.run(...o);
  });
  seedAll();
}

function getDb() {
  if (!globalThis.__crmDb) {
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
    seed(db);
    globalThis.__crmDb = db;
  }
  return globalThis.__crmDb;
}

module.exports = getDb();
