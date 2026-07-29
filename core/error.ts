/**
 * SGIM — Helpers d'erreur (compatibilité legacy)
 * -----------------------------------------------------------------------
 * Traduction centralisée des erreurs backend en messages FR lisibles.
 */

export function parseApiError(err: unknown): string {
  if (err == null) return "Une erreur inconnue est survenue.";

  if (typeof err === "string") return err;

  if (err instanceof Error) {
    return err.message || "Une erreur est survenue.";
  }

  const anyErr = err as Record<string, unknown>;

  if (anyErr.message && typeof anyErr.message === "string") {
    return anyErr.message;
  }

  if (anyErr.response) {
    const resp = anyErr.response as Record<string, unknown>;
    if (resp.data) {
      const data = resp.data as Record<string, unknown>;
      if (data.message && typeof data.message === "string") {
        return data.message;
      }
    }
  }

  return "Une erreur est survenue.";
}

export default parseApiError;
