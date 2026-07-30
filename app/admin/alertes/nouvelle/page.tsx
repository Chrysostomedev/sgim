"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { FormField, Input, Select, RichTextEditor, ImageUpload, DateTimeInput } from "@/components/form/FormInput";
import { AlertTriangle, Newspaper, Upload, Eye, Save, Ship, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NouvelleAlertePage() {
  const [type, setType] = useState<"ALERTE" | "NOUVELLE">("ALERTE");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    titre: "",
    categorie: "Sécurité maritime",
    priorite: "Haute",
    localisation: "MRCC Abidjan",
    date: new Date().toISOString().slice(0, 16),
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);

  const handleImageChange = (files: File[] | any) => {
    const list = Array.isArray(files)? files : [];
    setImages(list);
    if (list[0]) {
      setPreviewImage(URL.createObjectURL(list[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({...form, type, images });
    alert(`${type} créée avec succès (marine turquoise)`);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f0fbfb] min-h-screen">
      <PageHeader
        title={type === "ALERTE"? "Nouvelle Alerte Marine" : "Nouvelle Publication"}
        subtitle="Vue marine turquoise · Champs FormInput + Upload image"
      />

      {/* Switch Alerte / Nouvelle */}
      <div className="flex gap-2 p-1 bg-white rounded-2xl border border-[#c9efed] w-fit shadow-sm">
        <button
          onClick={() => setType("ALERTE")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${type === "ALERTE"? "bg-[#0FB5B1] text-white shadow-md" : "text-[#8ecfcf] hover:text-[#0f2e2d]"}`}
        >
          <AlertTriangle size={16} /> Alerte
        </button>
        <button
          onClick={() => setType("NOUVELLE")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${type === "NOUVELLE"? "bg-[#0FB5B1] text-white shadow-md" : "text-[#8ecfcf] hover:text-[#0f2e2d]"}`}
        >
          <Newspaper size={16} /> Nouvelle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#c9efed] shadow-sm p-6 space-y-5">
            <h3 className="font-black text-[#0f2e2d] flex items-center gap-2"><Ship size={18} className="text-[#0FB5B1]" /> Informations générales</h3>

            <FormField label="Titre de l'alerte / nouvelle" required>
              <Input
                name="titre"
                placeholder={type === "ALERTE"? "Ex: Dérive d'embarcation signalée zone Vridi" : "Ex: Exercice de sauvetage MRSC San Pedro"}
                value={form.titre}
                onChange={(e) => setForm({...form, titre: e.target.value })}
                icon={<AlertTriangle size={14} />}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Catégorie" required>
                <Select name="categorie" value={form.categorie} onChange={(e) => setForm({...form, categorie: e.target.value })}>
                  <option value="Sécurité maritime">Sécurité maritime</option>
                  <option value="Sauvetage">Sauvetage</option>
                  <option value="Pollution">Pollution</option>
                  <option value="Météo">Météo / Mer</option>
                  <option value="Exercice">Exercice</option>
                  <option value="Information">Information</option>
                </Select>
              </FormField>

              <FormField label="Priorité" required>
                <Select name="priorite" value={form.priorite} onChange={(e) => setForm({...form, priorite: e.target.value })}>
                  <option value="Critique">Critique - Rouge</option>
                  <option value="Haute">Haute - Orange</option>
                  <option value="Moyenne">Moyenne - Turquoise</option>
                  <option value="Basse">Basse - Verte</option>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Localisation" required>
                <Input
                  name="localisation"
                  value={form.localisation}
                  onChange={(e) => setForm({...form, localisation: e.target.value })}
                  placeholder="Ex: 5°15'N - 004°02'W"
                  icon={<MapPin size={14} />}
                />
              </FormField>

              <FormField label="Date et heure" required>
                <DateTimeInput name="date" defaultValue={form.date} />
              </FormField>
            </div>

            <FormField label="Description détaillée" required>
              <RichTextEditor
                name="description"
                defaultValue={form.description}
                placeholder="Décrivez l'incident, les moyens engagés, consignes..."
              />
            </FormField>
          </div>

          {/* Upload Image - FormInput */}
          <div className="bg-white rounded-2xl border border-[#c9efed] shadow-sm p-6 space-y-4">
            <h3 className="font-black text-[#0f2e2d] flex items-center gap-2"><Upload size={18} className="text-[#0FB5B1]" /> Média & Pièces jointes</h3>

            <FormField label="Image principale (upload)">
              <ImageUpload name="image" maxImages={3} maxSizeMB={5} onChange={handleImageChange} />
              <p className="text- text-[#8ecfcf] mt-2">JPG, PNG - 5MB max - 3 images max - Composant FormInput</p>
            </FormField>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => history.back()}>Annuler</Button>
            <Button type="submit" className="bg-[#0FB5B1] hover:bg-[#0e8a87] text-white font-black px-6"><Save size={16} className="mr-2" />Publier {type === "ALERTE"? "l'alerte" : "la nouvelle"}</Button>
          </div>
        </form>

        {/* Preview marine */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#c9efed] shadow-sm p-5">
            <h3 className="font-black text-[#0f2e2d] text-sm mb-4 flex items-center gap-2"><Eye size={16} className="text-[#0FB5B1]" /> Aperçu live marine</h3>

            <div className="rounded-xl overflow-hidden border border-[#e0f7f6] bg-[#f0fbfb]">
              {previewImage? (
                <img src={previewImage} alt="preview" className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-[#0FB5B1]/20 to-[#0f2e2d]/30 flex items-center justify-center">
                  <Ship size={32} className="text-white/60" />
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text- font-black ${type === "ALERTE"? "bg-[#fef1f1] text-[#F25C5C] border border-[#F25C5C]/20" : "bg-[#e0f7f6] text-[#0e7c7a]"}`}>{type}</span>
                  <span className="px-2 py-1 rounded-full text- font-bold bg-[#0f2e2d] text-white">{form.priorite}</span>
                </div>
                <p className="font-black text-[#0f2e2d] text- line-clamp-2">{form.titre || "Titre de l'alerte..."}</p>
                <p className="text-xs text-[#5fb8b5] flex items-center gap-1"><MapPin size={12} />{form.localisation} · {form.categorie}</p>
                <p className="text-sm text-[#0f2e2d]/70 line-clamp-3 mt-2">{form.description || "La description s'affichera ici..."}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f2e2d] rounded-2xl p-5 text-white">
            <h4 className="font-bold text-sm mb-3">Checklist publication marine</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li className={`flex items-center gap-2 ${form.titre? "text-[#5fe8e5]" : ""}`}>● Titre renseigné</li>
              <li className={`flex items-center gap-2 ${form.description? "text-[#5fe8e5]" : ""}`}>● Description détaillée</li>
              <li className={`flex items-center gap-2 ${images.length > 0? "text-[#5fe8e5]" : ""}`}>● Au moins 1 image (FormInput)</li>
              <li className="flex items-center gap-2">● Validation MRCC</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}