"use client";

import { useState } from "react";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Locate,
  Filter,
  Ship,
  AlertTriangle,
  Anchor,
  LifeBuoy,
} from "lucide-react";
import MapCanvas, { type MapPoint } from "@/components/map/MapCanvas";
import MapSidePanel from "@/components/map/MapSidePanel";
import StatsCard from "@/components/cards/StatsCard";

// Points d'exemple autour de la Côte d'Ivoire (statique)
const POINTS: MapPoint[] = [
  {
    id: "INC-001",
    lat: 5.32,
    lng: -4.02,
    type: "incident",
    title: "MAYDAY — Homme à la mer",
    subtitle: "SGIM-2026-000123 · Critique",
    status: "En cours",
  },
  {
    id: "INC-002",
    lat: 4.75,
    lng: -6.62,
    type: "incident",
    title: "PAN PAN — Panne machine",
    subtitle: "SGIM-2026-000122 · Élevée",
    status: "Engagée",
  },
  {
    id: "NAV-001",
    lat: 5.28,
    lng: -4.01,
    type: "navire",
    title: "Vigilant I",
    subtitle: "Vedette SAR · Disponible",
    status: "Disponible",
  },
  {
    id: "NAV-002",
    lat: 4.73,
    lng: -6.60,
    type: "navire",
    title: "Sauveur II",
    subtitle: "Patrouilleur · Engagé",
    status: "Engagé",
  },
  {
    id: "MOY-001",
    lat: 5.20,
    lng: -3.95,
    type: "moyen",
    title: "Hélicoptère HN-02",
    subtitle: "Moyen aérien · En route",
    status: "En route",
  },
  {
    id: "PORT-ABJ",
    lat: 5.30,
    lng: -4.01,
    type: "port",
    title: "Port d'Abidjan",
    subtitle: "MRCC Abidjan",
    status: "Actif",
  },
  {
    id: "PORT-SP",
    lat: 4.74,
    lng: -6.63,
    type: "port",
    title: "Port de San Pedro",
    subtitle: "MRSC San Pedro",
    status: "Actif",
  },
];

const FILTERS = [
  { key: "all", label: "Tout", icon: Layers },
  { key: "incident", label: "Incidents", icon: AlertTriangle },
  { key: "navire", label: "Navires", icon: Ship },
  { key: "moyen", label: "Moyens", icon: LifeBuoy },
  { key: "port", label: "Ports", icon: Anchor },
];

export default function CarteSIGPage() {
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const [filter, setFilter] = useState("all");
  const [zoom, setZoom] = useState(8);

  const filtered =
    filter === "all" ? POINTS : POINTS.filter((p) => p.type === filter);

  const stats = {
    incidents: POINTS.filter((p) => p.type === "incident").length,
    navires: POINTS.filter((p) => p.type === "navire").length,
    moyens: POINTS.filter((p) => p.type === "moyen").length,
    ports: POINTS.filter((p) => p.type === "port").length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F2A3F]">Carte SIG</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Vue opérationnelle temps réel — Golfe de Guinée
        </p>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard label="Incidents" value={String(stats.incidents).padStart(2, "0")} />
        <StatsCard label="Navires" value={String(stats.navires).padStart(2, "0")} />
        <StatsCard label="Moyens SAR" value={String(stats.moyens).padStart(2, "0")} />
        <StatsCard label="Ports" value={String(stats.ports).padStart(2, "0")} />
      </div>

      {/* Map container immersif */}
      <div className="relative h-[calc(100vh-280px)] min-h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
        {/* Overlay top controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {/* Filtres */}
          <div className="flex flex-col gap-1 bg-[#0F2A3F]/90 backdrop-blur-md rounded-xl p-1.5 border border-white/10">
            {FILTERS.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    filter === f.key
                      ? "bg-[#2790A8] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={14} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z + 1, 16))}
            className="w-9 h-9 rounded-lg bg-[#0F2A3F]/90 backdrop-blur border border-white/10 text-white flex items-center justify-center hover:bg-[#2790A8] transition"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 1, 5))}
            className="w-9 h-9 rounded-lg bg-[#0F2A3F]/90 backdrop-blur border border-white/10 text-white flex items-center justify-center hover:bg-[#2790A8] transition"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => setZoom(8)}
            className="w-9 h-9 rounded-lg bg-[#0F2A3F]/90 backdrop-blur border border-white/10 text-white flex items-center justify-center hover:bg-[#2790A8] transition"
            title="Recentrer"
          >
            <Locate size={16} />
          </button>
        </div>

        {/* Légende */}
        <div className="absolute bottom-4 right-4 z-10 bg-[#0F2A3F]/90 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
            Légende
          </p>
          <div className="space-y-1.5">
            {[
              { color: "#B3402F", label: "Incident" },
              { color: "#2790A8", label: "Navire" },
              { color: "#39A8C0", label: "Moyen SAR" },
              { color: "#4A7C9E", label: "Port" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: l.color }}
                />
                <span className="text-[11px] text-white/70">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Carte */}
        <MapCanvas
          points={filtered}
          selectedId={selected?.id}
          onSelect={setSelected}
          zoom={zoom}
        />

        {/* Side panel */}
        <MapSidePanel point={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}