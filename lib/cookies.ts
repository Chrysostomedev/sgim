/**
 * SGIM — Cookie/Storage statique
 * Plus d'erreur TypeScript, plus de lib/, 100% localStorage
 */

type UserLite = { id?: string; role?: string; email?: string; [key: string]: unknown } | null;

const SAFE_PARSE = (value: string | null): UserLite => {
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
};

export const cookieFunctions = {
  getUser: (): UserLite => {
    if (typeof window === "undefined") return null;
    return SAFE_PARSE(localStorage.getItem("user"));
  },

  getUserRole: (): string => {
    if (typeof window === "undefined") return "ADMIN";
    const direct = localStorage.getItem("user_role");
    if (direct) return direct;
    const user = SAFE_PARSE(localStorage.getItem("user"));
    return (user?.role as string) ?? "ADMIN";
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("auth_token");
  },

  // ── helpers statiques optionnels pour compat legacy ──
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },

  setToken: (token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", token);
  },

  setUser: (user: unknown) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
    const role = (user as any)?.role;
    if (role) localStorage.setItem("user_role", role);
  },

  clearAll: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_role");
  },
};

export default cookieFunctions;