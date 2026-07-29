"use client";

import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export default function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        {Icon && <Icon size={22} className="text-slate-900" strokeWidth={2.5} />}
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
      )}
    </div>
  );
}
