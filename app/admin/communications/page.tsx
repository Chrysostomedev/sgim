"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Radio,
  MessageCircle,
  CheckCircle2,
  Clock,
  Zap,
  Megaphone,
} from "lucide-react";
import StatsCard from "@/components/cards/StatsCard";

export default function CommunicationsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);

  // Vide volontairement — pas de mock
  const communications: any[] = [];

  const filtered = communications.filter((c) => {
    const matchSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A3F]">Communications</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Threads, notifications et échanges opérationnels — MRCC / MRSC
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2790A8] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-sm"
        >
          <Plus size={16} strokeWidth={2.5} />
          Nouvelle communication
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total threads" value="00" />
        <StatsCard label="Actifs" value="00" />
        <StatsCard label="Résolus" value="00" />
        <StatsCard label="En attente" value="00" />
      </div>

      {/* Recherche + filtres */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une communication..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] placeholder:text-slate-400 focus:outline-none focus:border-[#2790A8] transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "Tous" },
            { key: "active", label: "Actifs" },
            { key: "pending", label: "En attente" },
            { key: "resolved", label: "Résolus" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold transition ${
                filterStatus === f.key
                  ? "bg-[#2790A8] text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste / Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF7FA] flex items-center justify-center mx-auto mb-4">
            <Radio size={24} className="text-[#2790A8]" />
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Aucune communication
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Les threads opérationnels, alertes et échanges VHF / notifications
            apparaîtront ici.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#2790A8] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            <Plus size={15} />
            Créer la première communication
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Les cartes apparaîtront ici une fois les données branchées */}
        </div>
      )}

      {/* Modal simple (statique) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl mx-4">
            <h2 className="text-lg font-bold text-[#0F2A3F] mb-1">
              Nouvelle communication
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              Créer un fil opérationnel ou une notification
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Sujet
                </label>
                <input
                  type="text"
                  placeholder="Ex: Coordination SAR zone Ouest"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#2790A8] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Catégorie
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#2790A8]">
                    <option value="operationnel">Opérationnel</option>
                    <option value="alerte">Alerte</option>
                    <option value="coordination">Coordination</option>
                    <option value="notification">Notification</option>
                    <option value="rapport">Rapport</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Priorité
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#2790A8]">
                    <option value="critique">Critique</option>
                    <option value="haute">Haute</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="basse">Basse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Contenu de la communication..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#2790A8] transition resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#2790A8] text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}