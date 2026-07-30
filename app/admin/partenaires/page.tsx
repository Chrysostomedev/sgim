"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { CrudTable, type CrudColumn } from "@/components/data/CrudTable";
import { FormField, Input, Select } from "@/components/form/FormInput";
import { Globe, Star, Building2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── DATA statique marine turquoise ──
type Partenaire = {
  id: number;
  name: string;
  website: string;
  type: string;
  is_featured: boolean;
  status: string;
};

const INITIAL_DATA: Partenaire[] = [
  { id: 1, name: "Campus France", website: "https://campusfrance.org", type: "Académique", is_featured: true, status: "Actif" },
  { id: 2, name: "MEXT Japon", website: "https://mext.go.jp", type: "Gouvernement", is_featured: true, status: "Actif" },
  { id: 3, name: "Chevening UK", website: "https://chevening.org", type: "Gouvernement", is_featured: false, status: "Actif" },
  { id: 4, name: "Port Autonome Abidjan", website: "https://paa.ci", type: "Marine", is_featured: true, status: "Actif" },
  { id: 5, name: "Bolloré Logistics", website: "https://bollore.com", type: "Privé", is_featured: false, status: "Inactif" },
];

export default function PartenairesPage() {
  const [data, setData] = useState<Partenaire[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partenaire | null>(null);
  const [form, setForm] = useState({ name: "", website: "", type: "Académique", is_featured: false, status: "Actif" });

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(d => d.name.toLowerCase().includes(q) || d.website.toLowerCase().includes(q));
  }, [data, search]);

  const stats = {
    total: data.length,
    featured: data.filter(d => d.is_featured).length,
    actif: data.filter(d => d.status === "Actif").length,
    marine: data.filter(d => d.type === "Marine").length,
  };

  const columns: CrudColumn<Partenaire>[] = [
    { header: "Nom", key: "name", render: (item) => <span className="font-bold text-[#0f2e2d]">{item.name}</span> },
    { header: "Type", key: "type", render: (item) => <span className="px-2.5 py-1 rounded-full text- font-bold bg-[#f0fbfb] text-[#0e7c7a] border border-[#c9efed]">{item.type}</span> },
    { header: "Site", key: "website", render: (item) => <a href={item.website} target="_blank" className="text- text-[#0FB5B1] hover:underline truncate max-w- block">{item.website}</a> },
    { header: "Vedette", key: "is_featured", render: (item) => item.is_featured? <span className="flex items-center gap-1 text- font-black text-[#0e7c7a]"><Star size={12} className="fill-[#0FB5B1] text-[#0FB5B1]" /> Oui</span> : <span className="text- text-[#8ecfcf]">Non</span> },
    { header: "Statut", key: "status", render: (item) => <span className={`px-2 py-1 rounded-full text- font-bold ${item.status === "Actif"? "bg-[#e0f7f6] text-[#0e7c7a]" : "bg-[#fef1f1] text-[#F25C5C]"}`}>{item.status}</span> },
  ];

  const openAdd = () => { setEditing(null); setForm({ name: "", website: "", type: "Académique", is_featured: false, status: "Actif" }); setIsModalOpen(true); };
  const openEdit = (item: Partenaire) => { setEditing(item); setForm({ name: item.name, website: item.website, type: item.type, is_featured: item.is_featured, status: item.status }); setIsModalOpen(true); };
  const handleDelete = (item: Partenaire) => { if (confirm(`Supprimer ${item.name}?`)) setData(prev => (prev?? []).filter(p => p.id!== item.id)); };

  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      setData(prev => (prev?? []).map(p => p.id === editing.id? {...p,...form } : p));
    } else {
      setData(prev => [{ id: Date.now(),...form },...(prev?? [])]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f0fbfb] min-h-screen">
      <PageHeader
        title="Partenaires"
        subtitle={`${stats.total} partenaires · ${stats.featured} mis en avant · Thème marine turquoise`}
        onAdd={openAdd}
        addLabel="Nouveau partenaire"
      />

      {/* StatsCard turquoise */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total partenaires" value={stats.total.toString()} delta="+2 ce mois" trend="up" color="#0FB5B1" />
        <StatsCard title="Mis en avant" value={stats.featured.toString()} delta={`${Math.round((stats.featured / stats.total) * 100)}%`} trend="up" color="#0e8a87" />
        <StatsCard title="Actifs" value={stats.actif.toString()} delta="100% uptime" trend="up" color="#10b981" />
        <StatsCard title="Marine" value={stats.marine.toString()} delta="Secteur clé" trend="up" color="#0FB5B1" />
      </div>

      {/* CrudTable */}
      <CrudTable
        title="Liste des partenaires"
        columns={columns}
        data={filtered}
        loading={false}
        search={search}
        onSearch={setSearch}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Nouveau partenaire"
        pagination={{ currentPage: 1, lastPage: 1, onPage: () => {} }}
      />

      {/* Modal ajout / edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2e2d]/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-[#c9efed] shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0fbfb]">
              <h3 className="font-black text-[#0f2e2d]">{editing? "Modifier partenaire" : "Nouveau partenaire"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-[#f0fbfb] text-[#8ecfcf]"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <FormField label="Nom du partenaire" required>
                <Input name="name" placeholder="Ex: Port Autonome" value={form.name} onChange={(e) => setForm({...form, name: e.target.value })} />
              </FormField>
              <FormField label="Site web" required>
                <Input name="website" placeholder="https://..." value={form.website} onChange={(e) => setForm({...form, website: e.target.value })} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Type">
                  <Select name="type" value={form.type} onChange={(e) => setForm({...form, type: e.target.value })}>
                    <option value="Académique">Académique</option>
                    <option value="Gouvernement">Gouvernement</option>
                    <option value="Marine">Marine</option>
                    <option value="Privé">Privé</option>
                  </Select>
                </FormField>
                <FormField label="Statut">
                  <Select name="status" value={form.status} onChange={(e) => setForm({...form, status: e.target.value })}>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </Select>
                </FormField>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#0f2e2d] cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({...form, is_featured: e.target.checked })} className="w-4 h-4 rounded border-[#c9efed] text-[#0FB5B1] focus:ring-[#0FB5B1]" />
                Mettre en vedette
              </label>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-[#f0fbfb]">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button onClick={handleSave} className="bg-[#0FB5B1] hover:bg-[#0e8a87] text-white">{editing? "Mettre à jour" : "Créer"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}