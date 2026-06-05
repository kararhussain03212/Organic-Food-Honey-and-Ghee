export default function FieldRows({ keys, form, setField, toLabel }) {
  return (
    <div className="space-y-3">
      {keys.map((key) => {
        const isTextarea =
          key.includes("description") ||
          key.includes("_text") ||
          key.includes("_success") ||
          key.includes("_error");

        return (
          <div key={key} className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[280px_1fr] md:items-start">
            <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">{toLabel(key)}</label>
            {isTextarea ? (
              <textarea
                rows={4}
                value={form[key] || ""}
                onChange={(event) => setField(key, event.target.value)}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
              />
            ) : (
              <input
                type="text"
                value={form[key] || ""}
                onChange={(event) => setField(key, event.target.value)}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
