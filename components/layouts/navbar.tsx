"use client";

import { useState } from "react";
import { Bell, LogOut, Menu, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "./sidebar";
import NotificationPanel from "@/components/modals/NotificationPanel"; // ← ajout

// ── Notification banner (statique) ───────────────────────────────────────────
function InAppBanner({
  title,
  body,
  onClose,
}: {
  title: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[9999] w-[360px] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      <div className="h-1 w-full bg-[#2790A8]" />
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-lg bg-[#2790A8] flex items-center justify-center shrink-0 mt-0.5">
          <Bell size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0F2A3F] leading-tight truncate">
            {title}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-snug">
            {body}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ── Role badge (maritime) ────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const r = role.toUpperCase();

  if (r === "SUPERVISEUR" || r === "ADMIN") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#EAF0F4] text-[#204A68] border border-[#A3C0D2]">
        Superviseur
      </span>
    );
  }

  if (r === "OPERATEUR") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#EAF7FA] text-[#1E7690] border border-[#9ADAE8]">
        Opérateur
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
      {role}
    </span>
  );
}

// ── Navbar (statique) ────────────────────────────────────────────────────────
export default function Navbar() {
  const { collapsed, toggleMobileOpen } = useSidebar();

  // Données statiques (à remplacer plus tard par de vraies données)
  const firstName = "Kinhon";
  const lastName = "Gabriel";
  const role = "OPERATEUR";
  const fullName = `${firstName} ${lastName}`;
  const unreadCount = 3;
  const profilePic: string | null = null;

  const [showLogout, setShowLogout] = useState(false);
  const [banner, setBanner] = useState<{ title: string; body: string } | null>(null);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  const getInitials = () =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

  const leftOffset = collapsed ? "md:left-16" : "md:left-64";
  const widthCalc = collapsed ? "md:w-[calc(100%-4rem)]" : "md:w-[calc(100%-16rem)]";

  return (
    <>
      {banner && (
        <InAppBanner
          title={banner.title}
          body={banner.body}
          onClose={() => setBanner(null)}
        />
      )}

      <header
        className={`fixed top-0 left-0 w-full ${leftOffset} ${widthCalc} flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b border-slate-200 z-30 transition-all duration-300`}
      >
        {/* Gauche — burger + avatar + nom */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileOpen}
            className="md:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#0F2A3F] transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>

          <Link
            href="/profil"
            className="w-10 h-10 rounded-full bg-[#2790A8] text-white font-semibold flex items-center justify-center text-sm shrink-0 overflow-hidden hover:opacity-90 transition-opacity"
            title="Mon profil"
          >
            {profilePic ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profilePic}
                alt="Profil"
                className="object-cover w-full h-full"
              />
            ) : (
              getInitials()
            )}
          </Link>

          <div className="hidden md:flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <p className="text-[#0F2A3F] font-semibold text-sm leading-tight">
                Bienvenue, {fullName}
              </p>
              <RoleBadge role={role} />
            </div>
            <p className="text-slate-500 text-xs font-medium">
              Centre de coordination — MRCC Abidjan
            </p>
          </div>
        </div>

        {/* Droite — cloche + logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotifPanelOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all"
            aria-label="Notifications"
            title="Notifications"
          >
            <div className="relative">
              <Bell
                size={20}
                className={unreadCount > 0 ? "text-[#0F2A3F]" : "text-slate-400"}
                strokeWidth={unreadCount > 0 ? 2.5 : 2}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#B3402F] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-sm font-medium text-slate-700">
              Alertes
            </span>
          </button>

          <button
            onClick={() => setShowLogout(true)}
            className="p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition text-slate-500"
            title="Se déconnecter"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Logout modal (statique) */}
      {showLogout && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogout(false)}
          />
          <div className="relative bg-white w-[90%] max-w-md rounded-2xl p-8 shadow-xl flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-[#B3402F]" size={32} strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#0F2A3F]">
                Déconnexion
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Voulez-vous quitter la session opérateur ?
              </p>
            </div>
            <div className="flex gap-3 w-full pt-2">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-2.5 px-5 rounded-xl bg-[#2790A8] text-white font-semibold hover:opacity-90 transition-all"
              >
                Rester connecté
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-2.5 px-5 rounded-xl bg-[#B3402F] text-white font-semibold hover:opacity-90 transition-all"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notifPanelOpen}
        onClose={() => setNotifPanelOpen(false)}
      />
    </>
  );
}