"use client";

import { colors } from "@/styles/colors";
import { textStyles } from "@/styles/typography";
import Link from "next/link";
import { Ship, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* ── FOND IMAGE ── */}
      <div className="absolute inset-0">
        <img
          src="/img/bg-marin.png"
          alt="not found mer"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1920&auto=format&fit=crop";
          }}
        />
        {/* Dégradé turquoise marine par dessus */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#061420]/60 via-[#0f2e2d]/70 to-[#061420]/90" />
        <div className="absolute inset-0 bg-[#0FB5B1]/20 mix-blend-overlay" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 text-center max-w- w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 mb-6">
          <Ship size={28} className="text-white/80" />
        </div>

        <div className="backdrop-blur-xl bg-white/[0.06] border border-white/10 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <p
            className="font-black tracking-widest"
            style={{
             ...textStyles.incidentReference,
              color: "#5fe8e5",
              fontSize: "14px",
            }}
          >
            404 — OCÉAN INCONNU
          </p>

          <h1
            className="mt-3 mb-3 font-black"
            style={{
             ...textStyles.moduleTitle,
              color: "white",
            }}
          >
            Page introuvable
          </h1>

          <p
            className="mb-8 text-white/60"
            style={{
             ...textStyles.bodyDefault,
            }}
          >
            La page demandée n'existe pas ou a été déplacée. Vous avez dérivé hors de la zone cartographiée.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(15,181,177,0.4)]"
            style={{
              backgroundColor: "#0FB5B1",
              color: "white",
            }}
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
        </div>

        <p className="mt-6 text- text-white/30">
          SGIM · MRCC Abidjan · Erreur 404 marine turquoise
        </p>
      </div>
    </div>
  );
}