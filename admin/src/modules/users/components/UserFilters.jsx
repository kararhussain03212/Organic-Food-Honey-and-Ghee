export default function UserFilters({
  searchValue,
  onSearchChange,
  role,
  status,
  onRoleChange,
  onStatusChange,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-4 md:grid-cols-3">
      <label className="space-y-2">
        <span className="block text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">Search</span>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--admin-primary)]"
        />
      </label>
      <label className="space-y-2">
        <span className="block text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">Role</span>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--admin-primary)]"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
      </label>
      <label className="space-y-2">
        <span className="block text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">Status</span>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--admin-primary)]"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>
    </div>
  );
}
