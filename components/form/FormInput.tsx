"use client";

/**
 * FormInput — barrel d'exports pour tous les inputs du ReusableForm.
 * Chaque composant est minimal et fonctionnel.
 */

import React, { useState, useRef, useEffect, useMemo } from "react"; // ← ajoute React ici
import { Eye, EyeOff, Calendar, Upload, X, ChevronDown, Check, Search } from "lucide-react";

// ── Styles communs ─────────────────────────────────────────────────────────────
const inputCls = "w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-50";

// ── FormField wrapper ─────────────────────────────────────────────────────────
export function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children}
        </div>
    );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({
    name, type = "text", placeholder, required, disabled,
    value, defaultValue, onChange, icon,
}: {
    name: string; type?: string; placeholder?: string; required?: boolean;
    disabled?: boolean; value?: string; defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
}) {
    return (
        <div className="relative">
            {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
            <input
                name={name} type={type} placeholder={placeholder}
                required={required} disabled={disabled}
                value={value} defaultValue={defaultValue}
                onChange={onChange}
                className={`${inputCls} ${icon ? "pl-10" : ""}`}
            />
        </div>
    );
}

// ── PasswordInput ─────────────────────────────────────────────────────────────
export function PasswordInput({ name, placeholder, required, disabled, defaultValue }: {
    name: string; placeholder?: string; required?: boolean; disabled?: boolean; defaultValue?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                name={name} type={show ? "text" : "password"}
                placeholder={placeholder} required={required}
                disabled={disabled} defaultValue={defaultValue}
                className={`${inputCls} pr-11`}
            />
            <button type="button" onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
}

// ── Select custom orange/blanc + search auto ─────────────────────────────────

export function Select({
    name,
    required,
    disabled,
    value,
    defaultValue,
    onChange,
    icon,
    children,
    placeholder = "Sélectionner..."
}: {
    name: string;
    required?: boolean;
    disabled?: boolean;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    icon?: React.ReactNode;
    children: React.ReactNode;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedValue, setSelectedValue] = useState(value?? defaultValue?? "");
    const [selectedLabel, setSelectedLabel] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    const options = useMemo(() => {
        const opts: { value: string; label: string }[] = [];
        React.Children.forEach(children, (child: any) => {
            if (child?.type === 'option') {
                opts.push({
                    value: child.props.value?? "",
                    label: child.props.children?? ""
                });
            }
        });
        return opts;
    }, [children]);

    useEffect(() => {
        const opt = options.find(o => o.value === selectedValue);
        setSelectedLabel(opt?.label?? placeholder);
    }, [selectedValue, options, placeholder]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current &&!wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (val: string, label: string) => {
        setSelectedValue(val);
        setSelectedLabel(label);
        setOpen(false);
        setSearch("");
        if (onChange) {
            const fakeEvent = {
                target: { name, value: val }
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange(fakeEvent);
        }
    };

    const showSearch = options.length > 6;

    return (
        <div ref={wrapperRef} className="relative">
            <input type="hidden" name={name} value={selectedValue} required={required} />

            <button
                type="button"
                onClick={() =>!disabled && setOpen(!open)}
                disabled={disabled}
                className={`${inputCls} ${icon? "pl-10" : ""} pr-10 text-left flex items-center justify-between ${
                    disabled? "cursor-not-allowed" : "cursor-pointer hover:border-[#0FB5B1]"
                } ${open? "ring-2 ring-[#0FB5B1]/20 border-[#0FB5B1]" : ""}`}
            >
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ecfcf] pointer-events-none">
                        {icon}
                    </span>
                )}
                <span className={`truncate ${!selectedValue? "text-[#8ecfcf]" : "text-[#0f2e2d]"}`}>
                    {selectedLabel}
                </span>
                <ChevronDown
                    size={16}
                    className={`absolute right-3 text-[#8ecfcf] transition-transform ${open? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute z-50 w-full mt-1.5 bg-white rounded-xl border border-[#c9efed] shadow-lg shadow-[#0FB5B1]/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {showSearch && (
                        <div className="p-2 border-b border-[#f0fbfb] bg-[#f0fbfb]/50">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ecfcf]" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher..."
                                    className="w-full pl-9 pr-3 py-2 text- bg-white border border-[#c9efed] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0FB5B1]/20 focus:border-[#0FB5B1]"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}

                    <div className="max-h-60 overflow-y-auto py-1">
                        {filteredOptions.length === 0? (
                            <div className="px-3 py-8 text-center text- text-[#8ecfcf] italic">
                                Aucun résultat
                            </div>
                        ) : (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value === selectedValue;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt.value, opt.label)}
                                        className={`w-full px-3 py-2.5 text-left text- font-medium transition-colors flex items-center justify-between gap-2 ${
                                            isSelected
                                              ? "bg-[#0FB5B1] text-white"
                                                : "text-[#0f2e2d] hover:bg-[#f0fbfb] hover:text-[#0e7c7a]"
                                        }`}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {isSelected && <Check size={16} className="shrink-0" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── DateInput ─────────────────────────────────────────────────────────────────
export function DateInput({ name, required, disabled, defaultValue, disablePastDates, icon }: {
    name: string; required?: boolean; disabled?: boolean;
    defaultValue?: string; disablePastDates?: boolean; icon?: React.ReactNode;
}) {
    const min = disablePastDates ? new Date().toISOString().split("T")[0] : undefined;
    return (
        <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
                type="date" name={name} required={required} disabled={disabled}
                defaultValue={defaultValue} min={min}
                className={`${inputCls} pl-10`}
            />
        </div>
    );
}

// ── DateTimeInput ─────────────────────────────────────────────────────────────
export function DateTimeInput({ name, required, disabled, defaultValue, disablePastDates, icon }: {
    name: string; required?: boolean; disabled?: boolean;
    defaultValue?: string; disablePastDates?: boolean; icon?: React.ReactNode;
}) {
    const min = disablePastDates ? new Date().toISOString().slice(0, 16) : undefined;
    return (
        <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
                type="datetime-local" name={name} required={required} disabled={disabled}
                defaultValue={defaultValue} min={min}
                className={`${inputCls} pl-10`}
            />
        </div>
    );
}

// ── DateRangeInput ────────────────────────────────────────────────────────────
export function DateRangeInput({ name, required, disabled, defaultValue, disablePastDates }: {
    name: string; required?: boolean; disabled?: boolean;
    defaultValue?: any; disablePastDates?: boolean;
}) {
    const min = disablePastDates ? new Date().toISOString().split("T")[0] : undefined;
    const start = defaultValue?.from ?? defaultValue?.start ?? "";
    const end   = defaultValue?.to   ?? defaultValue?.end   ?? "";
    return (
        <div className="flex items-center gap-2">
            <div className="relative flex-1">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="date" name={`${name}_start`} defaultValue={start} min={min}
                    disabled={disabled} required={required} className={`${inputCls} pl-9 text-[13px]`}
                />
            </div>
            <span className="text-slate-400 font-bold shrink-0">→</span>
            <div className="relative flex-1">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="date" name={`${name}_end`} defaultValue={end} min={min}
                    disabled={disabled} className={`${inputCls} pl-9 text-[13px]`}
                />
            </div>
        </div>
    );
}

// ── RichTextEditor (textarea simple) ─────────────────────────────────────────
export function RichTextEditor({ name, label, placeholder, defaultValue }: {
    name: string; label?: string; placeholder?: string; defaultValue?: string;
}) {
    return (
        <textarea
            name={name} placeholder={placeholder ?? "Cliquez pour saisir"}
            defaultValue={defaultValue}
            className={`${inputCls} min-h-[120px] resize-y`}
        />
    );
}

// ── ImageUpload ────────────────────────────────────────────────────────────────
export function ImageUpload({ name, maxImages = 3, maxSizeMB = 2, defaultValue, onChange, isLoading }: {
    name: string; maxImages?: number; maxSizeMB?: number;
    defaultValue?: any; onChange?: (data: any) => void; isLoading?: boolean;
}) {
    const [files, setFiles] = useState<string[]>(
        Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
    );
    const ref = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []).slice(0, maxImages - files.length);
        const urls = selected.map(f => URL.createObjectURL(f));
        const next = [...files, ...urls].slice(0, maxImages);
        setFiles(next);
        onChange?.(selected);
    };

    return (
        <div className="space-y-2">
            <div
                onClick={() => ref.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl py-8 flex flex-col items-center gap-2 cursor-pointer hover:border-[#f97316] transition-colors bg-orange-50/30"
            >
                <Upload size={24} className="text-[#f97316]" />
                <p className="text-[12px] text-slate-500 font-medium">Choisissez un fichier ou glissez et deposez</p>
                <p className="text-[11px] text-orange-400">Excel, Powerpoint, Pdf, Png, Jpeg ou Autres. {maxSizeMB ?? 50} MB maximum</p>
                <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
            </div>
            {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {files.map((url, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => { const n = files.filter((_, idx) => idx !== i); setFiles(n); onChange?.(n); }}
                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── PdfUpload ─────────────────────────────────────────────────────────────────
export function PdfUpload({ name, maxPDFs = 1, maxSizeMB, defaultValue, onChange, accept, placeholder, isLoading }: {
    name: string; maxPDFs?: number; maxSizeMB?: number;
    defaultValue?: any; onChange?: (data: any) => void;
    accept?: string; placeholder?: string; isLoading?: boolean;
}) {
    const [files, setFiles] = useState<File[]>([]);
    const ref = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []).slice(0, maxPDFs);
        setFiles(selected);
        onChange?.(selected);
    };

    return (
        <div className="space-y-2">
            <div
                onClick={() => ref.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl py-6 flex flex-col items-center gap-2 cursor-pointer hover:border-[#f97316] transition-colors"
            >
                <Upload size={20} className="text-[#f97316]" />
                <p className="text-[12px] text-slate-500 font-medium">{placeholder ?? "Choisissez un fichier"}</p>
                <input ref={ref} type="file" accept={accept ?? ".pdf"} multiple={maxPDFs > 1} className="hidden" onChange={handleChange} />
            </div>
            {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-[12px]">
                    <span className="flex-1 truncate font-medium">{f.name}</span>
                    <button type="button" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500">
                        <X size={13} />
                    </button>
                </div>
            ))}
        </div>
    );
}

// ── PhoneInput ────────────────────────────────────────────────────────────────
export function PhoneInput({ name, required, disabled, defaultValue, onChange }: {
    name: string; required?: boolean; disabled?: boolean;
    defaultValue?: string; onChange?: (val: string) => void;
}) {
    return (
        <input
            type="tel" name={name} required={required} disabled={disabled}
            defaultValue={defaultValue} placeholder="+225 07 00 00 00 00"
            onChange={(e) => onChange?.(e.target.value)}
            className={inputCls}
        />
    );
}

// ── Checkbox ──────────────────────────────────────────────────────────────────
export function Checkbox({ name, label, required, disabled, defaultChecked, onChange }: {
    name: string; label?: string; required?: boolean; disabled?: boolean;
    defaultChecked?: boolean; onChange?: (checked: boolean) => void;
}) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer">
            <input
                type="checkbox" name={name} required={required} disabled={disabled}
                defaultChecked={defaultChecked}
                onChange={(e) => onChange?.(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#f97316] focus:ring-[#f97316]"
            />
            {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
        </label>
    );
}

// ── MultiUserSelect — sélecteur multi-utilisateurs ────────────────────────────
export interface UserOption { id: number | string; name: string; role?: string; color?: string; }

export function MultiUserSelect({ users, selected, onChange, placeholder = "Rechercher un utilisateur..." }: {
    users:       UserOption[];
    selected:    (number | string)[];
    onChange:    (ids: (number | string)[]) => void;
    placeholder?: string;
}) {
    const [search, setSearch] = useState("");
    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );
    const COLORS = ["bg-orange-400","bg-purple-400","bg-blue-400","bg-pink-400","bg-teal-400","bg-emerald-400"];

    const toggle = (id: number | string) => {
        onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
    };

    return (
        <div className="space-y-3">
            {/* Search */}
            <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={placeholder}
                className={inputCls}
            />

            {/* Liste */}
            <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-50">
                {filtered.length === 0 && (
                    <p className="py-4 text-center text-slate-400 text-[12px]">Aucun utilisateur trouvé</p>
                )}
                {filtered.map((u, i) => {
                    const checked = selected.includes(u.id);
                    const color   = u.color ?? COLORS[i % COLORS.length];
                    const initials = u.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
                    return (
                        <div
                            key={u.id}
                            onClick={() => toggle(u.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${checked ? "bg-orange-50" : "hover:bg-slate-50"}`}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggle(u.id)}
                                className="w-4 h-4 rounded border-slate-300 text-[#f97316] focus:ring-[#f97316]"
                            />
                            <div className={`w-8 h-8 rounded-full ${color} text-white text-[11px] font-black flex items-center justify-center shrink-0`}>
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-slate-800 truncate">{u.name}</p>
                                {u.role && <p className="text-[11px] text-slate-400 font-medium">{u.role}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sélectionnés */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selected.map(id => {
                        const u = users.find(u => u.id === id);
                        if (!u) return null;
                        return (
                            <span key={id} className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[11px] font-bold">
                                {u.name}
                                <button type="button" onClick={() => toggle(id)} className="hover:text-red-500 transition">×</button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
