"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import DataTable, { ColumnConfig } from "@/components/data/DataTable";
import SideDetailsPanel from "@/components/SideDetailsPanel";
import { Eye } from "lucide-react";
import LayoutShell from "@/components/LayoutShell";
import { incidentsStats, recentIncidents, incidentsColumns } from "@/data/incidents";

interface IncidentRow {
  id: number;
  reference: string;
  type: string;
  priorite: string;
  statut: string;
  centre: string;
  ouvert: string;
  sujet: string;
}

export default function OperateurDashboardPage() {
  const [selectedIncident, setSelectedIncident] = useState<IncidentRow | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const columns: ColumnConfig<IncidentRow>[] = [
    ...incidentsColumns,
    {
      header: "Actions",
      key: "actions",
      render: (_: IncidentRow, row: IncidentRow) => (
        <button
          onClick={() => { setSelectedIncident(row); setIsPanelOpen(true); }}
          className="p-2 rounded-xl bg-slate-900 text-white hover:bg-black transition flex items-center justify-center"
          aria-label={`Voir détail incident ${row.reference}`}
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  const fields = selectedIncident
    ? [
        { label: "Référence", value: selectedIncident.reference },
        { label: "Type", value: selectedIncident.type },
        { label: "Sujet", value: selectedIncident.sujet },
        { label: "Priorité", value: selectedIncident.priorite },
        { label: "Statut", value: selectedIncident.statut },
        { label: "Centre", value: selectedIncident.centre },
        { label: "Date d'ouverture", value: selectedIncident.ouvert },
      ]
    : [];

  return (
    <LayoutShell>
      <PageHeader title="Suivi opérationnel" subtitle="Opérations SAR en cours" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {incidentsStats.slice(0, 3).map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <DataTable
          title="Opérations en cours"
          columns={columns}
          data={recentIncidents}
          onViewAll={() => (window.location.href = "/operateur/dashboard")}
        />
      </div>

      <SideDetailsPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={selectedIncident?.reference ?? ""}
        subtitle={selectedIncident?.sujet}
        reference={selectedIncident?.reference}
        fields={fields}
        descriptionContent={selectedIncident?.sujet ? `<p>${selectedIncident.sujet}</p>` : undefined}
        redirectHref={selectedIncident ? `/admin/incidents/${selectedIncident.id}` : "#"}
        redirectLabel="Voir le détail de l'opération"
      />
    </LayoutShell>
  );
}
