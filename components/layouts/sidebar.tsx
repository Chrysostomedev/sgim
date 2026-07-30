"use client";

import { useState, createContext, useContext, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  Ship,
  Map,
  Users,
  Anchor,
  Radio,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  LifeBuoy,
  Handshake,
  ClipboardList,
  Bell,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SubMenu from "./SubMenu";

// ── Types ────────────────────────────────────────────────────────────────────
type SubMenuItem = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  icon: React.ElementType;
  href: string;
  submenu?: SubMenuItem[];
};

// ── Context sidebar ──────────────────────────────────────────────────────────
interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  toggleMobileOpen: () => void;
  setMobileOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  toggleCollapsed: () => {},
  mobileOpen: false,
  toggleMobileOpen: () => {},
  setMobileOpen: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);
  const toggleMobileOpen = useCallback(() => setMobileOpen((v) => !v), []);

  return (
    <SidebarContext.Provider
      value={{ collapsed, toggleCollapsed, mobileOpen, toggleMobileOpen, setMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// ── Navigation SGIM (statique) ───────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    label: "Tableau de bord",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
    {
    label: "Rapports & Statistiques",
    icon: BarChart3,
    href: "/admin/rapports",
  },
  { 
    label: "Nouvelle Alerte",
    icon: AlertTriangle,
    href: "/admin/alertes/nouvelle",
  },
  {
    label: "Incidents",
    icon: ClipboardList,
    href: "/admin/incidents",
    submenu: [
      { label: "Tous les incidents", href: "/admin/incidents" },
      { label: "MAYDAY / PAN PAN", href: "/admin/incidents/detresse" },
      { label: "Homme à la mer", href: "/admin/incidents/homme-a-la-mer" },
      { label: "Pollution", href: "/admin/incidents/pollution" },
      { label: "Piraterie", href: "/admin/incidents/piraterie" },
    ],
  },
  {
    label: "Opérations SAR",
    icon: LifeBuoy,
    href: "/admin/operations",
  },  
  {
    label: "Navires",
    icon: Ship,
    href: "/admin/navires",
  },
  {
    label: "Moyens de secours",
    icon: Anchor,
    href: "/moyens",
    submenu: [
      { label: "Moyens maritimes", href: "/admin/moyens/maritimes" },
      { label: "Moyens aériens", href: "/admin/moyens/aeriens" },
      { label: "Disponibilité", href: "/admin/moyens/disponibilite" },
    ],
  },
  {
    label: "Partenaires",
    icon: Handshake,
    href: "/admin/partenaires",
  },
  {
    label: "Carte SIG",
    icon: Map,
    href: "/admin/carte",
  },
  {
    label: "Communications",
    icon: Radio,
    href: "/admin/communications",
  },
  {
    label: "Journal des événements",
    icon: FileText,
    href: "/admin/journal",
  },

  {
    label: "Administration",
    icon: Users,
    href: "/admin",
    submenu: [
      { label: "Utilisateurs", href: "/admin/utilisateurs" },
      { label: "Rôles & Permissions", href: "/admin/roles" },
      { label: "Référentiels", href: "/admin/referentiels" },
    ],
  },
];

const BOTTOM_ITEMS = [
  { label: "Paramètres", icon: Settings, href: "/parametres" },
];

// ── Logout modal (statique) ──────────────────────────────────────────────────
function LogoutModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white w-[90%] max-w-md rounded-2xl p-8 shadow-xl flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <AlertTriangle className="text-[#B3402F]" size={32} strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#0F2A3F]">Déconnexion</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Voulez-vous quitter la session opérateur ?
          </p>
        </div>
        <div className="flex gap-3 w-full pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-5 rounded-xl bg-[#2790A8] text-white font-semibold hover:opacity-90 transition-all"
          >
            Rester connecté
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-5 rounded-xl bg-[#B3402F] text-white font-semibold hover:opacity-90 transition-all"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Sidebar ─────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const [showLogout, setShowLogout] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const getItemClasses = (active: boolean) =>
    active
      ? "bg-[#2790A8] text-white shadow-sm"
      : "text-slate-600 hover:bg-[#EAF7FA] hover:text-[#1E7690]";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0F2A3F]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#2790A8] flex items-center justify-center shrink-0">
              <Ship size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm tracking-tight truncate">
                SGIM
              </p>
              <p className="text-[10px] text-white/60 truncate">MRCC Abidjan</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto w-9 h-9 rounded-lg bg-[#2790A8] flex items-center justify-center">
            <Ship size={18} className="text-white" />
          </div>
        )}

        <button
          onClick={toggleCollapsed}
          className="hidden md:flex p-1.5 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-white shrink-0"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 hover:bg-white/10 rounded-lg transition text-white/60 shrink-0"
        >
          <X size={15} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.submenu && item.submenu.length > 0) {
            return (
              <div key={item.href} onClick={() => setMobileOpen(false)}>
                <SubMenu
                  label={item.label}
                  href={item.href}
                  icon={<Icon size={18} className="shrink-0" />}
                  items={item.submenu}
                  collapsed={collapsed}
                />
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium
                ${active
                  ? "bg-[#2790A8] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }
                ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-white/10 space-y-0.5">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium
                ${active
                  ? "bg-[#2790A8] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }
                ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <button
          onClick={() => setShowLogout(true)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Se déconnecter" : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Se déconnecter</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-72 z-50 md:hidden flex flex-col">
            <SidebarContent />
          </aside>
        </>
      )}

      {showLogout && (
        <LogoutModal
          onCancel={() => setShowLogout(false)}
          onConfirm={() => setShowLogout(false)}
        />
      )}
    </>
  );
}