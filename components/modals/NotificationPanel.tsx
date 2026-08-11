"use client";

import { useState, useRef, useEffect } from "react";
import {
  X, Bell, CheckCheck, ArrowLeft,
  FolderKanban, CheckSquare, ListTodo, CalendarDays,
  Users, Settings, GitMerge,
} from "lucide-react";

// ── Types ──
type NotifSource = "project" | "task" | "subtask" | "event" | "member" | "status" | "système";

type Notification = {
  id: string;
  title: string;
  summary: string;
  body: string;
  source: NotifSource;
  read: boolean;
  createdAt: string;
  entityLabel?: string;
  href?: string;
};

const MOCK_NOTIFS: Notification[] = [
  {
    id: "1",
    title: "Alerte dérive Vridi",
    summary: "Embarcation signalée 5°15'N",
    body: "Embarcation de pêche à la dérive signalée par cargo MSC. Moyens MRCC engagés.",
    source: "système",
    read: false,
    createdAt: new Date().toISOString(),
    entityLabel: "Zone Vridi",
    href: "/admin/alertes",
  },
  {
    id: "2",
    title: "Nouvelle mission SAR",
    summary: "Activation vedette B",
    body: "Mission SAR déclenchée suite à appel détresse.",
    source: "task",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    entityLabel: "Vedette B",
  },
  {
    id: "3",
    title: "Exercice San Pedro",
    summary: "Exercice MRSC programmé",
    body: "Exercice conjoint MRCC/MRSC prévu demain 08h00.",
    source: "event",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    entityLabel: "MRSC San Pedro",
  },
];

// ── Helpers ──
function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 7) return `il y a ${Math.floor(diff / 86400)} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

const SOURCE_CONFIG: Record<
  NotifSource,
  { label: string; Icon: any; iconBg: string; iconColor: string; dotColor: string; badgeBorder: string }
> = {
  project:  { label: "Projet",     Icon: FolderKanban, iconBg: "bg-[#e0f7f6]", iconColor: "text-[#0e7c7a]", dotColor: "#0FB5B1", badgeBorder: "border-[#c9efed]" },
  task:     { label: "Tâche",      Icon: CheckSquare,  iconBg: "bg-[#f0fbfb]", iconColor: "text-[#0FB5B1]", dotColor: "#0FB5B1", badgeBorder: "border-[#c9efed]" },
  subtask:  { label: "Sous-tâche", Icon: ListTodo,     iconBg: "bg-[#f0fbfb]", iconColor: "text-[#0FB5B1]", dotColor: "#0FB5B1", badgeBorder: "border-[#c9efed]" },
  event:    { label: "Événement",  Icon: CalendarDays, iconBg: "bg-[#e0f7f6]", iconColor: "text-[#0e7c7a]", dotColor: "#0e7c7a", badgeBorder: "border-[#c9efed]" },
  member:   { label: "Membre",     Icon: Users,        iconBg: "bg-[#f0fbfb]", iconColor: "text-[#0FB5B1]", dotColor: "#0FB5B1", badgeBorder: "border-[#c9efed]" },
  status:   { label: "Statut",     Icon: GitMerge,     iconBg: "bg-[#e0f7f6]", iconColor: "text-[#0e7c7a]", dotColor: "#0e7c7a", badgeBorder: "border-[#c9efed]" },
  système:  { label: "Système",    Icon: Settings,     iconBg: "bg-[#f0fbfb]", iconColor: "text-[#8ecfcf]", dotColor: "#0FB5B1", badgeBorder: "border-[#c9efed]" },
};

function getCfg(source: NotifSource) {
  return SOURCE_CONFIG[source] ?? SOURCE_CONFIG["système"];
}

function SourceIcon({ source, size = 16 }: { source: NotifSource; size?: number }) {
  const { Icon, iconBg, iconColor } = getCfg(source);
  return (
    <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
      <Icon size={size} className={iconColor} />
    </div>
  );
}

function SourceBadge({ source }: { source: NotifSource }) {
  const cfg = getCfg(source);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.iconBg} ${cfg.iconColor} border ${cfg.badgeBorder}`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
      {cfg.label}
    </span>
  );
}

// ── Props ──
interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialNotif?: Notification | null;
}

export default function NotificationPanel({ isOpen, onClose, initialNotif }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFS);
  const [activeNotif, setActiveNotif] = useState<Notification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) =>
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllAsRead = () =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));

  const remove = (id: string) =>
    setNotifications((p) => p.filter((n) => n.id !== id));

  useEffect(() => {
    if (isOpen && initialNotif) {
      setActiveNotif(initialNotif);
      setDetailOpen(true);
    }
    if (!isOpen) {
      setDetailOpen(false);
      setActiveNotif(null);
    }
  }, [isOpen, initialNotif]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (detailOpen) handleCloseDetail();
        else onClose();
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, detailOpen]);

  const handleOpenDetail = (notif: Notification) => {
    setActiveNotif(notif);
    setDetailOpen(true);
    if (!notif.read) markAsRead(notif.id);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setTimeout(() => setActiveNotif(null), 300);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeNotif?.id === id) handleCloseDetail();
    remove(id);
  };

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[#0f2e2d]/30 backdrop-blur-[2px] z-[9990] transition-opacity"
        onClick={onClose}
      />

      {/* Panel principal */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full z-[9995] flex w-full md:w-auto"
      >
        {/* Liste */}
        <div
          className="w-full md:w-[420px] h-full bg-white flex flex-col"
          style={{ boxShadow: "-8px 0 40px rgba(15,181,177,0.15)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#c9efed] bg-gradient-to-r from-[#0FB5B1] to-[#0e8a87]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center">
                <Bell size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-white leading-none">Notifications</h2>
                <p className="text-xs text-white/80 font-medium mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "À jour"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/20 transition"
                >
                  <CheckCheck size={13} />
                  Tout lire
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl text-white transition"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Contenu liste */}
          <div className="flex-1 overflow-y-auto bg-white">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-20 px-8 text-center">
                <div className="w-16 h-16 bg-[#f0fbfb] rounded-3xl flex items-center justify-center">
                  <Bell size={28} className="text-[#c9efed]" />
                </div>
                <p className="text-sm font-bold text-[#0f2e2d]">Aucune notification</p>
              </div>
            ) : (
              <>
                {unread.length > 0 && (
                  <div>
                    <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                      <span className="text-[11px] font-black text-[#0FB5B1] uppercase tracking-widest">
                        Non lues
                      </span>
                      <span className="min-w-[20px] h-5 rounded-full bg-[#0FB5B1] text-white text-[11px] font-black px-1.5 flex items-center justify-center">
                        {unread.length}
                      </span>
                    </div>
                    {unread.map((n) => (
                      <NotifRow
                        key={n.id}
                        notif={n}
                        isActive={activeNotif?.id === n.id}
                        onClick={() => handleOpenDetail(n)}
                        onDelete={(e) => handleDelete(n.id, e)}
                      />
                    ))}
                  </div>
                )}

                {read.length > 0 && (
                  <div>
                    <div className="px-5 pt-5 pb-2">
                      <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">
                        Lues · {read.length}
                      </span>
                    </div>
                    {read.map((n) => (
                      <NotifRow
                        key={n.id}
                        notif={n}
                        isActive={activeNotif?.id === n.id}
                        onClick={() => handleOpenDetail(n)}
                        onDelete={(e) => handleDelete(n.id, e)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Panneau détail (slide-in) */}
        <div
          className="absolute right-0 top-0 h-full w-full md:w-[420px] bg-white flex flex-col border-l border-[#c9efed]"
          style={{
            boxShadow: "-8px 0 40px rgba(15,181,177,0.15)",
            transform: detailOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "20px 0 0 20px",
          }}
        >
          {activeNotif && <NotifDetail notif={activeNotif} onBack={handleCloseDetail} />}
        </div>
      </div>
    </>
  );
}

// ── Ligne de notification ──
function NotifRow({
  notif,
  isActive,
  onClick,
  onDelete,
}: {
  notif: Notification;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-3.5 px-5 py-4 cursor-pointer border-b border-[#f0fbfb] transition-colors ${
        isActive
          ? "bg-[#f0fbfb]"
          : notif.read
          ? "hover:bg-[#f0fbfb]/40"
          : "hover:bg-[#f0fbfb]/60 bg-[#f0fbfb]/20"
      }`}
    >
      <div className="relative shrink-0 mt-0.5">
        <SourceIcon source={notif.source} />
        {!notif.read && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
            style={{ backgroundColor: getCfg(notif.source).dotColor }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm leading-tight ${
              notif.read ? "font-medium text-gray-500" : "font-bold text-[#0f2e2d]"
            }`}
          >
            {notif.title}
          </p>
          <span className="text-[11px] text-gray-300 font-medium shrink-0 mt-0.5">
            {timeAgo(notif.createdAt)}
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notif.summary}</p>

        <div className="flex items-center gap-2 mt-2">
          <SourceBadge source={notif.source} />
          {notif.entityLabel && (
            <span className="text-[11px] text-gray-400 truncate max-w-[120px]">
              {notif.entityLabel}
            </span>
          )}
        </div>
      </div>

      {!notif.read && (
        <span className="w-2 h-2 rounded-full bg-[#0FB5B1] block mt-2 shrink-0" />
      )}
    </div>
  );
}

// ── Détail ──
function NotifDetail({ notif, onBack }: { notif: Notification; onBack: () => void }) {
  const cfg = getCfg(notif.source);

  return (
    <>
      <div className="shrink-0 bg-gradient-to-r from-[#0FB5B1] to-[#0e8a87]">
        <div className="flex items-center px-5 pt-5 pb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold transition"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>

        <div className="flex items-center gap-4 px-5 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <cfg.Icon size={22} className="text-white" />
          </div>
          <div>
            <SourceBadge source={notif.source} />
            <p className="text-xs text-white/80 font-medium mt-1.5">
              {timeAgo(notif.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-white">
        <h2 className="text-xl font-black text-[#0f2e2d] leading-tight">
          {notif.title}
        </h2>

        <div className="bg-[#f0fbfb] rounded-2xl border border-[#c9efed] p-5">
          <p className="text-sm text-[#0f2e2d]/80 leading-relaxed font-medium">
            {notif.body}
          </p>
        </div>

        {notif.href && (
          <a
            href={notif.href}
            className="flex items-center justify-center w-full py-3.5 rounded-xl bg-[#0FB5B1] hover:bg-[#0e8a87] text-white text-sm font-bold transition active:scale-[0.98]"
          >
            Voir {cfg.label}
          </a>
        )}
      </div>
    </>
  );
}