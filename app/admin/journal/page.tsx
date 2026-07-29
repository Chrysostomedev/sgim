"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatsCard from "@/components/cards/StatsCard";
import MainCard from "@/components/cards/MainCard";
import { Filter, Plus, X } from "lucide-react";

// ── Données statiques (journal opérationnel) ─────────────────────────────────
const EVENTS = [
  {
    id: 1,
    theme: "Engagement Vedette Vigilant I — Homme à la mer",
    type: "Action SAR",
    lieu: "Zone SAR Ouest",
    start_date: "2026-07-28T14:35:00",
    end_date: "2026-07-28T18:00:00",
    intervenant: "Kinhon Gabriel",
    description: "Déploiement de la vedette suite à alerte MAYDAY.",
    status: "en_cours",
  },
  {
    id: 2,
    theme: "Qualification alerte PAN PAN — Panne machine",
    type: "Qualification",
    lieu: "MRCC Abidjan",
    start_date: "2026-07-28T12:15:00",
    end_date: "2026-07-28T12:45:00",
    intervenant: "Superviseur MRCC",
    description: "Validation de l'alerte et notification des partenaires.",
    status: "termine",
  },
  {
    id: 3,
    theme: "Briefing coordination MRSC San Pedro",
    type: "Coordination",
    lieu: "Salle ops MRCC",
    start_date: "2026-07-29T09:00:00",
    end_date: "2026-07-29T10:00:00",
    intervenant: "Chef de quart",
    description: "Point de synchronisation quotidien des centres.",
    status: "a_venir",
  },
  {
    id: 4,
    theme: "Compte-rendu opération SAR-2026-0038",
    type: "Compte-rendu",
    lieu: "MRCC Abidjan",
    start_date: "2026-07-27T17:00:00",
    end_date: "2026-07-27T17:45:00",
    intervenant: "Opérateur KG",
    description: "Clôture et archivage de l'opération d'assistance.",
    status: "termine",
  },
];

const TYPE_OPTIONS = [
  { label: "Action SAR", value: "Action SAR" },
  { label: "Qualification", value: "Qualification" },
  { label: "Coordination", value: "Coordination" },
  { label: "Compte-rendu", value: "Compte-rendu" },
  { label: "Notification", value: "Notification" },
];

function FilterDropdown({
  isOpen,
  onClose,
  filters,
  onApply,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: { type?: string };
  onApply: (f: { type?: string }) => void;
}) {
  const [local, setLocal] = useState(filters);
  useEffect(() => setLocal(filters), [filters]);
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
        <span className="text-sm font-semibold text-[#0F2A3F]">Filtres</span>
        <button onClick={onClose} className="p-1 hover:bg-slate-50 rounded-lg">
          <X size={16} className="text-slate-400" />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Type d’événement
        </p>
        <button
          onClick={() => setLocal({ type: undefined })}
          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
            !local.type
              ? "bg-[#2790A8] text-white"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Tous les types
        </button>
        {TYPE_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => setLocal({ type: o.value })}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
              local.type === o.value
                ? "bg-[#2790A8] text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-slate-50 flex gap-2">
        <button
          onClick={() => {
            setLocal({});
            onApply({});
            onClose();
          }}
          className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
        >
          Réinitialiser
        </button>
        <button
          onClick={() => {
            onApply(local);
            onClose();
          }}
          className="flex-1 py-2 rounded-xl bg-[#2790A8] text-white text-sm font-semibold hover:opacity-90"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}

export default function JournalEvenementsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<{ type?: string }>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = EVENTS.filter(
    (e) => !filters.type || e.type === filters.type
  );

  const stats = {
    total: EVENTS.length,
    enCours: EVENTS.filter((e) => e.status === "en_cours").length,
    aVenir: EVENTS.filter((e) => e.status === "a_venir").length,
  };

  // Format attendu par MainCard
  const planningsForCalendar = filtered.map((e) => ({
    id: e.id,
    codification: e.theme,
    date_debut: e.start_date,
    date_fin: e.end_date,
    status: "EN_COURS" as const,
    provider_id: 0,
    site_id: 1,
    company_asset_id: 1,
    responsable_name: e.intervenant,
    description: e.description,
    provider: {
      id: 0,
      company_name: e.type,
      user: { first_name: e.intervenant.split(" ")[0] ?? "", last_name: e.intervenant.split(" ")[1] ?? "" },
    },
    site: { id: 1, nom: e.lieu },
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2A3F]">Journal des événements</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Chronologie opérationnelle — actions, qualifications, coordinations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard label="Total événements" value={String(stats.total).padStart(2, "0")} />
        <StatsCard label="En cours" value={String(stats.enCours).padStart(2, "0")} />
        <StatsCard label="À venir" value={String(stats.aVenir).padStart(2, "0")} />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-h-[36px]">
          {filters.type ? (
            <span className="inline-flex items-center gap-1.5 bg-[#2790A8] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {filters.type}
              <button onClick={() => setFilters({})} className="hover:bg-white/20 rounded-full p-0.5">
                <X size={11} />
              </button>
            </span>
          ) : (
            <p className="text-xs text-slate-400">Aucun filtre actif</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                filtersOpen || filters.type
                  ? "bg-[#2790A8] text-white border-[#2790A8]"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter size={16} />
              Filtrer
            </button>
            <FilterDropdown
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              filters={filters}
              onApply={setFilters}
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2790A8] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">
            <Plus size={16} />
            Nouvel événement
          </button>
        </div>
      </div>

      <MainCard
        plannings={planningsForCalendar}
        isLoading={false}
        selectedEvent={null}
        isPanelOpen={false}
        onEventClick={(e: any) => router.push(`/admin/journal/${e.id}`)}
        onPanelClose={() => {}}
        onEventDrop={async () => {}}
        canAddEvent={false}
        onEventAdd={() => {}}
        onEditClick={() => {}}
        onDeleteClick={() => {}}
      />
    </div>
  );
}