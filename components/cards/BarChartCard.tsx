"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Ban } from "lucide-react";

type BarChartData = {
  label: string;
  value: number;
  color?: string;
};

type BarChartCardProps = {
  title?: string;
  data?: BarChartData[];
  onYearChange?: (year: string) => void;
};

const YEARS = ["2025", "2026", "2027", "2028", "2029", "2030"];
const CURRENT_YEAR = new Date().getFullYear().toString();
const DEFAULT_YEAR = YEARS.includes(CURRENT_YEAR)? CURRENT_YEAR : YEARS[0];

export default function BarChartCard({
  title = "Tendance des tickets sur l'année",
  data = [],
  onYearChange,
}: BarChartCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);

  const isFutureYear = (year: string) => parseInt(year) > parseInt(CURRENT_YEAR);

  const handleYearSelect = (year: string) => {
    if (isFutureYear(year)) return;
    setSelectedYear(year);
    setIsOpen(false);
    if (onYearChange) onYearChange(year);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#c9efed] shadow-sm p-8 text-[#5fb8b5] text-sm flex items-center justify-center h-64">
        Aucune donnée pour {selectedYear}
      </div>
    );
  }

  const realMax = Math.max(...data.map((d) => d.value));
  const maxValue = realMax === 0? 100 : realMax > 1000
   ? Math.ceil(realMax / 1000) * 1000
    : Math.ceil(realMax / 100) * 100;

  const yAxisMarkers = [maxValue, Math.round(maxValue * 0.66), Math.round(maxValue * 0.33), 0];

  return (
    <div className="bg-white rounded-2xl border border-[#c9efed] shadow-sm p-6 relative z-10 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 relative z-20">
        <h3 className="font-black text-[#0f2e2d] text-">{title}</h3>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-[#f0fbfb] border border-[#c9efed] rounded-xl text-sm font-black text-[#0f2e2d] hover:bg-white transition-all"
          >
            {selectedYear}
            <ChevronDown size={14} className={`text-[#0FB5B1] transition-transform ${isOpen? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {isOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 5, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full w-32 bg-white border border-[#c9efed] shadow-xl rounded-2xl p-2 z-40"
                >
                  {YEARS.map((year) => {
                    const future = isFutureYear(year);
                    return (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        disabled={future}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between ${future? "text-slate-300 cursor-not-allowed" : selectedYear === year? "bg-[#0FB5B1] text-white" : "text-[#0f2e2d] hover:bg-[#f0fbfb]"}`}
                      >
                        <span>{year}</span>
                        {future && <Ban size={12} className="text-[#F25C5C]" />}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full flex-1 pt-2 pb-8">
        <div className="relative flex h-full">
          <div className="flex flex-col justify-between w-8 text-[#8ecfcf] text- font-black text-right pr-2">
            {yAxisMarkers.map((m) => <span key={m}>{m >= 1000? `${Math.round(m/1000)}K` : m}</span>)}
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {yAxisMarkers.map((m) => <div key={m} className="w-full h- bg-[#f0fbfb]" />)}
            </div>
            <div className="absolute inset-0 flex items-end gap-1.5 px-1">
              {data.map((item) => (
                <div key={item.label} className="flex flex-col items-center flex-1 h-full group">
                  <div className="flex-1 w-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: maxValue === 0? "4px" : `${(item.value / maxValue) * 100}%` }}
                      transition={{ type: "spring", damping: 15, stiffness: 100 }}
                      style={{ backgroundColor: item.color || "#0FB5B1" }}
                      className="w-full rounded-t-lg hover:brightness-110 cursor-pointer relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0f2e2d] text-white text- py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold whitespace-nowrap z-10">
                        {item.value}
                      </div>
                    </motion.div>
                  </div>
                  <span className="absolute -bottom-6 text-[#5fb8b5] text- font-black">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}