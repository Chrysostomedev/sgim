"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ship, Eye, EyeOff, ArrowRight, User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function WaterDrops() {
  const drops = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${Math.random() * 100}%`, width: 3 + Math.random() * 5, height: 6 + Math.random() * 8 }}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: ["0vh", "110vh"], opacity: [0, 0.6, 0.3, 0] }}
          transition={{ duration: 6 + Math.random() * 6, delay: Math.random() * 8, repeat: Infinity, ease: "linear" }}
        />
      ))}
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
    setTimeout(() => router.push("/admin/dashboard"), 800);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#061420] flex items-center justify-center p-4">
      {/* FOND IMAGE MER */}
      <div className="absolute inset-0">
        <img
          src="/img/bg-marin.png"
          alt="mer"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1920&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061420]/30 via-[#0f2e2d]/70 to-[#061420]/95" />
        <div className="absolute inset-0 bg-[#0FB5B1]/20 mix-blend-overlay" />
      </div>

      <WaterDrops />

      {/* WRAPPER CENTRE - FIX PC */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(15,181,177,0.3)] mb-5">
              <Ship size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">SGIM</h1>
            <p className="text-sm text-white/60 mt-1">MRCC Abidjan · MRSC San Pedro</p>
          </div>

          <div className="relative backdrop-blur-xl bg-white/[0.07] border border-white/15 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#0FB5B1]/60 to-transparent" />
            <div className="mb-7">
              <h2 className="text-lg font-bold text-white">Connexion</h2>
              <p className="text-sm text-white/50 mt-1">Accédez à l’espace opérationnel</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-white/60 mb-2 tracking-widest uppercase">Identifiant</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input type="text" required defaultValue="gjeanchrys@gmail.com" className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#0FB5B1]/60 focus:ring-2 focus:ring-[#0FB5B1]/20" placeholder="ex: operateur.mrcc" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-white/60 mb-2 tracking-widest uppercase">Mot de passe</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input type={showPassword? "text" : "password"} required className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:border-[#0FB5B1]/60 focus:ring-2 focus:ring-[#0FB5B1]/20" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-1">{showPassword? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#0FB5B1]" />
                  <span className="text-xs text-white/60">Se souvenir de moi</span>
                </label>
                <Link href="/mot-de-passe-oublie" className="text-xs text-[#5fe8e5] hover:text-white font-bold">Mot de passe oublié?</Link>
              </div>

              <button type="submit" disabled={loading} className="group w-full py-3.5 rounded-xl bg-[#0FB5B1] text-white text-sm font-black shadow-[0_0_20px_rgba(15,181,177,0.4)] hover:bg-[#0e9e9b] transition-all flex items-center justify-center gap-2">
                {loading? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Se connecter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>

          <p className="text-center text-[11px] text-white/30 mt-6">Système de Gestion des Incidents Maritimes · Accès sécurisé</p>
        </motion.div>
      </div>
    </div>
  );
}

