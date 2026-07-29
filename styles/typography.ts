/**
 * SGIM — Design Tokens : Typographie
 * -----------------------------------------------------------------------
 * Trois registres, chacun avec un rôle opérationnel précis — jamais
 * décoratif :
 *
 *  1. DISPLAY  — "Big Shoulders Display" : condensée, taillée à angles
 *     vifs. Référence directe aux chiffres de marque de tirant d'eau
 *     peints sur la coque d'un navire (draft marks) — la seule typo du
 *     système qui a le droit d'être physique et massive. Réservée aux
 *     titres de module, aux numéros de référence d'incident, aux
 *     libellés de type d'incident (MAYDAY, PAN PAN...).
 *
 *  2. TEXTE    — "Public Sans" : humaniste, conçue pour les interfaces
 *     de service public à forte exigence de lisibilité. C'est la voix
 *     neutre et sûre de l'interface : formulaires, fiches, rapports.
 *
 *  3. DONNÉES  — "Martian Mono" : chiffres tabulaires, à l'esprit
 *     console radar / téléscripteur. Réservée aux coordonnées GPS,
 *     horodatages, identifiants, statuts de synchronisation — tout ce
 *     qui doit se lire comme un relevé instrumental, pas comme de la prose.
 *
 * Polices via next/font/google (Next.js) ou <link> Google Fonts :
 *   Big Shoulders Display · Public Sans · Martian Mono
 */

export const fontFamily = {
  display: "'Big Shoulders Display', 'Arial Narrow', sans-serif",
  body: "'Public Sans', system-ui, -apple-system, sans-serif",
  mono: "'Martian Mono', 'IBM Plex Mono', ui-monospace, monospace",
} as const;

export const fontWeight = {
  display: {
    bold: 700,
    black: 900,
  },
  body: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  mono: {
    regular: 400,
    medium: 500,
  },
} as const;

/**
 * Échelle de taille — base 16px, ratio ~1.25 (quarte juste), à l'exception
 * du display qui saute des paliers plus larges : c'est un registre
 * d'affiche, pas un registre de lecture continue.
 */
export const fontSize = {
  displayXl: "4.5rem", // 72px — écran d'accueil / signature de module
  displayLg: "3rem", // 48px — titres de section pleine page
  displayMd: "2.25rem", // 36px — en-tête de fiche incident
  displaySm: "1.75rem", // 28px — sous-titres de module

  h1: "1.75rem", // 28px
  h2: "1.375rem", // 22px
  h3: "1.125rem", // 18px

  bodyLg: "1.0625rem", // 17px — texte de lecture longue (cahier des charges, rapports)
  body: "0.9375rem", // 15px — texte d'interface standard
  bodySm: "0.8125rem", // 13px — libellés, aides contextuelles
  caption: "0.75rem", // 12px — légendes, métadonnées

  dataLg: "1.125rem", // 18px — heure, référence incident en avant
  data: "0.875rem", // 14px — coordonnées, timestamps en contexte
  dataSm: "0.75rem", // 12px — identifiants techniques, logs
} as const;

export const lineHeight = {
  display: 1.0,
  heading: 1.2,
  body: 1.55,
  data: 1.4,
} as const;

/**
 * Le display condensé se lit mal serré à la française : on lui rend de
 * l'air en majuscules. Le mono, lui, se resserre légèrement pour que les
 * relevés de coordonnées ne "flottent" pas.
 */
export const letterSpacing = {
  displayUppercase: "0.04em",
  displayNormal: "-0.01em",
  heading: "-0.01em",
  body: "0em",
  mono: "-0.02em",
  monoLabel: "0.06em", // pour les libellés courts en capitales (ex. "SAR-01")
} as const;

/**
 * Styles de texte composites — ce que les composants doivent réellement
 * consommer (`textStyles.incidentReference`, pas un assemblage manuel de
 * fontSize + fontFamily à chaque usage).
 */
export const textStyles = {
  // -- Display --
  pageTitle: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.displayLg,
    fontWeight: fontWeight.display.black,
    lineHeight: lineHeight.display,
    letterSpacing: letterSpacing.displayNormal,
    textTransform: "none",
  },
  moduleTitle: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.displayMd,
    fontWeight: fontWeight.display.bold,
    lineHeight: lineHeight.display,
    letterSpacing: letterSpacing.displayNormal,
  },
  incidentTypeLabel: {
    // ex. "MAYDAY", "NAUFRAGE" — traité comme un pavillon de signalisation
    fontFamily: fontFamily.display,
    fontSize: fontSize.displaySm,
    fontWeight: fontWeight.display.black,
    letterSpacing: letterSpacing.displayUppercase,
    textTransform: "uppercase" as const,
  },
  incidentReference: {
    // ex. "SGIM-2026-000123" — frappé comme une marque de coque
    fontFamily: fontFamily.display,
    fontSize: fontSize.dataLg,
    fontWeight: fontWeight.display.bold,
    letterSpacing: letterSpacing.monoLabel,
    fontFeatureSettings: '"tnum" 1',
  },

  // -- Texte --
  h1: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.h1,
    fontWeight: fontWeight.body.bold,
    lineHeight: lineHeight.heading,
    letterSpacing: letterSpacing.heading,
  },
  h2: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.body.semibold,
    lineHeight: lineHeight.heading,
  },
  h3: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.body.semibold,
    lineHeight: lineHeight.heading,
  },
  bodyLong: {
    // rapports, cahier des charges, fiches de lecture longue
    fontFamily: fontFamily.body,
    fontSize: fontSize.bodyLg,
    fontWeight: fontWeight.body.regular,
    lineHeight: lineHeight.body,
  },
  bodyDefault: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: fontWeight.body.regular,
    lineHeight: lineHeight.body,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.body.medium,
    lineHeight: lineHeight.body,
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.body.regular,
    lineHeight: lineHeight.body,
  },

  // -- Données / instrumentation --
  coordinateReadout: {
    // ex. "05°17'21.5"N  004°00'44.3"W"
    fontFamily: fontFamily.mono,
    fontSize: fontSize.data,
    fontWeight: fontWeight.mono.regular,
    letterSpacing: letterSpacing.mono,
    fontFeatureSettings: '"tnum" 1',
  },
  timestamp: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.dataSm,
    fontWeight: fontWeight.mono.regular,
    letterSpacing: letterSpacing.mono,
    fontFeatureSettings: '"tnum" 1',
  },
  syncStatus: {
    // ex. "SYNC · MRSC-SP · 14:02:31Z"
    fontFamily: fontFamily.mono,
    fontSize: fontSize.dataSm,
    fontWeight: fontWeight.mono.medium,
    letterSpacing: letterSpacing.monoLabel,
    textTransform: "uppercase" as const,
  },
} as const;

export type TextStyleToken = typeof textStyles;

export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  textStyles,
} as const;

export default typography;