"use client";

import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  onAdd?: () => void;
  addLabel?: string;
}

export default function PageHeader({ title, subtitle, icon: Icon, onAdd, addLabel }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={22} className="text-slate-900" strokeWidth={2.5} />}
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
            )}
          </div>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black transition"
          >
            {addLabel ?? "Ajouter"}
          </button>
        )}
      </div>
    </div>
  );
}
