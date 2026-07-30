/**
 * SGIM — Helpers d'erreur statique
 * 100% statique, plus de dépendance API, plus d'erreur build
 */

export function parseApiError(err: unknown): string {
  if (err == null) return "Une erreur inconnue est survenue.";

  if (typeof err === "string") return err.trim() || "Une erreur est survenue.";

  if (err instanceof Error) {
    return err.message?.trim() || "Une erreur est survenue.";
  }

  if (typeof err === "object") {
    const e = err as Record<string, unknown>;

    if (typeof e.message === "string" && e.message.trim()) {
      return e.message;
    }

    // Cas axios-like { response: { data: { message } } } mais en statique
    const response = e.response as Record<string, unknown> | undefined;
    if (response) {
      const data = response.data as Record<string, unknown> | undefined;
      if (data && typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }
    }
  }

  return "Une erreur est survenue.";
}

export default parseApiError;