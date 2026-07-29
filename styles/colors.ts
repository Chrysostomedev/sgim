/**
 * SGIM — Design Tokens : Couleurs
 * -----------------------------------------------------------------------
 * Palette construite autour de deux teintes maritimes : le bleu marine
 * (autorité, nuit, salle d'opération) et le bleu eau (activité, présence,
 * signal vivant). Les couleurs fonctionnelles (détresse, alerte, sécurité)
 * restent volontairement sourdes — jamais criardes — pour rester lisibles
 * des heures durant sur un poste d'opérateur en veille continue.
 *
 * Usage : importer directement les objets, ou générer des variables CSS
 * (voir `toCssVariables` en bas de fichier) pour les consommer dans
 * Tailwind (`tailwind.config.ts` → theme.extend.colors) ou en CSS pur.
 */

// -----------------------------------------------------------------------
// Bleu Marine — couleur d'autorité : fonds sombres, en-têtes, texte fort
// -----------------------------------------------------------------------
export const navy = {
  50: "#EAF0F4",
  100: "#CFDEE7",
  200: "#A3C0D2",
  300: "#729FBB",
  400: "#4A7C9E",
  500: "#2F5C7D",
  600: "#204A68",
  700: "#163A54",
  800: "#0F2A3F",
  900: "#0A1E2E", // navy de référence — fond des consoles, headers
  950: "#061420", // quasi-noir marine — fond plein écran / mode nuit passerelle
} as const;

// -----------------------------------------------------------------------
// Bleu Eau — couleur vivante : accents, éléments actifs, liens, focus
// -----------------------------------------------------------------------
export const water = {
  50: "#EAF7FA",
  100: "#CDEDF4",
  200: "#9ADAE8",
  300: "#63C2D6",
  400: "#39A8C0",
  500: "#2790A8", // bleu eau de référence — CTA, accents, états actifs
  600: "#1E7690",
  700: "#195E74",
  800: "#164C5D",
  900: "#123D4A",
} as const;

// -----------------------------------------------------------------------
// Couleurs fonctionnelles — statuts opérationnels (sourdes, jamais fluo)
// -----------------------------------------------------------------------
export const signal = {
  distress: {
    50: "#FBEAE7",
    500: "#B3402F", // incident critique / MAYDAY — rouge de balise, pas de rouge web pur
    700: "#7E2C21",
  },
  warning: {
    50: "#FBF2E3",
    500: "#C98A2E", // priorité moyenne / pavillon d'alerte
    700: "#8F6320",
  },
  safe: {
    50: "#E9F3EC",
    500: "#3A7D5C", // personne saine et sauve / opération réussie
    700: "#295A41",
  },
  neutral_alert: {
    500: "#5B6B73", // information neutre, en attente de qualification
  },
} as const;

// -----------------------------------------------------------------------
// Neutres — papier, encre, bordures (pour le mode clair des interfaces
// de saisie, rapports imprimés, écrans desktop en usage prolongé)
// -----------------------------------------------------------------------
export const neutral = {
  paper: "#F4F6F5",
  paperMuted: "#E7EBEA",
  ink: "#10202A",
  inkMuted: "#4B5B62",
  border: "#C7D2D6",
  borderStrong: "#9FAEB3",
} as const;

// -----------------------------------------------------------------------
// Rôles sémantiques — ce que chaque écran doit réellement consommer
// (ne jamais référencer navy[900] directement dans un composant : passer
// par ces rôles pour que toute la charte reste modifiable en un point)
// -----------------------------------------------------------------------
export const colors = {
  navy,
  water,
  signal,
  neutral,

  // Mode console (tableau de bord, carte SIG, salle d'opération)
  background: navy[200],
  backgroundElevated: navy[500],
  surface: navy[800],
  border: navy[700],

  textPrimary: neutral.paper,
  textSecondary: water[200],
  textMuted: navy[300],

  accent: water[500],
  accentHover: water[400],
  accentSubtle: water[900],

  focusRing: water[300],

  // Mode papier (rapports, formulaires longs, cahier des charges)
  paperBackground: neutral.paper,
  paperSurface: "#FFFFFF",
  paperTextPrimary: neutral.ink,
  paperTextSecondary: neutral.inkMuted,
  paperBorder: neutral.border,

  // Statuts d'incident — à mapper depuis `incident_status.code` (backend)
  status: {
    ouvert: signal.neutral_alert[500],
    qualifie: water[500],
    valide: water[600],
    engage: signal.warning[500],
    cloture: signal.safe[500],
    archive: navy[400],
  },

  // Priorités — à mapper depuis `priority_level.code` (backend)
  priority: {
    critique: signal.distress[500],
    elevee: signal.warning[500],
    moderee: water[500],
    faible: navy[300],
  },
} as const;

export type ColorToken = typeof colors;

// -----------------------------------------------------------------------
// Helper — génère des variables CSS custom properties à partir des tokens
// (à injecter une fois dans le layout racine : document.documentElement)
// -----------------------------------------------------------------------
export function toCssVariables(): Record<string, string> {
  const flat: Record<string, string> = {};

  const walk = (obj: Record<string, unknown>, prefix: string) => {
    for (const [key, value] of Object.entries(obj)) {
      const varName = `${prefix}-${key}`;
      if (typeof value === "string") {
        flat[`--color${varName}`] = value;
      } else if (typeof value === "object" && value !== null) {
        walk(value as Record<string, unknown>, varName);
      }
    }
  };

  walk(colors, "");
  return flat;
}

export default colors;