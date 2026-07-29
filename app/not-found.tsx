"use client";

import { colors } from "@/styles/colors";
import { textStyles } from "@/styles/typography";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="text-center">
        <p
          style={{
            ...textStyles.incidentReference,
            color: colors.textMuted,
          }}
        >
          404
        </p>
        <h1
          className="mt-4 mb-2"
          style={{
            ...textStyles.moduleTitle,
            color: colors.textPrimary,
          }}
        >
          Page introuvable
        </h1>
        <p
          className="mb-6"
          style={{
            ...textStyles.bodyDefault,
            color: colors.textSecondary,
          }}
        >
          La page demandée n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-block py-2 px-4 rounded"
          style={{
            backgroundColor: colors.accent,
            color: colors.textPrimary,
          }}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
