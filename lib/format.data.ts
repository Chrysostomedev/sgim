/**
 * SGIM — Helpers de formatage de données (compatibilité legacy)
 * -----------------------------------------------------------------------
 * Fonctions utilitaires référencées par les composants hérités via
 * `@/lib/format.data`.
 */

export function formatDateShort(date?: string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDate(date?: string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatCurrency(value?: number | string | null): string {
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (isNaN(n)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(n);
}

export default {
  formatDateShort,
  formatDate,
  formatCurrency,
};
