// Consistent page header used across the CRM. `action` is an optional
// right-aligned slot (e.g. an "Add" button).
export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-navy-500">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy-700">
          {title}
        </h1>
        {description && <p className="mt-1.5 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
