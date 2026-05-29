const STATUS = {
  pending: { label: 'Pending', dot: 'bg-amber-500', cls: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  processing: { label: 'Processing', dot: 'bg-blue-500', cls: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  shipped: { label: 'Shipped', dot: 'bg-violet-500', cls: 'bg-violet-50 text-violet-700 ring-violet-600/20' },
  delivered: { label: 'Delivered', dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
};

export default function StatusBadge({ status }) {
  const s =
    STATUS[status] || {
      label: status,
      dot: 'bg-slate-400',
      cls: 'bg-slate-50 text-slate-600 ring-slate-500/20',
    };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${s.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
