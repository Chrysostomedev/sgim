/**
 * SGIM — Design System helpers (compatibilité legacy)
 * -----------------------------------------------------------------------
 * Fournit les helpers de couleur pour les composants hérités qui
 * consomment `getStatusColorClass` / `getPriorityColorClass`.
 *
 * Ces fonctions traduisent les statuts et priorités opérationnels en
 * classes CSS Tailwind, en s'appuyant sur les tokens du fichier
 * `styles/colors.ts` (couleurs signal sourdes, jamais fluos).
 */

import { colors } from "@/styles/colors";

export function getStatusColorClass(status: string): string {
  const s = (status || "").toLowerCase();
  switch (s) {
    case "active":
    case "actif":
    case "open":
    case "ouvert":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "pending":
    case "attente":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "resolved":
    case "résolu":
    case "cloture":
      return "bg-slate-100 text-slate-700 border border-slate-200";
    case "engage":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

export function getPriorityColorClass(priority: string): string {
  const p = (priority || "").toLowerCase();
  switch (p) {
    case "critical":
    case "critique":
      return "bg-red-50 text-red-700 border border-red-200";
    case "high":
    case "haute":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    case "medium":
    case "moyenne":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "low":
    case "basse":
      return "bg-slate-100 text-slate-600 border border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
}

export { colors };
