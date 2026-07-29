"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Ship,
  Plane,
  CheckCircle2,
  AlertCircle,
  Activity,
} from "lucide-react";
import StatsCard from "@/components/cards/StatsCard";

const TOUS_MOYENS = [
  { id: "MM-001", nom: "Vigilant I", categorie: "maritime", type: "Vedette SAR", statut: "disponible", base: "Abidjan", detail: "12 pers." },
  { id: "MM-002", nom: "Sauveur II", categorie: "maritime", type: "Patrouilleur", statut: "engage", base: "Abidjan", detail: "SAR-2026-0041" },
  { id: "MM-003", nom: "Espoir Marine", categorie: "maritime", type: "Remorqueur", statut: "disponible", base: "San Pedro", detail: "8 pers." },
  { id: "MM-004", nom: "Aigle des Mers", categorie: "maritime", type: "Navire militaire", statut: "maintenance", base: "Abidjan", detail: "Révision" },
  { id: "MA-001", nom: "HN-02", categorie: "aerien", type: "Hélicoptère", statut: "en_route", base: "Abidjan", detail: "ETA 15:30" },
  { id: "MA-002", nom: "Alouette III", categorie: "aerien", type: "Hélicoptère", statut: "disponible", base: "Abidjan", detail: "2h 45" },
  { id: "MA-003", nom: "Casa CN-235", categorie: "aerien", type: "Avion", statut: "disponible", base: "FHB", detail: "6h 00" },
  { id: "MA-005", nom: "HN-05", categorie: "aerien", type: "Hélicoptère", statut: "engage", base: "San Pedro", detail: "Zone Sud" },
];

const STATUS: Record<string, { label: string; bg: string; text: string }> = {
  disponible: { label: "Disponible", bg: "bg-emerald-50", text: "text-emerald-700" },
  engage: { label: "Engagé", bg: "bg-[#EAF7FA]", text: "text-[#1E7690]" },
  en_route: { label: "En route", bg: "bg-violet-50", text: "text-violet-700" },
  maintenance: { label: "Maintenance", bg: "bg-amber-50", text: "text-amber-700" },
};

export default function DisponibilitePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = TOUS_MOYENS.filter((m) => {
    const matchSearch =
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchSearch;
    if (filter === "maritime" || filter === "aerien") return matchSearch && m.categorie === filter;
    return matchSearch && m.statut === filter;
  });

  const disponibles = TOUS_MOYENS.filter((m) => m.statut === "disponible");
  const engages = TOUS_MOYENS.filter((m) => m.statut === "engage" || m.statut === "en_route");
  const total = TOUS_MOYENS.length;
  const taux = total > 0 ? Math.round((disponibles.length / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2A3F]">Disponibilité des moyens</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Vue consolidée temps réel — moyens maritimes et aériens
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total moyens" value={String(total).padStart(2, "0")} />
        <StatsCard label="Disponibles" value={String(disponibles.length).padStart(2, "0")} />
        <StatsCard label="Engagés / En route" value={String(engages.length).padStart(2, "0")} />
        <StatsCard label="Taux disponibilité" value={`${taux}%`} />
      </div>

      {/* Barre de charge */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-[#0F2A3F]">Charge opérationnelle</p>
          <p className="text-xs text-slate-500">
            {engages.length} engagés / {total} total
          </p>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2790A8] transition-all"
            style={{ width: `${100 - taux}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un moyen..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] placeholder:text-slate-400 focus:outline-none focus:border-[#2790A8] transition"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "all", label: "Tous" },
            { key: "maritime", label: "Maritimes" },
            { key: "aerien", label: "Aériens" },
            { key: "disponible", label: "Disponibles" },
            { key: "engage", label: "Engagés" },
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Disponibles */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <h2 className="text-sm font-semibold text-[#0F2A3F]">
              Disponibles ({disponibles.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.filter((m) => m.statut === "disponible").length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">Aucun moyen disponible</p>
            ) : (
              filtered
                .filter((m) => m.statut === "disponible")
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() =>
                      router.push(
                        m.categorie === "maritime"
                          ? `/admin/moyens/maritimes/${m.id}`
                          : `/admin/moyens/aeriens/${m.id}`
                      )
                    }
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      {m.categorie === "maritime" ? (
                        <Ship size={16} className="text-emerald-600" />
                      ) : (
                        <Plane size={16} className="text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F2A3F] truncate">{m.nom}</p>
                      <p className="text-xs text-slate-400">
                        {m.type} · {m.base}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">{m.detail}</span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Engagés */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Activity size={16} className="text-[#2790A8]" />
            <h2 className="text-sm font-semibold text-[#0F2A3F]">
              Engagés / En route ({engages.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.filter((m) => m.statut === "engage" || m.statut === "en_route").length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">Aucun moyen engagé</p>
            ) : (
              filtered
                .filter((m) => m.statut === "engage" || m.statut === "en_route")
                .map((m) => {
                  const st = STATUS[m.statut];
                  return (
                    <div
                      key={m.id}
                      onClick={() =>
                        router.push(
                          m.categorie === "maritime"
                            ? `/admin/moyens/maritimes/${m.id}`
                            : `/admin/moyens/aeriens/${m.id}`
                        )
                      }
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#EAF7FA] flex items-center justify-center shrink-0">
                        {m.categorie === "maritime" ? (
                          <Ship size={16} className="text-[#2790A8]" />
                        ) : (
                          <Plane size={16} className="text-[#2790A8]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F2A3F] truncate">{m.nom}</p>
                        <p className="text-xs text-slate-400">
                          {m.type} · {m.detail}
                        </p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}