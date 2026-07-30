/**
 * SGIM — Helpers stockage / fichiers statique
 * Aucun import lib/, cookies, API
 */

export function resolveStorageUrl(url: string | undefined | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed.replace(/^\/+/, "")}`;
}

export function fileExtension(name: string): string {
  if (!name) return "";
  const clean = name.split("?")[0].split("#")[0];
  const parts = clean.split(".");
  return parts.length > 1? (parts.pop()?? "").toLowerCase() : "";
}

export function fileName(path: string): string {
  if (!path) return "";
  const clean = path.split("?")[0].split("#")[0];
  const parts = clean.split("/");
  return parts.pop()?? clean;
}