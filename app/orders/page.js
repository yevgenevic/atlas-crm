'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import StatusBadge from '@/components/StatusBadge';
import { money, fmtDate, num } from '@/lib/format';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered'];
const emptyForm = { order_number: '', customer_id: '', status: 'pending', items_count: '', total: '' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/customers').then((r) => r.json()),
    ])
      .then(([o, c]) => {
        setOrders(Array.isArray(o) ? o : []);
        setCustomers(Array.isArray(c) ? c : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (!q) return true;
      return [o.order_number, o.customer_company, o.customer_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [orders, query, statusFilter]);

  const nextOrderNumber = () => {
    const max = orders.reduce((m, o) => {
      const n = parseInt(String(o.order_number).replace(/\D/g, ''), 10);
      return Number.isFinite(n) && n > m ? n : m;
    }, 1000);
    return `ORD-${max + 1}`;
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, order_number: nextOrderNumber() });
    setError('');
    setFormOpen(true);
  };

  const openEdit = (o) => {
    setEditing(o);
    setForm({
      order_number: o.order_number || '',
      customer_id: o.customer_id ? String(o.customer_id) : '',
      status: o.status || 'pending',
      items_count: o.items_count ?? '',
      total: o.total ?? '',
    });
    setError('');
    setFormOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.order_number.trim()) {
      setError('Order number is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        order_number: form.order_number.trim(),
        customer_id: form.customer_id ? Number(form.customer_id) : null,
        status: form.status,
        items_count: Number(form.items_count) || 0,
        total: Number(form.total) || 0,
      };
      const url = editing ? `/api/orders/${editing.id}` : '/api/orders';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Could not save order.');
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/orders/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Fulfilment"
        title="Orders"
        description="Track and manage wholesale orders."
        action={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> New order
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order # or customer…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['all', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                statusFilter === s
                  ? 'bg-navy-700 text-white'
                  : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 text-right font-semibold">Items</th>
                <th className="px-5 py-3 text-right font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">Loading…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">No orders found.</td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{o.order_number}</td>
                    <td className="px-5 py-3.5 text-slate-600">{o.customer_company || o.customer_name || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-500">{fmtDate(o.created_at)}</td>
                    <td className="px-5 py-3.5 text-right text-slate-600 tabular-nums">{num(o.items_count)}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-800 tabular-nums">{money(o.total)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(o)} aria-label="Edit" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-navy-50 hover:text-navy-600">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(o)} aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={formOpen}
        onClose={() => !saving && setFormOpen(false)}
        title={editing ? 'Edit order' : 'New order'}
        footer={
          <>
            <button type="button" onClick={() => setFormOpen(false)} disabled={saving} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button type="submit" form="order-form" disabled={saving} className="rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create order'}
            </button>
          </>
        }
      >
        <form id="order-form" onSubmit={submit} className="space-y-4">
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Order number *">
              <input className="input" value={form.order_number} onChange={(e) => setForm({ ...form, order_number: e.target.value })} placeholder="ORD-1011" />
            </Field>
            <Field label="Status">
              <select className="input capitalize" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Customer">
            <select className="input" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
              <option value="">— No customer —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.company ? `${c.company} (${c.name})` : c.name}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Items">
              <input type="number" min="0" className="input" value={form.items_count} onChange={(e) => setForm({ ...form, items_count: e.target.value })} placeholder="0" />
            </Field>
            <Field label="Total (£)">
              <input type="number" min="0" step="0.01" className="input" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} placeholder="0.00" />
            </Field>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete order"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button onClick={confirmDelete} disabled={deleting} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Delete order <span className="font-semibold text-slate-800">{deleteTarget?.order_number}</span>? This can&apos;t be undone.
        </p>
      </Modal>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
