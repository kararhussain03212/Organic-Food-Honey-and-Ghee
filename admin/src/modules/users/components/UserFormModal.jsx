import { useEffect, useState } from "react";
import { PERMISSION_OPTIONS, getDefaultPermissions } from "../constants";

const INITIAL = {
  name: "",
  email: "",
  designation: "",
  phone: "",
  location: "",
  password: "",
  role: "editor",
  status: "active",
  permissions: getDefaultPermissions("editor"),
};

export default function UserFormModal({ open, mode, initialData, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setForm({
        name:        initialData.name || "",
        email:       initialData.email || "",
        designation: initialData.designation || "",
        phone:       initialData.phone || "",
        location:    initialData.location || "",
        password:    "",
        role:        initialData.role || "editor",
        status:      initialData.status || "active",
        permissions: Array.isArray(initialData.permissions) ? initialData.permissions : getDefaultPermissions(initialData.role),
      });
      setError("");
      return;
    }
    setForm(INITIAL);
    setError("");
  }, [open, mode, initialData]);

  if (!open) return null;

  const handleRoleChange = (newRole) => {
    setForm((prev) => ({
      ...prev,
      role: newRole,
      permissions: getDefaultPermissions(newRole),
    }));
  };

  const togglePermission = (key, checked) => {
    setForm((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, key]
        : prev.permissions.filter((p) => p !== key),
    }));
  };

  const applyRoleDefaults = () => {
    setForm((prev) => ({ ...prev, permissions: getDefaultPermissions(prev.role) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name:        form.name,
      email:       form.email,
      role:        form.role,
      status:      form.status,
      designation: form.designation,
      phone:       form.phone,
      location:    form.location,
      permissions: form.permissions,
    };
    if (form.password.trim()) payload.password = form.password;

    const result = await onSubmit(payload);
    if (!result?.success) {
      setError(result?.message || "Failed to save user.");
    }
  };

  const isAdmin = form.role === "admin";

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/60 p-4">
      <form
        onSubmit={submit}
        className="mx-auto my-4 w-full max-w-3xl rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 md:my-8 md:p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-3xl font-semibold text-white">
              {mode === "create" ? "Add User" : "Edit User"}
            </h3>
            <p className="mt-1 text-lg text-white/65">
              {mode === "create"
                ? "Create a new account and assign its role and permissions."
                : "Update profile, access role, status and permissions."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-1.5 text-white/80"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto pr-1 md:max-h-[70vh]">
          {/* Name */}
          <label className="space-y-2">
            <span className="text-sm font-semibold text-white/80">Full Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Jane Doe"
              className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white"
              required
            />
          </label>

          {/* Email */}
          <label className="space-y-2">
            <span className="text-sm font-semibold text-white/80">Email</span>
            <input
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="admin@example.com"
              type="email"
              className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white"
              required
            />
          </label>

          {/* Designation + Phone */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">Designation</span>
              <input
                value={form.designation}
                onChange={(e) => setForm((p) => ({ ...p, designation: e.target.value }))}
                placeholder="Senior Editor"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">Phone</span>
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+92 300 1234567"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white"
              />
            </label>
          </div>

          {/* Location */}
          <label className="space-y-2">
            <span className="text-sm font-semibold text-white/80">Location</span>
            <input
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              placeholder="Lahore, Pakistan"
              className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white"
            />
          </label>

          {/* Password */}
          <label className="space-y-2">
            <span className="text-sm font-semibold text-white/80">
              {mode === "create" ? "Password" : "Password (optional)"}
            </span>
            <input
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder={mode === "create" ? "Enter password" : "Leave blank to keep existing"}
              type="password"
              className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white"
              required={mode === "create"}
            />
          </label>

          {/* Role + Status */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-white/80">Role</span>
              <select
                value={form.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
              <p className="text-xs text-white/40">Changing role auto-applies default permissions.</p>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-white/80">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <p className="text-xs text-white/40">
                Inactive users cannot log in or access the system.
              </p>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white/80">Permissions</p>
                {isAdmin ? (
                  <p className="mt-0.5 text-xs text-[var(--admin-primary)]">
                    Admin has all permissions enabled by default.
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs text-white/40">
                    Select what this user is allowed to do.
                  </p>
                )}
              </div>
              {!isAdmin && (
                <button
                  type="button"
                  onClick={applyRoleDefaults}
                  className="rounded-lg border border-[var(--admin-border)] px-3 py-1.5 text-xs text-white/70 hover:border-[var(--admin-border-amber)] hover:text-white"
                >
                  Apply Role Defaults
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {PERMISSION_OPTIONS.map((option) => {
                const checked = isAdmin || form.permissions.includes(option.key);
                return (
                  <label
                    key={option.key}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                      checked
                        ? "border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)]"
                        : "border-[var(--admin-border)] hover:border-white/20"
                    } ${isAdmin ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isAdmin}
                      onChange={(e) => togglePermission(option.key, e.target.checked)}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[var(--admin-primary)]"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{option.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                        {option.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-red-300">{error}</p>
        ) : null}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--admin-border)] px-4 py-2 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-black disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
