import Cookies from "js-cookie";

const TOKEN_COOKIE = "token";

export function setToken(token: string): void {
  Cookies.set(TOKEN_COOKIE, token, { expires: 1 / 3, sameSite: "lax" });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE);
}

export function clearToken(): void {
  Cookies.remove(TOKEN_COOKIE);
}
