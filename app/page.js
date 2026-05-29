'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, ShoppingCart, PoundSterling, Truck, ArrowUpRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { money, money0, fmtDate } from '@/lib/format';

const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
const barColor = {
  pending: 'bg-amber-400',
  processing: 'bg-blue-400',
  shipped: 'bg-violet-400',
  delivered: 'bg-emerald-400',
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => {
        if (active) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const kpis = data?.kpis;
  const recentOrders = data?.recentOrders ?? [];
  const breakdown = data?.statusBreakdown ?? { pending: 0, processing: 0, shipped: 0, delivered: 0 };
  const breakdownTotal = statusOrder.reduce((s, k) => s + (breakdown[k] || 0), 0) || 1;

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Welcome back — here's how Atlas Apparel is performing."
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Customers" value={kpis?.customers ?? 0} icon={Users} accent="navy" delay={0} />
        <StatCard label="Total Orders" value={kpis?.orders ?? 0} icon={ShoppingCart} accent="violet" delay={0.08} />
        <StatCard label="Revenue" value={kpis?.revenue ?? 0} icon={PoundSterling} accent="emerald" delay={0.16} format={money0} />
        <StatCard label="Active Shipments" value={kpis?.activeShipments ?? 0} icon={Truck} accent="amber" delay={0.24} />
      </div>

      {/* Lower panels */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy-700">Recent orders</h2>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-700"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <SkeletonRows />
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {o.customer || 'Unknown customer'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {o.order_number} · {fmtDate(o.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={o.status} />
                    <span className="w-24 text-right text-sm font-semibold text-slate-800 tabular-nums">
                      {money(o.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Order status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100"
        >
          <h2 className="mb-4 text-base font-semibold text-navy-700">Order status</h2>
          <div className="space-y-4">
            {statusOrder.map((s) => {
              const count = breakdown[s] || 0;
              const pct = Math.round((count / breakdownTotal) * 100);
              return (
                <div key={s}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="capitalize text-slate-600">{s}</span>
                    <span className="font-semibold text-slate-800">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className={`h-full rounded-full ${barColor[s]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <div className="space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
            <div className="h-2.5 w-24 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
