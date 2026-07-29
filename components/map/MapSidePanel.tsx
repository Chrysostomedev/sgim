"use client";

import {
  X,
  MapPin,
  Ship,
  AlertTriangle,
  Anchor,
  LifeBuoy,
  Navigation,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { MapPoint } from "./MapCanvas";

const TYPE_META: Record<
  string,
  { label: string; icon: any; color: string; bg: string }
> = {
  incident: {
    label: "Incident",
    icon: AlertTriangle,
    color: "text-[#B3402F]",
    bg: "bg-red-50",
  },
  navire: {
    label: "Navire",
    icon: Ship,
    color: "text-[#2790A8]",
    bg: "bg-[#EAF7FA]",
  },
  moyen: {
    label: "Moyen SAR",
    icon: LifeBuoy,
    color: "text-[#1E7690]",
    bg: "bg-[#EAF7FA]",
  },
  port: {
    label: "Port",
    icon: Anchor,
    color: "text-[#4A7C9E]",
    bg: "bg-slate-50",
  },
};

type Props = {
  point: MapPoint | null;
  onClose: () => void;
};

export default function MapSidePanel({ point, onClose }: Props) {
  if (!point) return null;

  const meta = TYPE_META[point.type] ?? TYPE_META.port;
  const Icon = meta.icon;

  return (
    <div className="absolute top-4 right-4 bottom-4 w-[340px] z-20 flex flex-col">
      <div className="flex-1 bg-[#0F2A3F]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl ${meta.bg} flex items-center justify-center`}
              >
                <Icon size={20} className={meta.color} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  {meta.label}
                </p>
                <h3 className="text-base font-bold text-white leading-tight">
                  {point.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/50 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          {point.subtitle && (
            <p className="text-xs text-white/50 mt-2">{point.subtitle}</p>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/60">
              <MapPin size={13} />
              <span className="text-xs font-mono">
                {point.lat.toFixed(4)}°N · {Math.abs(point.lng).toFixed(4)}°W
              </span>
            </div>
            {point.status && (
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-white/40" />
                <span className="text-xs text-white/60">Statut :</span>
                <span className="text-xs font-semibold text-[#39A8C0]">
                  {point.status}
                </span>
              </div>
            )}
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-white/40 uppercase">Type</p>
              <p className="text-sm font-semibold text-white mt-0.5 capitalize">
                {point.type}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-white/40 uppercase">ID</p>
              <p className="text-sm font-semibold text-white mt-0.5 font-mono">
                {point.id}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 space-y-2">
          <Link
            href={`/admin/carte/${point.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#2790A8] text-white text-sm font-semibold hover:opacity-90 transition"
          >
            <ExternalLink size={14} />
            Voir le détail
          </Link>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs text-white/40 hover:text-white/70 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}