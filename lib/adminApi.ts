const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "/api";

export interface LoginChallenge {
  step: "verify_2fa" | "setup_2fa";
  challenge_token: string;
}

export interface TotpSetup {
  secret: string;
  otpauth_url: string;
  qr_code_data_url: string;
}

export interface AdminMe {
  id: number;
  email: string;
  last_login_at: string | null;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    let detail = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") detail = data.detail;
    } catch {
      // body may not be JSON
    }
    const err = new Error(detail) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const adminApi = {
  login: (email: string, password: string) =>
    request<LoginChallenge>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  setup2fa: (challengeToken: string) =>
    request<TotpSetup>("/auth/2fa/setup", {
      method: "POST",
      body: JSON.stringify({ challenge_token: challengeToken }),
    }),
  verify2fa: (challengeToken: string, code: string) =>
    request<AdminMe>("/auth/2fa/verify", {
      method: "POST",
      body: JSON.stringify({ challenge_token: challengeToken, code }),
    }),
  logout: () => request<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  me: () => request<AdminMe>("/auth/me"),
};
