"use client";

import { useRouter } from "next/navigation";
import { ListChecks, Clock, CheckCircle2, AlertCircle, ChevronRight, ArrowUpRight } from "lucide-react";

export interface ProjectTaskSummary {
    id:          number | string;
    name:        string;
    initials:    string;        // ex: "BG"
    color:       string;        // bg tailwind
    total:       number;
    en_cours:    number;
    terminees:   number;
    en_retard:   number;
    priority?:   "high" | "low" | "medium";
    href?:       string;
}
interface SiteCardProps {
    project: ProjectTaskSummary;
    basePath?: "/admin" | "/user";  // ← nouveau
}
interface SiteCardProps {
    project: ProjectTaskSummary;
}

const PRIORITY_CFG: Record<string, { label: string; bg: string; text: string }> = {
    high: { label: "Urgent", bg: "bg-red-100",    text: "text-red-500"    },
    medium:  { label: "Élevé",  bg: "bg-amber-100",  text: "text-amber-600"  },
    low: { label: "Normal", bg: "bg-slate-100",  text: "text-slate-500"  },
};

function ProgressRing({ pct, color }: { pct: number; color: string }) {
    const r    = 22;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={52} height={52} viewBox="0 0 52 52" className="shrink-0 -rotate-90">
            <circle cx="26" cy="26" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
            <circle
                cx="26" cy="26" r={r}
                fill="none"
                stroke={color}
                strokeWidth="5"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray .4s ease" }}
            />
        </svg>
    );
}

export default function SiteCard({ project, basePath = "/admin" }: SiteCardProps) {
    const router = useRouter();
    const pct     = project.total > 0 ? Math.round((project.terminees / project.total) * 100) : 0;
    const priority = PRIORITY_CFG[project.priority ?? "normal"];

    // couleur anneau selon avancement
    const ringColor = pct >= 70 ? "#10b981" : pct >= 30 ? "#f97316" : "#94a3b8";

    const handleClick = () => {
        const dest = project.href ?? `/admin/projets/${project.id}`;
        router.push(dest);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 cursor-pointer hover:shadow-md hover:border-orange-200 transition-all group"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${project.color} text-white text-[13px] font-black flex items-center justify-center shrink-0`}>
                        {project.initials}
                    </div>
                    <div className="min-w-0">
                        <p className="font-black text-slate-900 text-[14px] leading-tight truncate">
                            {project.name}
                        </p>
                        {project.priority && (
                            <span className={`inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-black ${priority.bg} ${priority.text}`}>
                                {priority.label}
                            </span>
                        )}
                    </div>
                </div>

                {/* Ring */}
                <div className="relative shrink-0">
                    <ProgressRing pct={pct} color={ringColor} />
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-slate-700 rotate-90">
                        {pct}%
                    </span>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                    <ListChecks size={14} className="text-slate-400 shrink-0" />
                    <div>
                        <p className="text-[11px] text-slate-400 font-medium leading-none">Total</p>
                        <p className="text-[15px] font-black text-slate-900 leading-tight">{project.total}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                    <Clock size={14} className="text-blue-500 shrink-0" />
                    <div>
                        <p className="text-[11px] text-blue-400 font-medium leading-none">En cours</p>
                        <p className="text-[15px] font-black text-blue-700 leading-tight">{project.en_cours}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2.5">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <div>
                        <p className="text-[11px] text-emerald-400 font-medium leading-none">Terminées</p>
                        <p className="text-[15px] font-black text-emerald-700 leading-tight">{project.terminees}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2.5">
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <div>
                        <p className="text-[11px] text-red-400 font-medium leading-none">En retard</p>
                        <p className="text-[15px] font-black text-red-600 leading-tight">{project.en_retard}</p>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: ringColor }}
                    />
                </div>
                <div className="flex items-center gap-1 ml-3 text-[#f97316] text-[12px] font-bold whitespace-nowrap group-hover:underline">
                    Voir <ArrowUpRight size={13} />
                </div>
            </div>
        </div>
    );
}
