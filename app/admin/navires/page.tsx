"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Ship,
  Anchor,
  MapPin,
} from "lucide-react";

// ── Données statiques ────────────────────────────────────────────────────────
const NAVIRES = [
  {
    id: "NAV-001",
    nom: "Vigilant I",
    type: "Vedette SAR",
    pavillon: "Côte d'Ivoire",
    immatriculation: "CI-ABJ-2041",
    statut: "disponible",
    position: "Port d'Abidjan",
    capacite: 12,
    dernierContact: "2026-07-28 15:40",
  },
  {
    id: "NAV-002",
    nom: "Sauveur II",
    type: "Patrouilleur",
    pavillon: "Côte d'Ivoire",
    immatriculation: "CI-ABJ-1887",
    statut: "engage",
    position: "Zone SAR Ouest",
    capacite: 24,
    dernierContact: "2026-07-28 14:15",
  },
  {
    id: "NAV-003",
    nom: "Espoir Marine",
    type: "Remorqueur",
    pavillon: "Côte d'Ivoire",
    immatriculation: "CI-SP-0922",
    statut: "disponible",
    position: "Port de San Pedro",
    capacite: 8,
    dernierContact: "2026-07-28 13:50",
  },
  {
    id: "NAV-004",
    nom: "Aigle des Mers",
    type: "Navire militaire",
    pavillon: "Côte d'Ivoire",
    immatriculation: "CI-MN-0045",
    statut: "maintenance",
    position: "Base navale Abidjan",
    capacite: 45,
    dernierContact: "2026-07-27 09:20",
  },
  {
    id: "NAV-005",
    nom: "Horizon Bleu",
    type: "Navire privé",
    pavillon: "Panama",
    immatriculation: "PA-HB-3310",
    statut: "engage",
    position: "12°N 4°W",
    capacite: 6,
    dernierContact: "2026-07-28 12:05",
  },
  {
    id: "NAV-006",
    nom: "Courage III",
    type: "Vedette SAR",
    pavillon: "Côte d'Ivoire",
    immatriculation: "CI-ABJ-2155",
    statut: "disponible",
    position: "Port d'Abidjan",
    capacite: 10,
    dernierContact: "2026-07-28 16:10",
  },
];

const STATUS: Record<string, { label: string; bg: string; text: string }> = {
  disponible: { label: "Disponible", bg: "bg-emerald-50", text: "text-emerald-700" },
  engage: { label: "Engagé", bg: "bg-[#EAF7FA]", text: "text-[#1E7690]" },
  maintenance: { label: "Maintenance", bg: "bg-amber-50", text: "text-amber-700" },
  indisponible: { label: "Indisponible", bg: "bg-red-50", text: "text-red-600" },
};

export default function NaviresPage() {
  const router = useRouter();
  const [view, setView] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filtered = NAVIRES.filter(
    (n) =>
      n.nom.toLowerCase().includes(search.toLowerCase()) ||
      n.type.toLowerCase().includes(search.toLowerCase()) ||
      n.immatriculation.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const stats = {
    total: NAVIRES.length,
    disponible: NAVIRES.filter((n) => n.statut === "disponible").length,
    engage: NAVIRES.filter((n) => n.statut === "engage").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F2A3F]">Navires</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Gestion des navires suivis — flotte SAR et partenaires
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Total navires
          </p>
          <p className="text-3xl font-bold text-[#0F2A3F] mt-1">
            {String(stats.total).padStart(2, "0")}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Disponibles
          </p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {String(stats.disponible).padStart(2, "0")}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Engagés
          </p>
          <p className="text-3xl font-bold text-[#2790A8] mt-1">
            {String(stats.engage).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Barre actions */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Rechercher un navire (nom, type, immatriculation)..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] placeholder:text-slate-400 focus:outline-none focus:border-[#2790A8] transition"
          />
        </div>

        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition ${
              view === "list"
                ? "bg-[#2790A8] text-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Vue liste"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition ${
              view === "grid"
                ? "bg-[#2790A8] text-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Vue grille"
          >
            <LayoutGrid size={16} />
          </button>
        </div>

        <button className="flex items-center gap-2 px-5 py-3 bg-[#2790A8] text-white rounded-xl font-semibold text-[13px] hover:opacity-90 transition shadow-sm whitespace-nowrap">
          <Plus size={16} strokeWidth={2.5} /> Ajouter un navire
        </button>
      </div>

      {/* Vue GRILLE */}
      {view === "grid" ? (
        filtered.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
            Aucun navire trouvé
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((n) => {
              const st = STATUS[n.statut] ?? STATUS.disponible;
              return (
                <div
                  key={n.id}
                  onClick={() => router.push(`/admin/navires/${n.id}`)}
                  className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-[#2790A8]/40 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EAF7FA] flex items-center justify-center">
                        <Ship size={18} className="text-[#2790A8]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F2A3F]">{n.nom}</p>
                        <p className="text-xs text-slate-400">{n.type}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}
                    >
                      {st.label}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <Anchor size={12} /> {n.immatriculation}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={12} /> {n.position}
                    </p>
                    <p>Pavillon : {n.pavillon}</p>
                    <p>Capacité : {n.capacite} pers.</p>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Vue LISTE */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#EAF7FA]/60">
                {[
                  "Navire",
                  "Type",
                  "Immatriculation",
                  "Pavillon",
                  "Position",
                  "Capacité",
                  "Dernier contact",
                  "Statut",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-sm">
                    Aucun navire trouvé
                  </td>
                </tr>
              ) : (
                paginated.map((n) => {
                  const st = STATUS[n.statut] ?? STATUS.disponible;
                  return (
                    <tr
                      key={n.id}
                      onClick={() => router.push(`/admin/navires/${n.id}`)}
                      className="cursor-pointer hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EAF7FA] flex items-center justify-center shrink-0">
                            <Ship size={14} className="text-[#2790A8]" />
                          </div>
                          <span className="text-[13px] font-semibold text-[#0F2A3F]">
                            {n.nom}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[12px] text-slate-600">{n.type}</td>
                      <td className="px-4 py-4 text-[12px] text-slate-500 font-mono">
                        {n.immatriculation}
                      </td>
                      <td className="px-4 py-4 text-[12px] text-slate-600">{n.pavillon}</td>
                      <td className="px-4 py-4 text-[12px] text-slate-500">{n.position}</td>
                      <td className="px-4 py-4 text-[12px] text-slate-600">
                        {n.capacite} pers.
                      </td>
                      <td className="px-4 py-4 text-[12px] text-slate-400 whitespace-nowrap">
                        {n.dernierContact}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${st.bg} ${st.text}`}
                        >
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-slate-100 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                    currentPage === i + 1
                      ? "bg-[#2790A8] text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}