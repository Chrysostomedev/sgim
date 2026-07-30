"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { CrudTable, type CrudColumn } from "@/components/data/CrudTable";
import BarChartCard from "@/components/cards/BarChartCard";
import DonutCard from "@/components/cards/DonutCard";
import { KpiStrip, LineList, ExportBar, CurveCard } from "@/components/sections/MarineSections";
import { Users, Ship, AlertTriangle, Award, Timer, Anchor } from "lucide-react";

type Marin = { id: number; matricule: string; nom: string; grade: string; navire: string; statut: string; certif: string; missions: number };

const MARINS: Marin[] = [
  { id: 1, matricule: "MAR-001", nom: "KONÉ Idrissa", grade: "Cdt", navire: "Vedette B", statut: "En mer", certif: "OK", missions: 12 },
  { id: 2, matricule: "MAR-002", nom: "DIALLO Aminata", grade: "Lt", navire: "Patrouilleur", statut: "À quai", certif: "Expire J-5", missions: 8 },
  { id: 3, matricule: "MAR-003", nom: "TRAORÉ Salif", grade: "Maitre", navire: "Remorqueur", statut: "Permission", certif: "OK", missions: 15 },
  { id: 4, matricule: "MAR-004", nom: "BAMBA Karim", grade: "Matelot", navire: "Vedette A", statut: "En mer", certif: "Expiré", missions: 4 },
  { id: 5, matricule: "MAR-005", nom: "YAO Grace", grade: "Lt", navire: "Vedette B", statut: "En mer", certif: "OK", missions: 9 },
  { id: 6, matricule: "MAR-006", nom: "KOUADIO Jean", grade: "Cdt", navire: "Base", statut: "Formation", certif: "OK", missions: 20 },
];

export default function MarinsPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(MARINS);
  const [simulating, setSimulating] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(m => m.nom.toLowerCase().includes(q) || m.matricule.toLowerCase().includes(q) || m.navire.toLowerCase().includes(q));
  }, [data, search]);

  const stats = {
    total: data.length,
    enMer: data.filter(m => m.statut === "En mer").length,
    aQuai: data.filter(m => m.statut === "À quai").length,
    expire: data.filter(m => m.certif!== "OK").length,
  };

  const columns: CrudColumn<Marin>[] = [
    { header: "Matricule", key: "matricule", render: (m) => <span className="font-mono text-xs font-black bg-[#f0fbfb] border border-[#c9efed] px-2 py-1 rounded-lg text-[#0f2e2d]">{m.matricule}</span> },
    { header: "Nom", key: "nom", render: (m) => <div><p className="font-bold text-[#0f2e2d] text-sm">{m.nom}</p><p className="text- text-[#5fb8b5]">{m.grade}</p></div> },
    { header: "Navire", key: "navire" },
    { header: "Statut", key: "statut", render: (m) => <span className={`px-2.5 py-1 rounded-full text- font-bold ${m.statut === "En mer"? "bg-[#e0f7f6] text-[#0e7c7a]" : m.statut === "À quai"? "bg-slate-100 text-slate-600" : "bg-orange-50 text-orange-600"}`}>{m.statut}</span> },
    { header: "Certif", key: "certif", render: (m) => <span className={`px-2 py-1 rounded-full text- font-bold flex items-center gap-1 w-fit ${m.certif === "OK"? "bg-[#e0f7f6] text-[#0e7c7a]" : "bg-[#fef1f1] text-[#F25C5C]"}`}>{m.certif!== "OK" && <AlertTriangle size={10} />}{m.certif}</span> },
    { header: "Missions", key: "missions", render: (m) => <span className="font-black text-[#0f2e2d]">{m.missions}</span> },
  ];

  const handleExport = () => {
    const csv = ["Matricule,Nom,Navire,Statut",...filtered.map(m => `${m.matricule},${m.nom},${m.navire},${m.statut}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "marins.csv"; a.click();
  };

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setData(prev => (prev?? []).map(m => ({...m, missions: m.missions + Math.floor(Math.random() * 3) })));
      setSimulating(false);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f0fbfb] min-h-screen">
      <PageHeader title="Marins - Marine Nationale" subtitle={`${stats.total} marins actifs · ${stats.enMer} en mer · Opérations turquoise`} onAdd={() => {}} addLabel="Nouveau marin" />

      <ExportBar onExport={handleExport} onSimulate={handleSimulate} />

      <KpiStrip kpis={[
        { label: "Total marins", value: stats.total.toString(), sub: "+3 ce mois", color: "#0FB5B1" },
        { label: "En mer", value: stats.enMer.toString(), sub: "60% flotte", color: "#0e8a87" },
        { label: "À quai / Permission", value: (stats.total - stats.enMer).toString(), sub: "Repos", color: "#b2e8e5" },
        { label: "Certifs à risque", value: stats.expire.toString(), sub: "Action requise", color: "#F25C5C" },
        { label: "Missions totales", value: "68", sub: "+12% semaine", color: "#0FB5B1" },
      ]} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Marins en mer" value={`${stats.enMer}`} />
        <StatsCard title="Équipage total" value={`${stats.total}`} />
        <StatsCard title="Certifs expirés" value={`${stats.expire}`}  />
        <StatsCard title="Heures de mer" value="1,240h" icon={Timer} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard title="Missions par navire" data={[{ label: "Vedette A", value: 12, color: "#0FB5B1" },{ label: "Vedette B", value: 18, color: "#0e8a87" },{ label: "Patrouilleur", value: 8, color: "#b2e8e5" },{ label: "Remorqueur", value: 14, color: "#0FB5B1" },{ label: "Base", value: 6, color: "#e0f7f6" }]} />
        {/* <CurveCard title="Présence en mer" data={[2, 3, 2, 4, 5, 3, 6]} /> */}
        <DonutCard title="Répartition statuts" subtitle="En mer / À quai / Permission" segments={[{ label: "En mer", done: stats.enMer, total: stats.total, color: "#0FB5B1" },{ label: "À quai", done: stats.aQuai, total: stats.total, color: "#0e8a87" },{ label: "Autres", done: stats.total - stats.enMer - stats.aQuai, total: stats.total, color: "#b2e8e5" }]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CrudTable title={simulating? "Simulation en cours..." : "Équipage marin"} columns={columns} data={filtered} loading={simulating} search={search} onSearch={setSearch} onAdd={() => {}} onEdit={() => {}} onDelete={(m) => setData(prev => (prev?? []).filter(x => x.id!== m.id))} addLabel="Nouveau marin" />
        </div>
        <div className="space-y-6">
          <LineList title="Alertes certificats" items={[{ label: "BAMBA Karim - STCW", value: "Expiré", status: "danger" },{ label: "DIALLO Aminata - Médical", value: "J-5", status: "warn" },{ label: "YAO Grace - Secourisme", value: "J-12", status: "warn" },{ label: "KONÉ Idrissa - OK", value: "Valide", status: "ok" }]} />
        </div>
      </div>
    </div>
  );
}