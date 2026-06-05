export const normalizeUserRole = (value) => {
  const role = String(value || "").trim().toLowerCase();
  if (role === "admin" || role === "super_admin") return "admin";
  return "editor";
};

export const isUserActive = (status) =>
  String(status || "active").trim().toLowerCase() !== "inactive";

export const hasPermission = (user, permissionKey) => {
  if (!isUserActive(user?.status)) return false;
  const isAdmin = normalizeUserRole(user?.role) === "admin";
  if (isAdmin) return true;
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  return permissions.includes(permissionKey);
};
