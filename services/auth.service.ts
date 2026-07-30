const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = new Error("Request failed") as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export const authService = {
  async login(payload: { email: string; password: string }) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async forgotPassword(payload: { email: string }) {
    return request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async verifyOtp(payload: { email: string; otp: string }) {
    return request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
