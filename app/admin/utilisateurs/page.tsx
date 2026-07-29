"use client";

import { useState } from "react";
import {
  Eye,
  Users,
  X,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Key,
  UserPlus,
  EyeOff,
  Eye as EyeIcon,
} from "lucide-react";
import StatsCard from "@/components/cards/StatsCard";

// ── Config des rôles SGIM ────────────────────────────────────────────────────
const ROLES_CONFIG: Record<
  string,
  {
    label: string;
    badge: string;
    description: string;
    permissions: string[];
  }
> = {
  "super-admin": {
    label: "Super Administrateur",
    badge: "bg-[#0F2A3F] text-white",
    description: "Accès total à la plateforme SGIM.",
    permissions: [
      "Gestion des rôles",
      "Gestion des utilisateurs",
      "Tous les modules",
      "Paramètres système",
      "Logs & Traçabilité",
    ],
  },
  admin: {
    label: "Administrateur",
    badge: "bg-slate-100 text-slate-800 border border-slate-200",
    description: "Gestion opérationnelle complète.",
    permissions: [
      "Incidents",
      "Opérations SAR",
      "Navires",
      "Moyens",
      "Rapports",
      "Utilisateurs",
    ],
  },
  superviseur: {
    label: "Superviseur",
    badge: "bg-[#EAF7FA] text-[#1E7690] border border-[#9ADAE8]",
    description: "Supervision des opérations et validation.",
    permissions: [
      "Incidents (lecture + validation)",
      "Opérations SAR",
      "Carte SIG",
      "Rapports",
    ],
  },
  operateur: {
    label: "Opérateur",
    badge: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    description: "Saisie et suivi des alertes et incidents.",
    permissions: [
      "Nouvelle Alerte",
      "Incidents assignés",
      "Journal des événements",
    ],
  },
};

type UserRow = {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  joined: string;
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLES_CONFIG[role];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${cfg.badge}`}
    >
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
        status === "active"
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-slate-100 text-slate-500 border border-slate-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "active" ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {status === "active" ? "Actif" : "Inactif"}
    </span>
  );
}

// ── Side panel détail utilisateur ────────────────────────────────────────────
function UserSidePanel({
  user,
  onClose,
  onToggleStatus,
}: {
  user: UserRow | null;
  onClose: () => void;
  onToggleStatus: (id: number) => void;
}) {
  if (!user) return null;
  const cfg = ROLES_CONFIG[user.role];
  const isActive = user.status === "active";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-[400px] bg-white z-50 shadow-2xl flex flex-col rounded-l-2xl overflow-hidden">
        <div className="flex items-start px-5 pt-5">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="px-6 pt-2 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0F2A3F] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F2A3F]">{user.name}</h2>
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
          <div className="space-y-0">
            {[
              { Icon: Mail, label: "Email", value: user.email },
              { Icon: Phone, label: "Téléphone", value: user.phone || "—" },
              { Icon: Calendar, label: "Membre depuis", value: user.joined },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-50"
              >
                <div className="flex items-center gap-2 text-slate-400">
                  <f.Icon size={13} />
                  <p className="text-xs font-medium">{f.label}</p>
                </div>
                <p className="text-sm font-semibold text-slate-800">{f.value}</p>
              </div>
            ))}
            <div className="flex items-center justify-between py-3">
              <p className="text-xs font-medium text-slate-400">Statut</p>
              <StatusBadge status={user.status} />
            </div>
          </div>

          {cfg && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Key size={11} /> Permissions du rôle
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  {cfg.description}
                </p>
                {cfg.permissions.map((perm, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2
                      size={13}
                      className="text-emerald-500 shrink-0"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      {perm}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100">
          <button
            onClick={() => onToggleStatus(user.id)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${
              isActive
                ? "border border-red-200 text-red-600 hover:bg-red-50"
                : "bg-[#0F2A3F] text-white hover:opacity-90"
            }`}
          >
            {isActive ? (
              <>
                <Lock size={15} /> Désactiver
              </>
            ) : (
              <>
                <Unlock size={15} /> Réactiver
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Side panel ajout utilisateur ─────────────────────────────────────────────
function AddUserSidePanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "operateur",
  });
  const [showPass, setShowPass] = useState(false);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-[420px] bg-white z-50 shadow-2xl flex flex-col rounded-l-2xl overflow-hidden">
        <div className="flex items-start px-5 pt-5">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="px-6 pt-2 pb-5">
          <h2 className="text-xl font-bold text-[#0F2A3F]">
            Ajouter un utilisateur
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Créer un compte opérateur, superviseur ou admin
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2 block">
              Rôle
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { val: "operateur", label: "Opérateur" },
                  { val: "superviseur", label: "Superviseur" },
                  { val: "admin", label: "Admin" },
                  { val: "super-admin", label: "Super Admin" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setForm({ ...form, role: opt.val })}
                  className={`p-3 rounded-xl border-2 text-left text-xs font-semibold transition ${
                    form.role === opt.val
                      ? "border-[#2790A8] bg-[#EAF7FA] text-[#1E7690]"
                      : "border-slate-100 text-slate-600 hover:border-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {[
            { key: "first_name", label: "Prénom", type: "text" },
            { key: "last_name", label: "Nom", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "phone", label: "Téléphone", type: "tel" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">
                {f.label}
              </label>
              <input
                type={f.type}
                value={(form as any)[f.key]}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#2790A8] transition"
              />
            </div>
          ))}

          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#2790A8] transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPass ? <EyeOff size={15} /> : <EyeIcon size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2790A8] text-white text-sm font-semibold hover:opacity-90 transition"
          >
            <UserPlus size={15} /> Créer
          </button>
        </div>
      </div>
    </>
  );
}

// ── Page principale ──────────────────────────────────────────────────────────
export default function UtilisateursPage() {
  const [users] = useState<UserRow[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered =
    roleFilter === "all"
      ? users
      : users.filter((u) => u.role === roleFilter);

  const handleToggleStatus = (_id: number) => {
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A3F]">
            Utilisateurs & Rôles
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Gestion des accès et permissions — MRCC Abidjan / MRSC San Pedro
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2790A8] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm"
        >
          <UserPlus size={15} />
          Ajouter un utilisateur
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Utilisateurs" value="00" />
        <StatsCard label="Administrateurs" value="00" />
        <StatsCard label="Superviseurs" value="00" />
        <StatsCard label="Opérateurs" value="00" />
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: "all", label: "Tous" },
          { key: "super-admin", label: "Super Admin" },
          { key: "admin", label: "Admins" },
          { key: "superviseur", label: "Superviseurs" },
          { key: "operateur", label: "Opérateurs" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setRoleFilter(f.key)}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
              roleFilter === f.key
                ? "bg-[#0F2A3F] text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#EAF7FA]/50">
              {[
                "Utilisateur",
                "Rôle",
                "Téléphone",
                "Statut",
                "Membre depuis",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Users size={32} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-400">
                    Aucun utilisateur
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Les comptes apparaîtront ici une fois créés
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0F2A3F] flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-white">
                          {row.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F2A3F]">
                          {row.name}
                        </p>
                        <p className="text-xs text-slate-400">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <RoleBadge role={row.role} />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {row.phone || "—"}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {row.joined}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelectedUser(row)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-500 hover:text-[#0F2A3F]"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserSidePanel
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onToggleStatus={handleToggleStatus}
      />

      <AddUserSidePanel open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}