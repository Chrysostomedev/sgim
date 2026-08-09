"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ship, Eye, EyeOff, ArrowRight, User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'une latence réseau avant redirection
    setTimeout(() => router.push("/admin/dashboard"), 800);
  };

  return (
    // FOND GLOBAL : Changé de bg-[#061420] (sombre) à bg-gray-50 (blanc très légèrement grisé, plus doux que pur blanc)
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 flex items-center justify-center p-4 font-sans antialiased">
      
      {/* 
         ANCIEN BLOC FOND IMAGE MER ET EFFETS DE GOUTTES RETIRÉS ICI
         Le fond est maintenant géré par la classe bg-gray-50 du div parent.
      */}

      {/* WRAPPER CENTRE - FIX PC */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} // Animation légèrement plus douce
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} // Transition plus rapide pour un effet "pro"
          className="w-full max-w-[420px]"
        >
          {/* HEADER : Titres et Logo */}
          <div className="text-center mb-8">
            {/* LOGO : Adapté pour fond clair (contour soft, ombre légère) */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm mb-5">
              <Ship size={28} className="text-[#0FB5B1]" /> {/* Icône couleur accent */}
            </div>
            {/* TITRE PRINCIPAL : Passé de text-white à text-gray-950 (gris très foncé) */}
            <h1 className="text-2xl font-black text-gray-950 tracking-tight">SGIM</h1>
            {/* SOUS-TITRE : Passé de text-white/60 à text-gray-500 */}
            <p className="text-sm text-gray-500 mt-1.5">MRCC Abidjan · MRSC San Pedro</p>
          </div>

          {/* FORMULAIRE CONTAINER : Adapté pour fond clair (fond blanc, bordure légère, ombre douce) */}
          <div className="relative bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            {/* Petit filet d'accent sur le dessus */}
            <div className="absolute top-0 left-6 right-6 h-[2px] bg-[#0FB5B1]" />
            
            <div className="mb-8">
              {/* TITRE FORMULAIRE : Passé de text-white à text-gray-900 */}
              <h2 className="text-lg font-extrabold text-gray-900">Connexion</h2>
              {/* SOUS-TITRE : Passé de text-white/50 à text-gray-500 */}
              <p className="text-sm text-gray-500 mt-1">Accédez à l’espace opérationnel</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ Identifiant */}
              <div>
                {/* LABEL : Passé de text-white/60 à text-gray-600 */}
                <label className="block text-[11px] font-bold text-gray-600 mb-2.5 tracking-widest uppercase">Identifiant</label>
                <div className="relative">
                  {/* ICÔNE : Passée de text-white/40 à text-gray-400 */}
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  {/* INPUT : Passé de bg-white/10 à bg-white, text-white à text-gray-900, border-white/15 à border-gray-200, placeholder text-white/30 à text-gray-400 */}
                  <input 
                    type="text" 
                    required 
                    defaultValue="gjeanchrys@gmail.com" 
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#0FB5B1] focus:ring-1 focus:ring-[#0FB5B1]/20 transition-colors" 
                    placeholder="ex: operateur.mrcc" 
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                {/* LABEL : Passé de text-white/60 à text-gray-600 */}
                <label className="block text-[11px] font-bold text-gray-600 mb-2.5 tracking-widest uppercase">Mot de passe</label>
                <div className="relative">
                  {/* ICÔNE : Passée de text-white/40 à text-gray-400 */}
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  {/* INPUT : Adapté comme le champ Identifiant */}
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#0FB5B1] focus:ring-1 focus:ring-[#0FB5B1]/20 transition-colors" 
                    placeholder="••••••••" 
                  />
                  {/* BOUTON OŒIL : Passé de text-white/40 à text-gray-400, hover:text-white à hover:text-gray-600 */}
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options supplémentaires */}
              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  {/* CHECKBOX : Fond blanc, bordure grise, couleur accent sur check */}
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 bg-white text-[#0FB5B1] focus:ring-[#0FB5B1]/20 focus:ring-offset-0 transition-colors" 
                  />
                  {/* TEXTE : Passé de text-white/60 à text-gray-600, hover text-gray-900 */}
                  <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Se souvenir de moi</span>
                </label>
                {/* LIEN : Passé de text-[#5fe8e5] à text-[#0FB5B1] (plus lisible sur blanc), hover:text-[#0e9e9b] */}
                <Link href="/mot-de-passe-oublie" className="text-xs text-[#0FB5B1] hover:text-[#0e9e9b] font-semibold transition-colors">Mot de passe oublié?</Link>
              </div>

              {/* BOUTON SOUMISSION : Couleur pleine d'accent (sans ombre colorée, juste ombre douce) */}
              <button 
                type="submit" 
                disabled={loading} 
                className="group w-full py-4 rounded-xl bg-[#0FB5B1] text-white text-sm font-bold shadow-sm hover:bg-[#0e9e9b] active:bg-[#0d8f8d] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  // LOADER : Couleur adaptée pour fond bleu
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Se connecter 
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FOOTER TEXT : Passé de text-white/30 à text-gray-400 */}
          <p className="text-center text-[11px] text-gray-400 mt-8 tracking-wide">
            Système de Gestion des Incidents Maritimes · Accès sécurisé
          </p>
        </motion.div>
      </div>
    </div>
  );
}