"use client";

import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import LayoutShell from "@/components/LayoutShell";
import { profilStats, recentActivities } from "@/data/profil";
import DataTable, { ColumnConfig } from "@/components/data/DataTable";

interface ActivityItem {
  id: number;
  action: string;
  incident: string;
  date: string;
}

const activityColumns: ColumnConfig<ActivityItem>[] = [
  { header: "Action", key: "action", render: (v) => <span className="text-sm font-bold text-slate-900">{v ?? "-"}</span> },
  { header: "Incident", key: "incident", render: (v) => <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{v ?? "-"}</span> },
  { header: "Date", key: "date", render: (v) => <span className="text-xs text-slate-500 whitespace-nowrap">{v ?? "-"}</span> },
];

export default function ProfilPage() {
  return (
    <LayoutShell>
      <PageHeader title="Profil opérateur" subtitle="MRCC Abidjan · Opérateur" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {profilStats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4">Informations personnelles</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nom</p>
              <p className="text-sm font-bold text-slate-900">Dupont</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Prénom</p>
              <p className="text-sm font-bold text-slate-900">Marie</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Centre</p>
              <p className="text-sm font-bold text-slate-900">MRCC Abidjan</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rôle</p>
              <p className="text-sm font-bold text-slate-900">Opérateur</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable
            title="Activités récentes"
            columns={activityColumns}
            data={recentActivities as ActivityItem[]}
          />
        </div>
      </div>
    </LayoutShell>
  );
}
