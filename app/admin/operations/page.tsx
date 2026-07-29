"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LifeBuoy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Ship,
  Activity,
} from "lucide-react";
import StatsCard from "@/components/cards/StatsCard";

// ── Données statiques (à remplacer plus tard) ────────────────────────────────
const STATS = {
  enCours: 4,
  terminees: 18,
  tauxReussite: 92,
  tempsMoyen: "47 min",
};

const OPERATIONS = [
  {
    id: "SAR-2026-0041",
    type: "Homme à la mer",
    priorite: "critique",
    statut: "en_cours",
    centre: "MRCC Abidjan",
    moyens: 3,
    progression: 65,
    ouvert: "2026-07-28 14:22",
  },
  {
    id: "SAR-2026-0040",
    type: "MAYDAY — Incendie",
    priorite: "critique",
    statut: "en_cours",
    centre: "MRSC San Pedro",
    moyens: 5,
    progression: 40,
    ouvert: "2026-07-28 11:05",
  },
  {
    id: "SAR-2026-0039",
    type: "Assistance navire",
    priorite: "elevee",
    statut: "engagee",
    centre: "MRCC Abidjan",
    moyens: 2,
    progression: 85,
    ouvert: "2026-07-28 09:40",
  },
  {
    id: "SAR-2026-0038",
    type: "PAN PAN — Panne machine",
    priorite: "moderee",
    statut: "terminee",
    centre: "MRCC Abidjan",
    moyens: 1,
    progression: 100,
    ouvert: "2026-07-27 16:15",
  },
  {
    id: "SAR-2026-0037",
    type: "Recherche de personne",
    priorite: "elevee",
    statut: "terminee",
    centre: "MRSC San Pedro",
    moyens: 4,
    progression: 100,
    ouvert: "2026-07-27 08:30",
  },
  {
    id: "SAR-2026-0036",
    type: "Collision",
    priorite: "critique",
    statut: "terminee",
    centre: "MRCC Abidjan",
    moyens: 6,
    progression: 100,
    ouvert: "2026-07-26 19:50",
  },
];

const PRIORITE_STYLES: Record<string, string> = {
  critique: "bg-red-50 text-[#B3402F] border border-red-100",
  elevee: "bg-orange-50 text-orange-700 border border-orange-100",
  moderee: "bg-amber-50 text-amber-700 border border-amber-100",
};

const STATUT_STYLES: Record<string, string> = {
  en_cours: "bg-[#EAF7FA] text-[#1E7690] border border-[#9ADAE8]",
  engagee: "bg-violet-50 text-violet-700 border border-violet-100",
  terminee: "bg-emerald-50 text-emerald-700 border border-emerald-100",
};

const STATUT_LABEL: Record<string, string> = {
  en_cours: "En cours",
  engagee: "Engagée",
  terminee: "Terminée",
};

export default function OperationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = OPERATIONS.filter((op) => {
    const matchSearch =
      op.id.toLowerCase().includes(search.toLowerCase()) ||
      op.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || op.statut === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F2A3F]">Opérations SAR</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Suivi des opérations de recherche et sauvetage — MRCC Abidjan / MRSC San Pedro
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Opérations en cours" value={String(STATS.enCours).padStart(2, "0")} />
        <StatsCard label="Opérations terminées" value={String(STATS.terminees).padStart(2, "0")} />
        <StatsCard label="Taux de réussite" value={`${STATS.tauxReussite}%`} />
        <StatsCard label="Temps moyen d'intervention" value={STATS.tempsMoyen} />
      </div>

      {/* Filtres + recherche */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une opération (réf. ou type)..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] placeholder:text-slate-400 focus:outline-none focus:border-[#2790A8] transition font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "Toutes" },
            { key: "en_cours", label: "En cours" },
            { key: "engagee", label: "Engagées" },
            { key: "terminee", label: "Terminées" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                filter === f.key
                  ? "bg-[#2790A8] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des opérations */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((op) => (
          <div
            key={op.id}
            onClick={() => router.push(`/admin/operations/${op.id}`)}
            className="group bg-white border border-slate-150 rounded-2xl p-5 hover:border-[#2790A8]/40 hover:shadow-md transition-all cursor-pointer"
          >
            {/* En-tête */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">{op.id}</p>
                <h3 className="text-sm font-semibold text-[#0F2A3F] leading-snug">
                  {op.type}
                </h3>
              </div>
              <span
                className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                  PRIORITE_STYLES[op.priorite]
                }`}
              >
                {op.priorite}
              </span>
            </div>

            {/* Infos */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Statut</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    STATUT_STYLES[op.statut]
                  }`}
                >
                  {STATUT_LABEL[op.statut]}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Centre</span>
                <span className="font-medium text-slate-700">{op.centre}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Moyens engagés</span>
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Ship size={12} className="text-[#2790A8]" />
                  {op.moyens}
                </span>
              </div>
            </div>

            {/* Progression */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">Avancement</span>
                <span className="font-semibold text-[#0F2A3F]">{op.progression}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#2790A8] transition-all duration-500"
                  style={{ width: `${op.progression}%` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock size={11} />
                {op.ouvert}
              </span>
              <span className="text-[11px] font-medium text-[#2790A8] opacity-0 group-hover:opacity-100 transition">
                Voir détail →
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <LifeBuoy size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">Aucune opération trouvée</p>
        </div>
      )}
    </div>
  );
}