"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Navigation, Clock, Ship } from "lucide-react";
import MapCanvas, { type MapPoint } from "@/components/map/MapCanvas";

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

export default function CarteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const point = POINTS.find((p) => p.id === params.id) ?? null;

  if (!point) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 hover:text-[#0F2A3F] text-sm font-medium"
        >
          <ChevronLeft size={18} /> Retour
        </button>
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          Point introuvable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-slate-500 hover:text-[#0F2A3F] text-sm font-medium"
      >
        <ChevronLeft size={18} /> Retour à la carte
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F2A3F] to-[#163A54] rounded-2xl p-6 text-white">
        <p className="text-xs text-white/40 font-mono mb-1">{point.id}</p>
        <h1 className="text-2xl font-bold">{point.title}</h1>
        {point.subtitle && (
          <p className="text-sm text-white/60 mt-1">{point.subtitle}</p>
        )}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin size={14} />
            {point.lat.toFixed(4)}°N · {Math.abs(point.lng).toFixed(4)}°W
          </div>
          {point.status && (
            <div className="flex items-center gap-2 text-sm text-[#39A8C0]">
              <Clock size={14} />
              {point.status}
            </div>
          )}
        </div>
      </div>

      {/* Mini carte centrée */}
      <div className="h-[360px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <MapCanvas
          points={[point]}
          selectedId={point.id}
          onSelect={() => {}}
          center={{ lat: point.lat, lng: point.lng }}
          zoom={11}
        />
      </div>

      {/* Infos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-[11px] text-slate-400 uppercase font-medium">Type</p>
          <p className="text-sm font-semibold text-[#0F2A3F] mt-1 capitalize">
            {point.type}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-[11px] text-slate-400 uppercase font-medium">Statut</p>
          <p className="text-sm font-semibold text-[#2790A8] mt-1">
            {point.status ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-[11px] text-slate-400 uppercase font-medium">Latitude</p>
          <p className="text-sm font-semibold text-[#0F2A3F] mt-1 font-mono">
            {point.lat.toFixed(5)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-[11px] text-slate-400 uppercase font-medium">Longitude</p>
          <p className="text-sm font-semibold text-[#0F2A3F] mt-1 font-mono">
            {point.lng.toFixed(5)}
          </p>
        </div>
      </div>
    </div>
  );
}