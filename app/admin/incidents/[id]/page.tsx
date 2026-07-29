"use client";

import { colors } from "@/styles/colors";
import { textStyles } from "@/styles/typography";
import { useRouter } from "next/navigation";

interface IncidentDetail {
  ref: string;
  type: string;
  priorite: "critique" | "elevee" | "moderee" | "faible";
  statut: "ouvert" | "qualifie" | "valide" | "engage" | "cloture" | "archive";
  centre: string;
  position: string;
  ouvre: string;
  description: string;
}

const mockIncident: IncidentDetail = {
  ref: "SGIM-2026-000123",
  type: "MAYDAY",
  priorite: "critique",
  statut: "engage",
  centre: "MRCC Abidjan",
  position: "05°17'21.5\"N  004°00'44.3\"W",
  ouvre: "2026-07-29T13:42:11Z",
  description:
    "Voilier en détresse, voie d'eau dans la coque, 3 personnes à bord, besoin d'assistance immédiate.",
};

export default function AdminIncidentDetailPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.background }}
    >
      <button
        onClick={() => router.back()}
        className="mb-4 text-xs font-bold"
        style={{ color: colors.textMuted }}
      >
        ← Retour
      </button>

      <div
        className="p-6 rounded"
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <span
            style={{
              ...textStyles.incidentReference,
              color: colors.textPrimary,
            }}
          >
            {mockIncident.ref}
          </span>
          <span
            style={{
              ...textStyles.incidentTypeLabel,
              color: colors.priority[mockIncident.priorite],
            }}
          >
            {mockIncident.type}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p style={{ ...textStyles.caption, color: colors.textMuted }}>
              Priorité
            </p>
            <p
              style={{
                ...textStyles.bodyDefault,
                color: colors.priority[mockIncident.priorite],
              }}
            >
              {mockIncident.priorite}
            </p>
          </div>
          <div>
            <p style={{ ...textStyles.caption, color: colors.textMuted }}>
              Statut
            </p>
            <p
              style={{
                ...textStyles.bodyDefault,
                color: colors.status[mockIncident.statut],
              }}
            >
              {mockIncident.statut}
            </p>
          </div>
          <div>
            <p style={{ ...textStyles.caption, color: colors.textMuted }}>
              Centre
            </p>
            <p
              style={{
                ...textStyles.bodyDefault,
                color: colors.textSecondary,
              }}
            >
              {mockIncident.centre}
            </p>
          </div>
          <div>
            <p style={{ ...textStyles.caption, color: colors.textMuted }}>
              Position
            </p>
            <p
              style={{
                ...textStyles.coordinateReadout,
                color: colors.textPrimary,
              }}
            >
              {mockIncident.position}
            </p>
          </div>
          <div>
            <p style={{ ...textStyles.caption, color: colors.textMuted }}>
              Ouvert
            </p>
            <p
              style={{
                ...textStyles.timestamp,
                color: colors.textMuted,
              }}
            >
              {mockIncident.ouvre}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p style={{ ...textStyles.caption, color: colors.textMuted }}>
            Description
          </p>
          <p
            style={{
              ...textStyles.bodyLong,
              color: colors.textPrimary,
            }}
          >
            {mockIncident.description}
          </p>
        </div>
      </div>
    </div>
  );
}
