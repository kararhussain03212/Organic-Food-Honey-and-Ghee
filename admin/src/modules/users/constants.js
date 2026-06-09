export const PERMISSION_OPTIONS = [
  {
    key: "create_content",
    label: "Create Content",
    description: "Can create new records, products, blogs, and other content.",
  },
  {
    key: "edit_content",
    label: "Edit Content",
    description: "Can modify existing records and update content.",
  },
  {
    key: "delete_content",
    label: "Delete Content",
    description: "Can permanently delete records and content.",
  },
  {
    key: "publish_content",
    label: "Publish Content",
    description: "Can toggle active/inactive status and publish or unpublish content.",
  },
];

export const ROLE_PERMISSIONS = {
  admin:  ["create_content", "edit_content", "delete_content", "publish_content"],
  editor: ["create_content", "edit_content", "publish_content"],
  viewer: [],
};

export const getDefaultPermissions = (role) =>
  ROLE_PERMISSIONS[String(role || "editor").toLowerCase()] ?? ROLE_PERMISSIONS.editor;

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
