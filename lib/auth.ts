import type { User } from "./types";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("elms_token");
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("elms_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: User) {
  localStorage.setItem("elms_token", token);
  localStorage.setItem("elms_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("elms_token");
  localStorage.removeItem("elms_user");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
