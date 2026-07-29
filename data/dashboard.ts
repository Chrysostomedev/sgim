export const dashboardStats = [
  { label: "Incidents en cours", value: 3, delta: "+2", trend: "up" as const, href: "/admin/incidents" },
  { label: "Moyens engagés", value: 7, delta: "+1", trend: "up" as const, href: "/admin/moyens" },
  { label: "Alertes non qualifiées", value: 2, delta: "-1", trend: "down" as const, href: "/admin/alertes" },
  { label: "Taux de résolution", value: "87%", delta: "+5%", trend: "up" as const, href: "/admin/statistiques" },
  { label: "Temps moyen de réponse", value: "12min", delta: "-2min", trend: "up" as const, href: "/admin/statistiques" },
  { label: "Centres synchronisés", value: 2, delta: "0", trend: "up" as const, href: "/admin/synchronisation" },
];

export const recentIncidents = [
  { id: 1, reference: "SGIM-2026-000123", type: "MAYDAY", priorite: "critique", statut: "en_cours", centre: "MRCC Abidjan", ouvert: "2026-07-28 13:42", sujet: "Navire en détresse au large" },
  { id: 2, reference: "SGIM-2026-000122", type: "PAN PAN", priorite: "elevee", statut: "valide", centre: "MRSC San Pedro", ouvert: "2026-07-28 12:15", sujet: "Problème de propulsion" },
  { id: 3, reference: "SGIM-2026-000121", type: "Homme à la mer", priorite: "moderee", statut: "engage", centre: "MRCC Abidjan", ouvert: "2026-07-28 11:05", sujet: "Chute d'un membre d'équipage" },
  { id: 4, reference: "SGIM-2026-000120", type: "Incendie à bord", priorite: "critique", statut: "cloture", centre: "MRSC San Pedro", ouvert: "2026-07-27 09:30", sujet: "Feu de salle des machines" },
  { id: 5, reference: "SGIM-2026-000119", type: "Échouement", priorite: "moderee", statut: "archive", centre: "MRCC Abidjan", ouvert: "2026-07-26 16:45", sujet: "Échouement sur récif" },
];
