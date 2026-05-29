import { Hammer } from 'lucide-react';

// Lightweight placeholder used by routes that get built in later sections.
export default function ComingSoon({ eyebrow, title, description, note }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-navy-500">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy-700">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-slate-500">{description}</p>
      )}
      <div className="mt-8 grid place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-card">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-navy-50 text-navy-500">
          <Hammer className="h-6 w-6" />
        </div>
        <p className="mt-4 font-semibold text-slate-700">{note}</p>
        <p className="mt-1 text-sm text-slate-400">
          We&apos;re building this CRM section by section.
        </p>
      </div>
    </div>
  );
}
