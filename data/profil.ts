export const profilStats = [
  { label: "Incidents traités", value: 89, delta: "+5%", trend: "up" as const, href: "/admin/incidents" },
  { label: " interventions", value: 156, delta: "+12%", trend: "up" as const, href: "/admin/operations" },
  { label: "Taux de résolution", value: "94%", delta: "+2%", trend: "up" as const, href: "/admin/statistiques" },
];

export const recentActivities = [
  { id: 1, action: "Mise à jour statut", incident: "SGIM-2026-000123", date: "2026-07-28 14:30" },
  { id: 2, action: "Ajout moyen engagé", incident: "SGIM-2026-000122", date: "2026-07-28 13:15" },
  { id: 3, action: "Notification partenaire", incident: "SGIM-2026-000121", date: "2026-07-28 12:00" },
];
