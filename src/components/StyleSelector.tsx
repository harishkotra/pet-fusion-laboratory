import React from "react";
import { ART_STYLES } from "../data";
import { Palette, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelectStyleId: (id: string) => void;
  customStyle: string;
  onChangeCustomStyle: (val: string) => void;
}

export default function StyleSelector({
  selectedStyleId,
  onSelectStyleId,
  customStyle,
  onChangeCustomStyle,
}: StyleSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <Palette className="text-emerald-400" size={18} />
        <h3 className="text-md font-bold tracking-tight text-slate-200">
          Step 2: Choose Art Specimen Style
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ART_STYLES.map((style) => {
          const isSelected = selectedStyleId === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyleId(style.id)}
              className={`relative flex flex-col items-start p-4 text-left rounded-2xl border transition-all duration-300 group cursor-pointer overflow-hidden ${
                isSelected
                  ? "bg-slate-900/90 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-slate-900/30 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 rounded-bl-full flex items-center justify-end pr-2.5 pb-2.5">
                  <Sparkles size={12} className="text-emerald-400 animate-pulse" />
                </div>
              )}
              <span className={`text-xs font-semibold uppercase tracking-wider ${
                isSelected ? "text-emerald-400" : "text-slate-500"
              }`}>
                {style.tagline}
              </span>
              <span className="text-base font-bold text-slate-100 mt-0.5">
                {style.name}
              </span>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {style.description}
              </p>
            </button>
          );
        })}

        {/* Custom Style Option */}
        <button
          type="button"
          onClick={() => onSelectStyleId("custom")}
          className={`relative flex flex-col items-start p-4 text-left rounded-2xl border transition-all duration-300 group cursor-pointer ${
            selectedStyleId === "custom"
              ? "bg-slate-900/90 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              : "bg-slate-900/30 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
          }`}
        >
          {selectedStyleId === "custom" && (
            <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 rounded-bl-full flex items-center justify-end pr-2.5 pb-2.5">
              <Sparkles size={12} className="text-emerald-400" />
            </div>
          )}
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            selectedStyleId === "custom" ? "text-emerald-400" : "text-slate-500"
          }`}>
            Experimental
          </span>
          <span className="text-base font-bold text-slate-100 mt-0.5">
            Custom Formula
          </span>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Write your own customized art medium, artist styles, or lighting filters.
          </p>
        </button>
      </div>

      {/* Custom Style Input Box */}
      {selectedStyleId === "custom" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 mt-2"
        >
          <label htmlFor="custom-style-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Describe Custom Art Formula
          </label>
          <input
            id="custom-style-input"
            type="text"
            value={customStyle}
            onChange={(e) => onChangeCustomStyle(e.target.value)}
            placeholder="e.g. Claymation figurine, photolithography, deep forest oil painting..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg text-slate-100 outline-none text-sm transition-all"
          />
        </motion.div>
      )}
    </div>
  );
}
