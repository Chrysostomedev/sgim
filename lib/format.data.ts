/**
 * SGIM — Formatage dates statique
 * 100% local, pas d'import lib/, pas d'API
 */

export function formatDateFR(iso: string | Date | undefined | null): string {
  if (!iso) return "";
  const d = iso instanceof Date ? iso : new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatDateShort(iso: string | Date | undefined | null): string {
  if (!iso) return "";
  const d = iso instanceof Date ? iso : new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function formatDatetime(iso: string | Date | undefined | null): string {
  if (!iso) return "";
  const d = iso instanceof Date ? iso : new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// alias au cas où ton code appelle formatDateTime avec majuscule
export const formatDateTime = formatDatetime;