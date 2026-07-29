"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import DataTable, { ColumnConfig } from "@/components/data/DataTable";
import SideDetailsPanel from "@/components/SideDetailsPanel";
import { Eye } from "lucide-react";
import LayoutShell from "@/components/LayoutShell";
import { dashboardStats, recentIncidents } from "@/data/dashboard";

interface DashboardIncident {
  id: number;
  reference: string;
  type: string;
  priorite: string;
  statut: string;
  centre: string;
  ouvert: string;
  sujet: string;
}

const STATUS_STYLES: Record<string, string> = {
  en_cours: "border-orange-400 text-orange-600 bg-orange-50",
  valide: "border-blue-400 text-blue-600 bg-blue-50",
  engage: "border-purple-400 text-purple-600 bg-purple-50",
  cloture: "bg-black text-white border-black",
  archive: "border-slate-300 text-slate-600 bg-slate-50",
};

export default function AdminDashboardPage() {
  const [selectedIncident, setSelectedIncident] = useState<DashboardIncident | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const columns: ColumnConfig<DashboardIncident>[] = [
    { header: "Référence", key: "reference", render: (v) => <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg whitespace-nowrap">{v ?? "-"}</span> },
    { header: "Type", key: "type", render: (v) => <span className="text-sm font-bold text-slate-900">{v ?? "-"}</span> },
    { header: "Priorité", key: "priorite", render: (v) => {
      const color = v === "critique" ? "text-red-600 bg-red-50 border-red-200" : v === "elevee" ? "text-orange-600 bg-orange-50 border-orange-200" : "text-slate-600 bg-slate-50 border-slate-200";
      return <span className={`px-3 py-1 rounded-xl border text-xs font-bold ${color}`}>{v ?? "-"}</span>;
    }},
    { header: "Statut", key: "statut", render: (v) => <span className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1.5 rounded-xl border text-xs font-bold ${STATUS_STYLES[v] ?? "border-slate-300 text-slate-700 bg-slate-100"}`}>{v ?? "-"}</span> },
    { header: "Centre", key: "centre", render: (v) => <span className="text-sm text-slate-600">{v ?? "-"}</span> },
    { header: "Ouvert", key: "ouvert", render: (v) => <span className="text-xs text-slate-500 whitespace-nowrap">{v ?? "-"}</span> },
    {
      header: "Actions",
      key: "actions",
      render: (_: DashboardIncident, row: DashboardIncident) => (
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
      <PageHeader title="Tableau de bord opérationnel" subtitle="MRCC Abidjan · MRSC San Pedro" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {dashboardStats.slice(0, 3).map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {dashboardStats.slice(3).map((stat, i) => (
          <StatsCard key={i + 3} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4">
          <h3 className="text-base font-bold text-slate-800">Derniers incidents</h3>
        </div>
        <DataTable
          title="Liste des incidents récents"
          columns={columns}
          data={recentIncidents}
          onViewAll={() => (window.location.href = "/admin/incidents")}
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
        redirectLabel="Voir le détail de l'incident"
      />
    </LayoutShell>
  );
}
