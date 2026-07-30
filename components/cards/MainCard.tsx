"use client";

// ============================================================
// components/MainCard.tsx
// Version 100% mockée, thème turquoise, zéro dépendance API
// Reçoit les plannings réels depuis PlanningPage via props
// ============================================================

import { useState } from "react";
import SearchInput from "../data/SearchInput";
import EventLegend from "../sections/EventLegend";
import CalendarGrid from "../sections/CalendarGrid";
import MiniCalendar from "../sections/MiniCalendar";
import SideDetailsPanel from "../modals/SidePanel";
import DataTable from "../data/DataTable";
import { LayoutGrid, List, X, ChevronRight } from "lucide-react";

// ─── Types locaux ───────────────
type PlanningStatus = "PLANIFIÉ" | "EN_COURS" | "EN_RETARD" | "RÉALISÉ";

interface Planning {
  id: number;
  codification: string;
  date_debut: string;
  date_fin: string;
  status: PlanningStatus;
  responsable_name: string;
  site?: { id: number; nom: string };
  provider?: { id: number; company_name?: string; user?: { first_name: string; last_name: string } };
}

interface DetailField {
  label: string;
  value: string;
  isStatus?: boolean;
  statusColor?: string;
}

interface FormattedEvent {
  title: string;
  reference?: string;
  description?: string;
  fields: DetailField[];
}

interface MainCardProps {
  plannings: Planning[];
  isLoading?: boolean;
  selectedEvent: FormattedEvent | null;
  isPanelOpen: boolean;
  onEventClick: (planning: Planning) => void;
  onPanelClose: () => void;
  onEditClick: () => void;
  onEventDrop?: (planningId: number, newDate: Date) => void;
  onDeleteClick?: () => void;
  canAddEvent?: boolean;
  onEventAdd?: (date: Date) => void;
  onCustomAction?: () => void;
  customActionLabel?: string;
  onCellClick?: (date: Date) => void;
}

// ─── Constantes thème turquoise ──────────────────────────────────
const STATUS_COLORS: Record<PlanningStatus, string> = {
  PLANIFIÉ: "#0FB5B1",
  EN_COURS: "#0e8a87",
  EN_RETARD: "#F25C5C",
  RÉALISÉ: "#10b981",
};

const STATUS_LABELS: Record<PlanningStatus, string> = {
  PLANIFIÉ: "Planifié",
  EN_COURS: "En cours",
  EN_RETARD: "En retard",
  RÉALISÉ: "Réalisé",
};

// ─── Helpers ───────────────────────────────────────────
const getSiteName = (site?: { nom: string }) => site?.nom?? "-";

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};

const formatTime = (iso: string) => {
  return iso.split("T")[1]?.slice(0, 5)?? "-";
};

// ─── Composant ────────────────────────────────────────────────
export default function MainCard({
  plannings,
  isLoading = false,
  selectedEvent,
  isPanelOpen,
  onEventClick,
  onPanelClose,
  onEditClick,
  onEventDrop,
  onDeleteClick,
  canAddEvent,
  onEventAdd,
  onCustomAction,
  customActionLabel,
  onCellClick,
}: MainCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [dayListOpen, setDayListOpen] = useState(false);
  const [dayListPlannings, setDayListPlannings] = useState<Planning[]>([]);
  const [dayListDate, setDayListDate] = useState<Date | null>(null);

  const handleShowMore = (plannings: Planning[], date: Date) => {
    setDayListPlannings(plannings);
    setDayListDate(date);
    setDayListOpen(true);
  };

  const handleDayListClick = (planning: Planning) => {
    setDayListOpen(false);
    onEventClick(planning);
  };

  const filteredPlannings = plannings.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.codification?.toLowerCase()?? "").includes(q) ||
      (p.responsable_name?.toLowerCase()?? "").includes(q) ||
      (p.site?.nom?.toLowerCase()?? "").includes(q) ||
      (p.provider?.company_name?.toLowerCase()??
        p.provider?.user?.first_name?.toLowerCase()?? "").includes(q)
    );
  });

  return (
    <div className="w-full space-y-6">
      {/* 1. Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            onSearch={(q) => setSearchQuery(q)}
            placeholder="Rechercher un planning, responsable, site..."
          />
        </div>
        <div className="flex items-center bg-[#e0f7f6] p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${viewMode === "grid"? "bg-white text-[#0f2e2d] shadow-sm" : "text-[#5fb8b5] hover:text-[#0e7c7a]"
              }`}
          >
            <LayoutGrid size={16} /> Grille
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${viewMode === "list"? "bg-white text-[#0f2e2d] shadow-sm" : "text-[#5fb8b5] hover:text-[#0e7c7a]"
              }`}
          >
            <List size={16} /> Liste
          </button>
        </div>
      </div>

      {/* 2. Main Layout */}
      {viewMode === "grid"? (
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-[#f0fbfb] p-4 rounded- border border-[#c9efed] shadow-sm">
              <MiniCalendar
                activeMonth={activeMonth}
                onMonthChange={setActiveMonth}
                plannings={filteredPlannings}
              />
            </div>

            <div className="bg-[#f0fbfb] p-6 rounded- border border-[#c9efed] shadow-sm space-y-8">
              <EventLegend
                search={searchQuery}
                plannings={filteredPlannings}
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 bg-[#f0fbfb] rounded- border border-[#c9efed] shadow-sm overflow-hidden">
            {isLoading? (
              <div className="p-8 space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-[#e0f7f6] rounded-xl" />
                ))}
              </div>
            ) : (
              <CalendarGrid
                search={searchQuery}
                plannings={filteredPlannings}
                activeMonth={activeMonth}
                canAddEvent={canAddEvent}
                onEventAdd={onEventAdd}
                onEventClick={onEventClick}
                onEventDrop={onEventDrop}
                onShowMore={handleShowMore}
                onCellClick={onCellClick}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#f0fbfb] rounded- border border-[#c9efed] shadow-sm overflow-hidden p-6 mt-4">
          <DataTable
            title="Liste des événements planifiés"
            columns={[
              { header: "Codification", key: "codification", render: (_: any, row: Planning) => <span className="font-bold text-[#0f2e2d]">{row.codification}</span> },
              { header: "Site", key: "site", render: (_: any, row: Planning) => getSiteName(row.site) },
              { header: "Date de début", key: "date_debut", render: (_: any, row: Planning) => `${formatDate(row.date_debut)} à ${formatTime(row.date_debut)}` },
              {
                header: "Statut", key: "status", render: (_: any, row: Planning) => (
                  <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${STATUS_COLORS[row.status]}18`, color: STATUS_COLORS[row.status] }}>
                    {STATUS_LABELS[row.status]}
                  </span>
                )
              },
              {
                header: "Actions", key: "actions", render: (_: any, row: Planning) => (
                  <button
                    onClick={() => onEventClick(row)}
                    className="px-3 py-1.5 bg-[#e0f7f6] hover:bg-[#b2e8e5] text-[#0e7c7a] rounded-lg text-xs font-bold transition"
                  >
                    Détails
                  </button>
                )
              }
            ]}
            data={filteredPlannings}
          />
        </div>
      )}

      {/* Panel liste du jour */}
      {dayListOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur- z-[9998]" onClick={() => setDayListOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w- bg-white z-[9999] shadow-2xl flex flex-col rounded-l-3xl overflow-hidden animate-in slide-in-from-right duration-300 border-l border-[#c9efed]">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e0f7f6] shrink-0">
              <div>
                <h2 className="text-lg font-black text-[#0f2e2d]">
                  {dayListDate? dayListDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "Plannings du jour"}
                </h2>
                <p className="text-xs text-[#5fb8b5] mt-0.5">{dayListPlannings.length} planning{dayListPlannings.length > 1? "s" : ""}</p>
              </div>
              <button onClick={() => setDayListOpen(false)} className="p-2 hover:bg-[#f0fbfb] rounded-xl transition">
                <X size={18} className="text-[#5fb8b5]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {dayListPlannings.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleDayListClick(p)}
                  className="w-full flex items-center gap-4 px-6 py-4 border-b border-[#f0fbfb] last:border-0 hover:bg-[#f0fbfb] transition text-left group"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[p.status]?? "#0FB5B1" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0f2e2d] truncate">{p.codification}</p>
                    <p className="text-xs text-[#5fb8b5] mt-0.5">
                      {getSiteName(p.site)} · {formatTime(p.date_debut)}
                    </p>
                    <p className="text-xs text-[#8ecfcf]">Directeur evenement</p>
                  </div>
                  <span
                    className="text- font-bold px-2 py-1 rounded-lg shrink-0"
                    style={{ backgroundColor: `${STATUS_COLORS[p.status]}18`, color: STATUS_COLORS[p.status] }}
                  >
                    {STATUS_LABELS[p.status]?? p.status}
                  </span>
                  <ChevronRight size={14} className="text-[#b2e8e5] group-hover:text-[#0FB5B1] transition shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <SideDetailsPanel
        isOpen={isPanelOpen}
        onClose={onPanelClose}
        title={selectedEvent?.title || ""}
        reference={selectedEvent?.reference}
        fields={selectedEvent?.fields || []}
        descriptionContent={selectedEvent?.description}
        onEdit={onEditClick}
        customAction={onCustomAction}
        customActionLabel={customActionLabel}
      />
    </div>
  );
}