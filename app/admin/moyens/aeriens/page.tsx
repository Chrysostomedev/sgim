"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Plane,
  MapPin,
  Clock,
} from "lucide-react";
import StatsCard from "@/components/cards/StatsCard";

const MOYENS = [
  {
    id: "MA-001",
    nom: "HN-02",
    type: "Hélicoptère",
    indicatif: "HN-02",
    base: "Base aérienne Abidjan",
    autonomie: "3h 30",
    statut: "en_route",
    position: "En approche zone SAR",
  },
  {
    id: "MA-002",
    nom: "Alouette III",
    type: "Hélicoptère",
    indicatif: "AL-07",
    base: "Base aérienne Abidjan",
    autonomie: "2h 45",
    statut: "disponible",
    position: "Au sol — Abidjan",
  },
  {
    id: "MA-003",
    nom: "Casa CN-235",
    type: "Avion",
    indicatif: "CN-01",
    base: "Aéroport FHB",
    autonomie: "6h 00",
    statut: "disponible",
    position: "Au sol — Abidjan",
  },
  {
    id: "MA-004",
    nom: "Drone Maritime X1",
    type: "Drone",
    indicatif: "DR-X1",
    base: "MRCC Abidjan",
    autonomie: "1h 20",
    statut: "maintenance",
    position: "Hangar technique",
  },
  {
    id: "MA-005",
    nom: "HN-05",
    type: "Hélicoptère",
    indicatif: "HN-05",
    base: "San Pedro",
    autonomie: "3h 00",
    statut: "engage",
    position: "Zone SAR Sud",
  },
];

const STATUS: Record<string, { label: string; bg: string; text: string }> = {
  disponible: { label: "Disponible", bg: "bg-emerald-50", text: "text-emerald-700" },
  engage: { label: "Engagé", bg: "bg-[#EAF7FA]", text: "text-[#1E7690]" },
  en_route: { label: "En route", bg: "bg-violet-50", text: "text-violet-700" },
  maintenance: { label: "Maintenance", bg: "bg-amber-50", text: "text-amber-700" },
};

export default function MoyensAeriensPage() {
  const router = useRouter();
  const [view, setView] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = MOYENS.filter((m) => {
    const matchSearch =
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase()) ||
      m.indicatif.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.statut === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: MOYENS.length,
    disponible: MOYENS.filter((m) => m.statut === "disponible").length,
    enMission: MOYENS.filter((m) => m.statut === "engage" || m.statut === "en_route").length,
    maintenance: MOYENS.filter((m) => m.statut === "maintenance").length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A3F]">Moyens aériens</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Hélicoptères, avions et drones de recherche et sauvetage
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2790A8] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-sm">
          <Plus size={16} strokeWidth={2.5} /> Ajouter un moyen
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total" value={String(stats.total).padStart(2, "0")} />
        <StatsCard label="Disponibles" value={String(stats.disponible).padStart(2, "0")} />
        <StatsCard label="En mission" value={String(stats.enMission).padStart(2, "0")} />
        <StatsCard label="Maintenance" value={String(stats.maintenance).padStart(2, "0")} />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (nom, type, indicatif)..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] placeholder:text-slate-400 focus:outline-none focus:border-[#2790A8] transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "Tous" },
            { key: "disponible", label: "Disponibles" },
            { key: "engage", label: "Engagés" },
            { key: "en_route", label: "En route" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold transition ${
                filter === f.key
                  ? "bg-[#2790A8] text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition ${view === "list" ? "bg-[#2790A8] text-white" : "text-slate-400"}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition ${view === "grid" ? "bg-[#2790A8] text-white" : "text-slate-400"}`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => {
            const st = STATUS[m.statut] ?? STATUS.disponible;
            return (
              <div
                key={m.id}
                onClick={() => router.push(`/admin/moyens/aeriens/${m.id}`)}
                className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-[#2790A8]/40 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF7FA] flex items-center justify-center">
                      <Plane size={18} className="text-[#2790A8]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F2A3F]">{m.nom}</p>
                      <p className="text-xs text-slate-400">{m.type}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                    {st.label}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <p>Indicatif : {m.indicatif}</p>
                  <p className="flex items-center gap-1.5"><MapPin size={12} /> {m.base}</p>
                  <p className="flex items-center gap-1.5"><Clock size={12} /> Autonomie {m.autonomie}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#EAF7FA]/50">
                {["Moyen", "Type", "Indicatif", "Base", "Autonomie", "Position", "Statut"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    Aucun moyen trouvé
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const st = STATUS[m.statut] ?? STATUS.disponible;
                  return (
                    <tr
                      key={m.id}
                      onClick={() => router.push(`/admin/moyens/aeriens/${m.id}`)}
                      className="cursor-pointer hover:bg-slate-50/60 transition"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EAF7FA] flex items-center justify-center">
                            <Plane size={14} className="text-[#2790A8]" />
                          </div>
                          <span className="text-[13px] font-semibold text-[#0F2A3F]">{m.nom}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[12px] text-slate-600">{m.type}</td>
                      <td className="px-4 py-4 text-[12px] text-slate-500 font-mono">{m.indicatif}</td>
                      <td className="px-4 py-4 text-[12px] text-slate-500">{m.base}</td>
                      <td className="px-4 py-4 text-[12px] text-slate-600">{m.autonomie}</td>
                      <td className="px-4 py-4 text-[12px] text-slate-400">{m.position}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${st.bg} ${st.text}`}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}