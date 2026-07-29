export interface IncidentStat {
  label: string;
  value: string | number;
  delta: string;
  trend: "up" | "down";
  href: string;
}

export interface RecentIncident {
  id: number;
  reference: string;
  type: string;
  priorite: string;
  statut: string;
  centre: string;
  ouvert: string;
  sujet: string;
}

export interface IncidentColumn {
  header: string;
  key: keyof RecentIncident | "actions";
  render?: (value: any, item: RecentIncident) => React.ReactNode;
}

export const incidentsStats: IncidentStat[] = [
  { label: "Total incidents", value: 1247, delta: "+3%", trend: "up", href: "/admin/incidents" },
  { label: "En cours", value: 12, delta: "+2", trend: "up", href: "/admin/incidents" },
  { label: "Clôturés ce mois", value: 34, delta: "+12%", trend: "up", href: "/admin/incidents" },
  { label: "Temps moyen de résolution", value: "4h 12min", delta: "-18min", trend: "up", href: "/admin/statistiques" },
];

export const incidentsColumns: IncidentColumn[] = [
  { header: "Référence", key: "reference", render: (v) => <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg whitespace-nowrap">{v ?? "-"}</span> },
  { header: "Type", key: "type", render: (v) => <span className="text-sm font-bold text-slate-900">{v ?? "-"}</span> },
  { header: "Sujet", key: "sujet", render: (v) => <span className="text-sm text-slate-600 truncate max-w-[200px]">{v ?? "-"}</span> },
  { header: "Priorité", key: "priorite", render: (v) => {
    const color = v === "critique" ? "text-red-600 bg-red-50 border-red-200" : v === "elevee" ? "text-orange-600 bg-orange-50 border-orange-200" : "text-slate-600 bg-slate-50 border-slate-200";
    return <span className={`px-3 py-1 rounded-xl border text-xs font-bold ${color}`}>{v ?? "-"}</span>;
  }},
  { header: "Statut", key: "statut", render: (v) => <span className="text-sm text-slate-600">{v ?? "-"}</span> },
  { header: "Centre", key: "centre", render: (v) => <span className="text-sm text-slate-600">{v ?? "-"}</span> },
  { header: "Ouvert", key: "ouvert", render: (v) => <span className="text-xs text-slate-500 whitespace-nowrap">{v ?? "-"}</span> },
];

export const recentIncidents: RecentIncident[] = [
  { id: 1, reference: "SGIM-2026-000123", type: "MAYDAY", priorite: "critique", statut: "en_cours", centre: "MRCC Abidjan", ouvert: "2026-07-28 13:42", sujet: "Navire en détresse au large" },
  { id: 2, reference: "SGIM-2026-000122", type: "PAN PAN", priorite: "elevee", statut: "valide", centre: "MRSC San Pedro", ouvert: "2026-07-28 12:15", sujet: "Problème de propulsion" },
  { id: 3, reference: "SGIM-2026-000121", type: "Homme à la mer", priorite: "moderee", statut: "engage", centre: "MRCC Abidjan", ouvert: "2026-07-28 11:05", sujet: "Chute d'un membre d'équipage" },
  { id: 4, reference: "SGIM-2026-000120", type: "Incendie à bord", priorite: "critique", statut: "cloture", centre: "MRSC San Pedro", ouvert: "2026-07-27 09:30", sujet: "Feu de salle des machines" },
  { id: 5, reference: "SGIM-2026-000119", type: "Échouement", priorite: "moderee", statut: "archive", centre: "MRCC Abidjan", ouvert: "2026-07-26 16:45", sujet: "Échouement sur récif" },
];
