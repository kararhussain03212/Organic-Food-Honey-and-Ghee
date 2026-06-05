export default function PaginationControls({ pagination, onPageChange }) {
  const page = Number(pagination?.page || 1);
  const totalPages = Number(pagination?.totalPages || 1);
  const total = Number(pagination?.total || 0);
  const limit = Number(pagination?.limit || 10);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-white/80">
        Showing <span className="font-semibold text-white">{from}</span> to{" "}
        <span className="font-semibold text-white">{to}</span> of{" "}
        <span className="font-semibold text-white">{total}</span> users
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-white/80">Page {page} / {totalPages}</span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
