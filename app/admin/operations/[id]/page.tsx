"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  LifeBuoy,
  Clock,
  MapPin,
  Ship,
  Users,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Anchor,
  FileText,
  Activity,
} from "lucide-react";

// ── Données statiques (exemple riche) ────────────────────────────────────────
const OPERATION = {
  id: "SAR-2026-0041",
  type: "Homme à la mer",
  priorite: "critique",
  statut: "en_cours",
  centre: "MRCC Abidjan",
  ouvert: "2026-07-28 14:22",
  position: "05°18'N 004°02'W",
  description:
    "Signalement d’un homme à la mer depuis un navire de pêche artisanal. Conditions de mer modérées, vent de sud-ouest 15 nœuds. Opération de recherche engagée avec 3 moyens.",
  progression: 65,
  tempsEcoule: "2h 18min",
  personnesImpliquees: 1,
  victimes: { blesses: 0, disparus: 1, decedes: 0 },
  moyens: [
    { nom: "Vigilant I", type: "Vedette SAR", statut: "engage", eta: "14:45" },
    { nom: "Sauveur II", type: "Patrouilleur", statut: "engage", eta: "15:10" },
    { nom: "Hélicoptère HN-02", type: "Aérien", statut: "en_route", eta: "15:30" },
  ],
  timeline: [
    { heure: "14:22", action: "Alerte reçue — Homme à la mer", auteur: "Opérateur KG" },
    { heure: "14:28", action: "Qualification MAYDAY confirmée", auteur: "Superviseur" },
    { heure: "14:35", action: "Engagement Vedette Vigilant I", auteur: "Opérateur KG" },
    { heure: "14:42", action: "Engagement Patrouilleur Sauveur II", auteur: "Opérateur KG" },
    { heure: "14:55", action: "Demande appui aérien", auteur: "Superviseur" },
    { heure: "15:05", action: "Hélicoptère HN-02 en route", auteur: "Centre aérien" },
  ],
  communications: [
    { heure: "14:25", canal: "VHF 16", message: "Mayday relayé aux unités en zone" },
    { heure: "14:40", canal: "Téléphone", message: "Contact armateur du navire source" },
    { heure: "15:00", canal: "VHF 16", message: "Position actualisée transmise aux moyens" },
  ],
};

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

export default function OperationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const op = OPERATION; // statique pour l’instant

  return (
    <div className="space-y-6">
      {/* Retour */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-slate-500 hover:text-[#0F2A3F] text-sm font-medium transition"
      >
        <ChevronLeft size={18} /> Retour aux opérations
      </button>

      {/* Header principal */}
      <div className="bg-gradient-to-br from-[#0F2A3F] to-[#163A54] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-white/50">{op.id}</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${PRIORITE_STYLES[op.priorite]}`}
              >
                {op.priorite}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUT_STYLES[op.statut]}`}
              >
                {STATUT_LABEL[op.statut]}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1">{op.type}</h1>
            <p className="text-sm text-white/60">{op.centre}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-white/10 rounded-xl backdrop-blur text-center">
              <p className="text-[10px] text-white/50 uppercase font-medium">Avancement</p>
              <p className="text-xl font-bold">{op.progression}%</p>
            </div>
            <div className="px-4 py-2.5 bg-white/10 rounded-xl backdrop-blur text-center">
              <p className="text-[10px] text-white/50 uppercase font-medium">Temps écoulé</p>
              <p className="text-xl font-bold">{op.tempsEcoule}</p>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-5">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2790A8] rounded-full transition-all duration-700"
              style={{ width: `${op.progression}%` }}
            />
          </div>
        </div>
      </div>

      {/* Infos rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Clock size={14} />
            <span className="text-[11px] font-medium uppercase">Ouvert le</span>
          </div>
          <p className="text-sm font-semibold text-[#0F2A3F]">{op.ouvert}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <MapPin size={14} />
            <span className="text-[11px] font-medium uppercase">Position</span>
          </div>
          <p className="text-sm font-semibold text-[#0F2A3F] font-mono">{op.position}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Users size={14} />
            <span className="text-[11px] font-medium uppercase">Personnes</span>
          </div>
          <p className="text-sm font-semibold text-[#0F2A3F]">
            {op.personnesImpliquees} impliquée(s)
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <AlertTriangle size={14} />
            <span className="text-[11px] font-medium uppercase">Victimes</span>
          </div>
          <p className="text-sm font-semibold text-[#0F2A3F]">
            {op.victimes.disparus} disparu · {op.victimes.blesses} blessé · {op.victimes.decedes} décès
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-[#0F2A3F] mb-2 flex items-center gap-2">
          <FileText size={16} className="text-[#2790A8]" />
          Description de l’événement
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">{op.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moyens engagés */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-[#0F2A3F] mb-4 flex items-center gap-2">
            <Ship size={16} className="text-[#2790A8]" />
            Moyens engagés ({op.moyens.length})
          </h2>
          <div className="space-y-3">
            {op.moyens.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EAF7FA] flex items-center justify-center">
                    {m.type === "Aérien" ? (
                      <Activity size={16} className="text-[#2790A8]" />
                    ) : (
                      <Anchor size={16} className="text-[#2790A8]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F2A3F]">{m.nom}</p>
                    <p className="text-xs text-slate-400">{m.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      m.statut === "engage"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {m.statut === "engage" ? "Sur zone" : "En route"}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">ETA {m.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-[#0F2A3F] mb-4 flex items-center gap-2">
            <Clock size={16} className="text-[#2790A8]" />
            Chronologie des actions
          </h2>
          <div className="space-y-0">
            {op.timeline.map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2790A8] shrink-0 mt-1.5" />
                  {i < op.timeline.length - 1 && (
                    <div className="w-px flex-1 bg-slate-200 my-1" />
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-[#2790A8]">{t.heure}</span>
                    <span className="text-[10px] text-slate-400">· {t.auteur}</span>
                  </div>
                  <p className="text-sm text-slate-700">{t.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Communications */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-[#0F2A3F] mb-4 flex items-center gap-2">
          <Radio size={16} className="text-[#2790A8]" />
          Communications
        </h2>
        <div className="space-y-2">
          {op.communications.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition"
            >
              <span className="text-xs font-semibold text-[#2790A8] w-12 shrink-0 pt-0.5">
                {c.heure}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                {c.canal}
              </span>
              <p className="text-sm text-slate-700">{c.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}