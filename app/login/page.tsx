"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ship, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Gouttes d'eau animées ────────────────────────────────────────────────────
function WaterDrops() {
  const drops = Array.from({ length: 18 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 6 + Math.random() * 6;
        const size = 3 + Math.random() * 5;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 1.6,
              filter: "blur(0.5px)",
            }}
            initial={{ y: -40, opacity: 0 }}
            animate={{
              y: ["0vh", "110vh"],
              opacity: [0, 0.6, 0.3, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}

// ── Vagues animées ───────────────────────────────────────────────────────────
function OceanWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute bottom-0 left-[-50%] w-[200%] h-32"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(39,144,168,0.25) 0%, transparent 70%)",
        }}
        animate={{ x: ["0%", "-25%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-0 left-[-50%] w-[200%] h-24 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(15,42,63,0.4) 0%, transparent 70%)",
        }}
        animate={{ x: ["-25%", "0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Redirection statique vers le dashboard
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 800); // petit délai pour voir le loading
  };
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#061420] flex items-center justify-center">
      {/* Fond mer profond */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1E2E] via-[#0F2A3F] to-[#061420]" />

      {/* Lueur atmosphérique */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#2790A8]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Gouttes + vagues */}
      <WaterDrops />
      <OceanWaves />

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] px-5"
      >
        {/* Logo + titre */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2790A8]/20 border border-[#2790A8]/30 mb-5"
          >
            <Ship size={28} className="text-[#39A8C0]" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            SGIM
          </h1>
          <p className="text-sm text-white/50 mt-1.5">
            MRCC Abidjan · MRSC San Pedro
          </p>
        </div>

        {/* Carte de connexion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          {/* Liseré supérieur */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#2790A8]/50 to-transparent" />

          <div className="mb-7">
            <h2 className="text-lg font-semibold text-white">Connexion</h2>
            <p className="text-sm text-white/40 mt-1">
              Accédez à l’espace opérationnel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifiant */}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2 tracking-wide uppercase">
                Identifiant
              </label>
              <input
                type="text"
                required
                placeholder="ex: operateur.mrcc"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#2790A8]/60 focus:ring-1 focus:ring-[#2790A8]/30 transition-all"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2 tracking-wide uppercase">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#2790A8]/60 focus:ring-1 focus:ring-[#2790A8]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Mot de passe oublié */}
            <div className="flex justify-end">
              <Link
                href="/mot-de-passe-oublie"
                className="text-xs text-[#39A8C0] hover:text-[#63C2D6] transition font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-3.5 rounded-xl bg-[#2790A8] text-white text-sm font-semibold overflow-hidden transition-all hover:bg-[#1E7690] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </span>
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-[11px] text-white/25 mt-8">
          Système de Gestion des Incidents Maritimes · Accès sécurisé
        </p>
      </motion.div>
    </div>
  );
}