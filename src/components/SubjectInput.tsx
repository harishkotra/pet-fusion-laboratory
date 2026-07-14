import React, { useState } from "react";
import { Sparkles, HelpCircle, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SubjectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  choices: string[];
  icon: React.ReactNode;
}

export default function SubjectInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  choices,
  icon,
}: SubjectInputProps) {
  const [isRolling, setIsRolling] = useState(false);

  const rollChoice = () => {
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomVal = choices[Math.floor(Math.random() * choices.length)];
      onChange(randomVal);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 80);
  };

  return (
    <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm shadow-inner transition-all duration-300 hover:border-emerald-500/30">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
          {icon}
          {label}
        </label>
        <button
          type="button"
          onClick={rollChoice}
          disabled={isRolling}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Roll random subject"
        >
          <Shuffle size={12} className={isRolling ? "animate-spin" : ""} />
          <span>Roll</span>
        </button>
      </div>

      <div className="relative mt-1">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={40}
          className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 placeholder-slate-600 outline-none font-sans transition-all text-base pr-10 shadow-sm"
        />
        {value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            <Sparkles size={16} className="text-emerald-400/80 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
