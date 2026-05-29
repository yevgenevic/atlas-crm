'use client';

import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { num } from '@/lib/format';

const accents = {
  navy: 'bg-navy-50 text-navy-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
};

export default function StatCard({
  label,
  value = 0,
  icon: Icon,
  accent = 'navy',
  delay = 0,
  format = (v) => num(Math.round(v)),
}) {
  const [display, setDisplay] = useState(0);

  // Count up from 0 to the target whenever the value arrives/changes.
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100"
    >
      <div className={`mb-4 grid h-11 w-11 place-items-center rounded-xl ${accents[accent] || accents.navy}`}>
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-navy-700 tabular-nums">
        {format(display)}
      </p>
    </motion.div>
  );
}
