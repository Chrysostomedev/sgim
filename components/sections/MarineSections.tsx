"use client";

import { Anchor, TrendingUp, Download, Play, AlertTriangle } from "lucide-react";

export function KpiStrip({ kpis }: { kpis: { label: string; value: string; sub: string; color: string }[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {kpis.map((k) => (
        <div key={k.label} className="bg-white rounded-2xl border border-[#c9efed] p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: k.color }} />
          <p className="text- font-black uppercase tracking-widest text-[#8ecfcf]">{k.label}</p>
          <p className="text-2xl font-black text-[#0f2e2d] mt-2">{k.value}</p>
          <p className="text- text-[#5fb8b5] mt-1 flex items-center gap-1"><TrendingUp size={10} />{k.sub}</p>
        </div>
      ))}
    </div>
  );
}

export function LineList({ title, items }: { title: string; items: { label: string; value: string; status: "ok" | "warn" | "danger" }[] }) {
  return (
    <div className="bg-white rounded-2xl border border-[#c9efed] shadow-sm p-5 h-full">
      <h3 className="font-black text-[#0f2e2d] text- mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#f0fbfb] border border-[#e0f7f6] hover:bg-white transition">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${it.status === "ok"? "bg-[#0FB5B1]" : it.status === "warn"? "bg-orange-400" : "bg-[#F25C5C]"}`} />
              <span className="text-sm font-bold text-[#0f2e2d]">{it.label}</span>
            </div>
            <span className={`text-xs font-black px-2 py-1 rounded-full ${it.status === "ok"? "bg-[#e0f7f6] text-[#0e7c7a]" : it.status === "warn"? "bg-orange-50 text-orange-600" : "bg-[#fef1f1] text-[#F25C5C]"}`}>{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExportBar({ onExport, onSimulate }: { onExport: () => void; onSimulate: () => void }) {
  return (
    <div className="bg-[#0f2e2d] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0FB5B1] flex items-center justify-center"><Anchor size={18} className="text-white" /></div>
        <div><p className="text-white font-black text-sm">Centre Opérationnel Marine</p><p className="text-[#8ecfcf] text-xs">Export & Simulation missions</p></div>
      </div>
      <div className="flex gap-2">
        <button onClick={onExport} className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0f2e2d] rounded-xl text-sm font-bold hover:bg-[#f0fbfb] transition"><Download size={14} /> Exporter CSV</button>
        <button onClick={onSimulate} className="flex items-center gap-2 px-4 py-2.5 bg-[#0FB5B1] text-white rounded-xl text-sm font-bold hover:bg-[#0e8a87] transition"><Play size={14} /> Lancer simulation</button>
      </div>
    </div>
  );
}

export function CurveCard({ title, data }: { title: string; data: number[] }) {
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 80}`).join(" ");
  return (
    <div className="bg-white rounded-2xl border border-[#c9efed] shadow-sm p-5">
      <h3 className="font-black text-[#0f2e2d] text-">{title}</h3>
      <p className="text- text-[#5fb8b5] mb-4">Tendance 7 jours</p>
      <svg viewBox="0 0 100 60" className="w-full h- overflow-visible">
        <path d={`M0,${100 - (data[0] / max) * 80} ${points}`} fill="none" stroke="#e0f7f6" strokeWidth="8" strokeLinecap="round" />
        <polyline fill="none" stroke="#0FB5B1" strokeWidth="2.5" strokeLinecap="round" points={points} />
        {data.map((v, i) => <circle key={i} cx={(i / (data.length - 1)) * 100} cy={100 - (v / max) * 80} r="2.5" fill="#0FB5B1" stroke="white" strokeWidth="1.5" />)}
      </svg>
    </div>
  );
}