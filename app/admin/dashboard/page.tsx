"use client";

import { useState, useMemo } from "react";
import { Anchor } from "lucide-react";
import BarChartCard from "@/components/cards/BarChartCard";
import DonutCard from "@/components/cards/DonutCard";
import { CrudTable, type CrudColumn } from "@/components/data/CrudTable";

// DATA marine statique
const DATA = {
  stats: { activeBoursesCount: 12 },
  partners: [
    { id: 1, name: "Port Autonome Abidjan", is_featured: true },
    { id: 2, name: "Bolloré Logistics", is_featured: true },
    { id: 3, name: "Marine Marchande", is_featured: false },
  ],
  featured: [
    { id: 5, title: "Escorte convoi lagunaire", date: "12/06/2026", status: "En cours" },
    { id: 6, title: "Patrouille côtière", date: "14/06/2026", status: "Planifié" },
  ],
  recentPosts: [
    { id: 1, title: "Rapport patrouille 12/06" },
    { id: 2, title: "Maintenance vedette B" },
  ],
  missions: [
    { id: 1, codification: "MAR-001", site: "Port Bouët", responsable: "Cdt Koné", status: "EN_COURS" },
    { id: 2, codification: "MAR-002", site: "Vridi Canal", responsable: "Lt Diallo", status: "PLANIFIÉ" },
    { id: 3, codification: "MAR-003", site: "Bassam", responsable: "Cdt Traoré", status: "RÉALISÉ" },
    { id: 4, codification: "MAR-004", site: "Jacqueville", responsable: "Lt Bamba", status: "EN_RETARD" },
  ]
};

function LineChartCard({ title, data }: { title: string, data: { label: string, value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.value / max) * 80}`).join(" ");
  return (
    <div className="bg-white rounded-2xl border border-[#c9efed] shadow-sm p-6 h-full">
      <h3 className="font-black text-[#0f2e2d] text-">{title}</h3>
      <p className="text- text-[#5fb8b5] mb-6">Activité marine - 6 mois</p>
      <svg viewBox="0 0 100 100" className="w-full h- overflow-visible">
        <polyline fill="none" stroke="#e0f7f6" strokeWidth="2" points={points} />
        <polyline fill="none" stroke="#0FB5B1" strokeWidth="2.5" strokeLinecap="round" points={points} />
        {data.map((_, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - (data[i].value / max) * 80;
          return <circle key={i} cx={x} cy={y} r="3" fill="#0FB5B1" stroke="white" strokeWidth="2" />
        })}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map(d => <span key={d.label} className="text- font-black text-[#8ecfcf]">{d.label}</span>)}
      </div>
    </div>
  )
}

export default function MarineDashboardPage() {
  const [search, setSearch] = useState("");
  const boursesActives = DATA.stats.activeBoursesCount;
  const partenairesCount = DATA.partners.length;

  const barData = [
    { label: "Jan", value: 2, color: "#0FB5B1" },
    { label: "Fév", value: 4, color: "#0e8a87" },
    { label: "Mar", value: 3, color: "#0FB5B1" },
    { label: "Avr", value: 6, color: "#b2e8e5" },
    { label: "Mai", value: 5, color: "#0FB5B1" },
    { label: "Juin", value: 8, color: "#0e8a87" },
  ];

  const lineData = [
    { label: "Fév", value: 2 }, { label: "Mar", value: 4 },
    { label: "Avr", value: 3 }, { label: "Mai", value: 6 },
    { label: "Juin", value: 5 }, { label: "Juil", value: 9 },
  ];

  const columns: CrudColumn<(typeof DATA.missions)[0]>[] = [
    { header: "Codification", key: "codification" },
    { header: "Site", key: "site" },
    { header: "Responsable", key: "responsable" },
    {
      header: "Statut",
      key: "status",
      render: (item) => {
        const color = item.status === "EN_COURS"? "#0e8a87" : item.status === "EN_RETARD"? "#F25C5C" : item.status === "RÉALISÉ"? "#10b981" : "#0FB5B1";
        return <span className="px-2 py-1 rounded-full text- font-bold" style={{ backgroundColor: `${color}18`, color }}>{item.status}</span>
      }
    },
  ];

  const filteredMissions = useMemo(() => {
    if (!search) return DATA.missions;
    const q = search.toLowerCase();
    return DATA.missions.filter(m => m.codification.toLowerCase().includes(q) || m.site.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="p-6 space-y-6 bg-[#f0fbfb] min-h-screen">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#0FB5B1] flex items-center justify-center shadow-md">
          <Anchor className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#0f2e2d]">Marine Dashboard</h1>
          <p className="text-xs text-[#5fb8b5]">Turquoise · {boursesActives} missions actives</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#c9efed] p-5 shadow-sm"><p className="text- font-black uppercase text-[#0FB5B1]">Missions actives</p><p className="text-3xl font-black text-[#0f2e2d] mt-2">{boursesActives}</p></div>
        <div className="bg-white rounded-2xl border border-[#c9efed] p-5 shadow-sm"><p className="text- font-black uppercase text-[#0FB5B1]">Partenaires</p><p className="text-3xl font-black text-[#0f2e2d] mt-2">{partenairesCount}</p></div>
        <div className="bg-white rounded-2xl border border-[#c9efed] p-5 shadow-sm"><p className="text- font-black uppercase text-[#0FB5B1]">Patrouilles vedettes</p><p className="text-3xl font-black text-[#0f2e2d] mt-2">{DATA.featured.length}</p></div>
        <div className="bg-white rounded-2xl border border-[#c9efed] p-5 shadow-sm"><p className="text- font-black uppercase text-[#0FB5B1]">Rapports</p><p className="text-3xl font-black text-[#0f2e2d] mt-2">{DATA.recentPosts.length}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BarChartCard title="Tendance missions sur l'année" data={barData} />
        <LineChartCard title="Évolution patrouilles" data={lineData} />
        <DonutCard
          title="Répartition flotte"
          subtitle="Missions / Partenaires / Rapports"
          segments={[
            { label: "Missions", done: boursesActives, total: 20, color: "#0FB5B1" },
            { label: "Partenaires", done: partenairesCount, total: 20, color: "#0e8a87" },
            { label: "Rapports", done: DATA.recentPosts.length, total: 20, color: "#b2e8e5" },
          ]}
        />
      </div>

      {/* ICI LE CRUDTABLE EN BAS */}
      <div className="pt-2">
        <CrudTable
          title="Dernières missions marine"
          columns={columns}
          data={filteredMissions}
          loading={false}
          search={search}
          onSearch={setSearch}
          onAdd={() => console.log("add marine")}
          onEdit={(item) => console.log("edit", item)}
          onDelete={(item) => console.log("delete", item)}
          // addLabel="Nouvelle mission"
        />
      </div>
    </div>
  );
}