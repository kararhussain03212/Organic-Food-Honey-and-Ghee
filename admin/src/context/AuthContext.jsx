import { useCallback, useEffect, useState } from "react";
import AuthContext from "./authContext";
import { changePasswordApi, loginApi, meApi, updateProfileApi } from "../api/authApi";

const ADMIN_ID = String(import.meta.env.VITE_ADMIN_ID || "").trim();
const TOKEN_KEY = "token";
const AUTH_USER_KEY = "authUser";
const CSRF_TOKEN_KEY = "csrfToken";

const normalizeEmail = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const SUPER_ADMIN_EMAIL = normalizeEmail(
  ADMIN_ID || "info@mafoodstufftrading.com",
);

const getLoginErrorMessage = (error) => {
  const apiError = String(
    error?.response?.data?.error || error?.response?.data?.message || "",
  ).trim();
  const fallback = String(error?.message || "Invalid credentials").trim();
  const message = apiError || fallback;

  if (/database connection failed/i.test(message)) {
    return "Database is unavailable. Start MySQL in XAMPP and try again.";
  }

  return message;
};

const normalizeRole = (value) => {
  const role = String(value || "")
    .trim()
    .toLowerCase();
  if (role === "super_admin") return "admin";
  if (role === "admin") return "admin";
  if (role === "") return "admin";
  return "editor";
};

const parseJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const isBackendUserId = (value) => {
  const normalized = String(value ?? "").trim();
  if (!normalized) return false;
  return /^[a-f0-9]{24}$/i.test(normalized) || /^[1-9]\d*$/.test(normalized);
};

const isUsableBackendToken = (token) => {
  const payload = parseJwtPayload(token);
  if (!payload) return false;

  if (!isBackendUserId(payload.sub ?? payload.id)) {
    return false;
  }

  if (payload.exp && Date.now() >= Number(payload.exp) * 1000) {
    return false;
  }

  return true;
};

const getStoredToken = () => {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  if (!isUsableBackendToken(storedToken)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
  return storedToken;
};

const getDefaultSuperAdmin = () => ({
  id: ADMIN_ID || SUPER_ADMIN_EMAIL || "super-admin",
  name: "Super Admin",
  email: SUPER_ADMIN_EMAIL,
  role: "admin",
});

const sanitizeUsers = (inputUsers) => {
  const rows = Array.isArray(inputUsers) ? inputUsers : [];

  const mapped = rows
    .filter((row) => row && row.id !== undefined && row.id !== null)
    .map((row) => {
      const email = normalizeEmail(row.email);
      const role =
        email === SUPER_ADMIN_EMAIL || row.isAdmin === true
          ? "admin"
          : normalizeRole(row.role);

      return {
        id: String(row.id).trim(),
        name: String(row.name || "").trim() || "Admin User",
        email,
        role,
        designation: String(row.designation || "").trim(),
        bio: String(row.bio || "").trim(),
        profile_photo: String(row.profile_photo || "").trim(),
        permissions: Array.isArray(row.permissions) ? row.permissions : [],
      };
    });

  const preferredSuperAdmin =
    mapped.find((u) => u.email === SUPER_ADMIN_EMAIL) ??
    mapped.find((u) => u.role === "admin") ??
    getDefaultSuperAdmin();

  const superAdmin = {
    ...preferredSuperAdmin,
    role: "admin",
    email: preferredSuperAdmin.email || SUPER_ADMIN_EMAIL,
    name: preferredSuperAdmin.name || "Super Admin",
    id: preferredSuperAdmin.id || ADMIN_ID || "super-admin",
  };

  const seen = new Set([
    `id:${superAdmin.id}`,
    `email:${normalizeEmail(superAdmin.email)}`,
  ]);

  const editors = [];
  mapped.forEach((item) => {
    if (normalizeRole(item.role) === "admin" && normalizeEmail(item.email) === normalizeEmail(superAdmin.email)) return;

    const idKey = `id:${item.id}`;
    const emailKey = `email:${normalizeEmail(item.email)}`;
    if (seen.has(idKey) || seen.has(emailKey)) return;

    seen.add(idKey);
    seen.add(emailKey);
    editors.push({ ...item, role: "editor" });
  });

  return [superAdmin, ...editors];
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken);
  const [users, setUsers] = useState([getDefaultSuperAdmin()]);
  const [user, setUser] = useState(() => {
    const currentToken = getStoredToken();
    if (!currentToken) return null;

    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleAuthLogout = () => {
      setToken(null);
      setUser(null);
      setUsers([getDefaultSuperAdmin()]);
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  const refreshUsers = async () => {
    const { data } = await meApi();
    const me = data?.data;

    if (!me || me.id === undefined || me.id === null) {
      const fallback = sanitizeUsers(user ? [user] : [getDefaultSuperAdmin()]);
      setUsers(fallback);
      return fallback;
    }

    const normalizedMe = {
      id: String(me.id),
      name: me.name || user?.name || "Admin",
      email: normalizeEmail(me.email || user?.email || SUPER_ADMIN_EMAIL),
      role: normalizeRole(me.role || user?.role || (normalizeEmail(me.email) === SUPER_ADMIN_EMAIL ? "admin" : "editor")),
      designation: String(me.designation || user?.designation || "").trim(),
      bio: String(me.bio || user?.bio || "").trim(),
      profile_photo: String(me.profile_photo || user?.profile_photo || "").trim(),
      status: String(me.status || user?.status || "active").trim(),
      permissions: Array.isArray(me.permissions) ? me.permissions : (Array.isArray(user?.permissions) ? user.permissions : []),
    };

    const sanitized = sanitizeUsers([normalizedMe]);
    setUsers(sanitized);
    setUser((prev) => ({ ...(prev || {}), ...normalizedMe }));
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...(user || {}), ...normalizedMe }));
    return sanitized;
  };

  useEffect(() => {
    if (!token) return;

    refreshUsers().catch(() => {
      // Keep current users state if backend list call fails.
    });
  }, [token]);

  const login = async (emailOrId, password) => {
    const credential = (emailOrId || "").trim();
    const secret = (password || "").trim();

    if (!credential || !secret) {
      throw new Error("ID/email and password are required");
    }

    const normalizedCredential = normalizeEmail(credential);
    const loginEmail = normalizedCredential.includes("@")
      ? normalizedCredential
      : normalizeEmail(ADMIN_ID) === normalizedCredential
        ? SUPER_ADMIN_EMAIL
        : normalizedCredential;

    const doBackendLogin = async () => {
      const { data } = await loginApi({ email: loginEmail, password: secret });
      const payload = data?.data || {};
      const nextToken = payload?.token || data?.token;

      if (!nextToken) {
        throw new Error("Login failed: API response did not include a token. Check admin API URL/deployment.");
      }

      const jwtPayload = parseJwtPayload(nextToken);
      const backendUserId =
        jwtPayload?.sub === undefined || jwtPayload?.sub === null
          ? null
          : String(jwtPayload.sub);
      const backendEmail = normalizeEmail(
        payload?.admin?.email || data?.admin?.email || data?.email || loginEmail,
      );
      const sessionRole =
        normalizeRole(payload?.admin?.role || data?.admin?.role || (backendEmail === SUPER_ADMIN_EMAIL ? "admin" : "admin"));

      const sessionUser = {
        id: backendUserId || backendEmail,
        name: payload?.admin?.name || data?.admin?.name || data?.name || "Admin",
        email: backendEmail,
        role: sessionRole,
        designation: "",
        bio: "",
        profile_photo: "",
        status: String(payload?.admin?.status || data?.admin?.status || "active"),
        permissions: Array.isArray(payload?.admin?.permissions) ? payload.admin.permissions : [],
      };

      localStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
      const csrfToken = String(payload?.csrf_token || data?.csrf_token || "").trim();
      if (csrfToken) {
        localStorage.setItem(CSRF_TOKEN_KEY, csrfToken);
      } else {
        localStorage.removeItem(CSRF_TOKEN_KEY);
      }
      setToken(nextToken);
      setUser(sessionUser);
      await refreshUsers();
    };

    try {
      await doBackendLogin();
    } catch (error) {
      throw new Error(getLoginErrorMessage(error));
    }
  };

  const updateProfile = async ({ name, email, designation = "", bio = "", profile_photo = "" }) => {
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    const nextName = (name || "").trim();
    const nextEmail = normalizeEmail(email);

    if (!nextName) {
      throw new Error("Name is required");
    }

    const { data } = await updateProfileApi({
      name: nextName,
      email: nextEmail || user.email,
      designation: String(designation || "").trim(),
      bio: String(bio || "").trim(),
      profile_photo: String(profile_photo || "").trim(),
    });

    const payload = data?.data || {};
    const nextSessionUser = {
      ...user,
      name: payload.name || nextName,
      email: payload.email || nextEmail || user.email,
      role: normalizeRole(payload.role || user.role),
      designation: String(payload.designation || "").trim(),
      bio: String(payload.bio || "").trim(),
      profile_photo: String(payload.profile_photo || "").trim(),
      status: String(payload.status || user.status || "active"),
    };

    setUser(nextSessionUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextSessionUser));

    setUsers((prev) =>
      prev.map((item) =>
        String(item.id) === String(user.id)
          ? { ...item, name: nextSessionUser.name, email: nextSessionUser.email }
          : item,
      ),
    );
  };

  const changePassword = async ({ currentPassword, nextPassword }) => {
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    const current = (currentPassword || "").trim();
    const next = (nextPassword || "").trim();

    if (!current || !next) {
      throw new Error("Current and new password are required");
    }

    if (next.length < 6) {
      throw new Error("New password must be at least 6 characters");
    }

    await changePasswordApi({
      current_password: current,
      new_password: next,
    });
  };

  const createUser = async ({ name, email, password }) => {
    if (normalizeRole(user?.role) !== "admin") {
      throw new Error("Only super admin can create accounts");
    }

    const nextName = String(name || "").trim();
    const nextEmail = normalizeEmail(email);
    const nextPassword = String(password || "").trim();

    if (!nextName || !nextEmail || !nextPassword) {
      throw new Error("Name, email and password are required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      throw new Error("Enter a valid email address");
    }

    if (nextPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    throw new Error("Create account endpoint is not available in this backend yet.");
  };

  const deleteUser = async (targetId) => {
    if (normalizeRole(user?.role) !== "admin") {
      throw new Error("Only super admin can delete accounts");
    }

    const nextTargetId = String(targetId || "").trim();
    if (!nextTargetId) {
      throw new Error("User ID is required");
    }

    if (String(nextTargetId) === String(user?.id)) {
      throw new Error("You cannot delete your own account");
    }

    throw new Error("Delete account endpoint is not available in this backend yet.");
  };

  const can = useCallback((permission) => {
    if (!user) return false;
    if (String(user.status || "active").toLowerCase() === "inactive") return false;
    if (normalizeRole(user.role) === "admin") return true;
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];
    return permissions.includes(permission);
  }, [user]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(CSRF_TOKEN_KEY);
    setToken(null);
    setUser(null);
    setUsers([getDefaultSuperAdmin()]);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        users,
        login,
        logout,
        can,
        createUser,
        deleteUser,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

