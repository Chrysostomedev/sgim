"use client";

import type { PlanningStatus } from "./CalendarGrid";

interface Planning {
  id: number;
  codification: string;
  date_debut: string;
  status: PlanningStatus;
  responsable_name: string;
  site?: { nom: string };
}

const STATUS_COLORS: Record<PlanningStatus, string> = {
  PLANIFIÉ: "#0FB5B1",
  EN_COURS: "#0e8a87",
  EN_RETARD: "#F25C5C",
  RÉALISÉ: "#10b981",
};

const STATUS_BG: Record<PlanningStatus, string> = {
  PLANIFIÉ: "#e0f7f6",
  EN_COURS: "#b2e8e5",
  EN_RETARD: "#fee2e2",
  RÉALISÉ: "#dcfce7",
};

const LEGEND_ITEMS = [
  { label: "Planifié", color: STATUS_COLORS["PLANIFIÉ"], bg: STATUS_BG["PLANIFIÉ"] },
  { label: "En cours", color: STATUS_COLORS["EN_COURS"], bg: STATUS_BG["EN_COURS"] },
  { label: "En retard", color: STATUS_COLORS["EN_RETARD"], bg: STATUS_BG["EN_RETARD"] },
  { label: "Réalisé", color: STATUS_COLORS["RÉALISÉ"], bg: STATUS_BG["RÉALISÉ"] },
];

interface EventLegendProps {
  search?: string;
  plannings: Planning[];
}

export default function EventLegend({ search = "", plannings }: EventLegendProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingPlannings = plannings
   .filter((p) => {
      const debut = new Date(p.date_debut);
      debut.setHours(0, 0, 0, 0);
      const isUpcoming = debut >= today;
      const matchSearch =
       !search ||
        p.codification.toLowerCase().includes(search.toLowerCase()) ||
        p.responsable_name.toLowerCase().includes(search.toLowerCase()) ||
        (p.site?.nom?? "").toLowerCase().includes(search.toLowerCase());
      return isUpcoming && matchSearch;
    })
   .slice(0, 5);

  return (
    <div className="space-y-8 bg-[#f0fbfb] p-6 rounded-2xl border border-[#c9efed]">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#0e7c7a] uppercase tracking-widest">Légende</h3>
        <div className="grid grid-cols-2 gap-2">
          {LEGEND_ITEMS.map((item) => (
            <div
              key={item.label}
              style={{ backgroundColor: item.bg }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text- font-bold text-[#0f2e2d]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#0e7c7a] uppercase tracking-widest">Événements à venir</h3>

        {upcomingPlannings.length === 0? (
          <p className="text- text-[#7bcac7] italic">Aucun événement à venir.</p>
        ) : (
          <div className="space-y-4">
            {upcomingPlannings.map((planning) => {
              const color = STATUS_COLORS[planning.status]?? "#0FB5B1";
              const [year, month, day] = planning.date_debut.split("T")[0].split("-");
              const dateLabel = `${day}/${month}`;

              return (
                <div
                  key={planning.id}
                  className="flex items-center justify-between text-"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#0f2e2d] leading-tight line-clamp-1">
                        {planning.codification}
                      </span>
                      {planning.site?.nom && (
                        <span className="text-[#5fb8b5] text-">
                          {planning.site.nom}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[#0FB5B1] font-medium flex-shrink-0 ml-2">{dateLabel}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}