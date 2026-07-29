"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  User,
  Tag,
  FileText,
  Clock,
} from "lucide-react";

const EVENTS: Record<
  string,
  {
    id: number;
    theme: string;
    type: string;
    lieu: string;
    start_date: string;
    end_date: string;
    intervenant: string;
    email: string;
    description: string;
    status: string;
    created_at: string;
    actions: { heure: string; texte: string }[];
  }
> = {
  "1": {
    id: 1,
    theme: "Engagement Vedette Vigilant I — Homme à la mer",
    type: "Action SAR",
    lieu: "Zone SAR Ouest",
    start_date: "28/07/2026 14:35",
    end_date: "28/07/2026 18:00",
    intervenant: "Kinhon Gabriel",
    email: "k.gabriel@mrcc.ci",
    description:
      "Déploiement de la vedette Vigilant I suite à alerte MAYDAY homme à la mer. Conditions de mer modérées. Coordination avec MRSC San Pedro.",
    status: "En cours",
    created_at: "28/07/2026 14:30",
    actions: [
      { heure: "14:35", texte: "Ordre d’engagement transmis à Vigilant I" },
      { heure: "14:42", texte: "Vedette en route — ETA 15:05" },
      { heure: "15:08", texte: "Arrivée sur zone confirmée" },
      { heure: "15:25", texte: "Début du pattern de recherche" },
    ],
  },
  "2": {
    id: 2,
    theme: "Qualification alerte PAN PAN — Panne machine",
    type: "Qualification",
    lieu: "MRCC Abidjan",
    start_date: "28/07/2026 12:15",
    end_date: "28/07/2026 12:45",
    intervenant: "Superviseur MRCC",
    email: "superviseur@mrcc.ci",
    description: "Validation de l’alerte PAN PAN et notification des partenaires opérationnels.",
    status: "Terminé",
    created_at: "28/07/2026 12:10",
    actions: [
      { heure: "12:15", texte: "Alerte reçue et enregistrée" },
      { heure: "12:22", texte: "Qualification PAN PAN confirmée" },
      { heure: "12:35", texte: "Partenaires notifiés" },
    ],
  },
};

function FieldRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium pt-0.5">
        {icon}
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function JournalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const event = EVENTS[params.id as string] ?? null;

  if (!event) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 hover:text-[#0F2A3F] text-sm font-medium"
        >
          <ChevronLeft size={18} /> Retour
        </button>
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          Événement introuvable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 hover:text-[#0F2A3F] text-sm font-medium mb-3"
        >
          <ChevronLeft size={18} /> Retour au journal
        </button>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F2A3F]">{event.theme}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Enregistré le {event.created_at}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#EAF7FA] text-[#1E7690] border border-[#9ADAE8]">
            <Tag size={11} /> {event.type}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        {/* Colonne principale */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <FieldRow icon={<Calendar size={15} />} label="Période">
              <span className="text-[13px] font-medium text-slate-700">
                {event.start_date} → {event.end_date}
              </span>
            </FieldRow>
            <FieldRow icon={<MapPin size={15} />} label="Lieu">
              <span className="text-[13px] font-semibold text-slate-800">
                {event.lieu}
              </span>
            </FieldRow>
            <FieldRow icon={<User size={15} />} label="Opérateur">
              <div>
                <p className="text-[13px] font-semibold text-slate-800">
                  {event.intervenant}
                </p>
                <p className="text-[11px] text-[#2790A8]">{event.email}</p>
              </div>
            </FieldRow>
            <FieldRow icon={<Clock size={15} />} label="Statut">
              <span className="text-[13px] font-semibold text-[#1E7690]">
                {event.status}
              </span>
            </FieldRow>
          </div>

          {event.description && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[12px] text-slate-400 font-medium mb-2">
                Description
              </p>
              <p className="text-[13px] text-slate-700 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Chronologie des actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-[#0F2A3F] mb-4 flex items-center gap-2">
              <FileText size={16} className="text-[#2790A8]" />
              Chronologie
            </h2>
            <div className="space-y-0">
              {event.actions.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2790A8] mt-1.5 shrink-0" />
                    {i < event.actions.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 my-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <span className="text-xs font-semibold text-[#2790A8]">
                      {a.heure}
                    </span>
                    <p className="text-sm text-slate-700 mt-0.5">{a.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-[#0F2A3F] mb-3">
              Type d’événement
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF7FA] flex items-center justify-center">
                <Tag size={18} className="text-[#2790A8]" />
              </div>
              <p className="text-sm font-semibold text-slate-800">{event.type}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-[#0F2A3F] mb-3">
              Opérateur
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0F2A3F] text-white text-xs font-bold flex items-center justify-center">
                {event.intervenant
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {event.intervenant}
                </p>
                <p className="text-[11px] text-slate-400">{event.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}