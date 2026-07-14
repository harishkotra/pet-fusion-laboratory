import React, { useState, useEffect } from "react";
import { Beaker, Sparkles, HelpCircle, AlertTriangle, Zap, Atom, Database, RefreshCw, Trash2, BookOpen } from "lucide-react";
import SubjectInput from "./components/SubjectInput";
import StyleSelector from "./components/StyleSelector";
import SpecimenDisplay from "./components/SpecimenDisplay";
import { SAMPLE_ANIMALS, SAMPLE_OBJECTS_OR_ANIMALS, LOADING_STAGES, ART_STYLES } from "./data";
import { FusionResult, GeneticSpecimen } from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [animal1, setAnimal1] = useState("");
  const [animal2, setAnimal2] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState("pixar_3d");
  const [customStyle, setCustomStyle] = useState("");

  const [isSplicing, setIsSplicing] = useState(false);
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  const [currentSpecimen, setCurrentSpecimen] = useState<GeneticSpecimen | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage if available
  const [specimenHistory, setSpecimenHistory] = useState<GeneticSpecimen[]>(() => {
    try {
      const stored = localStorage.getItem("pet_fusion_specimens");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pet_fusion_specimens", JSON.stringify(specimenHistory));
    } catch (e) {
      console.error("Failed to save specimen history:", e);
    }
  }, [specimenHistory]);

  // Loading phase animation interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSplicing) {
      setLoadingStageIndex(0);
      interval = setInterval(() => {
        setLoadingStageIndex((prev) => {
          if (prev < LOADING_STAGES.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isSplicing]);

  const handleSplicing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animal1.trim() || !animal2.trim()) {
      setError("Please input both DNA elements to start genetic fusion.");
      return;
    }

    setIsSplicing(true);
    setError(null);
    setCurrentSpecimen(null);

    try {
      const response = await fetch("/api/fuse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animal1: animal1.trim(),
          animal2_or_object: animal2.trim(),
          style: selectedStyleId,
          customStyle: customStyle.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "A gene sequence mismatch was encountered.");
      }

      const styleName =
        selectedStyleId === "custom"
          ? customStyle || "Custom Formula"
          : ART_STYLES.find((s) => s.id === selectedStyleId)?.name || "Preset";

      const newSpecimen: GeneticSpecimen = {
        id: crypto.randomUUID(),
        animal1: animal1.trim(),
        animal2: animal2.trim(),
        style: styleName,
        result: data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentSpecimen(newSpecimen);
      setSpecimenHistory((prev) => [newSpecimen, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Critical splicing failure. Re-verify particle accelerator.");
    } finally {
      setIsSplicing(false);
    }
  };

  const loadHistorySpecimen = (specimen: GeneticSpecimen) => {
    setAnimal1(specimen.animal1);
    setAnimal2(specimen.animal2);
    const stylePreset = ART_STYLES.find((s) => s.name === specimen.style);
    if (stylePreset) {
      setSelectedStyleId(stylePreset.id);
    } else {
      setSelectedStyleId("custom");
      setCustomStyle(specimen.style);
    }
    setCurrentSpecimen(specimen);
    // Scroll smoothly to output display
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpecimenHistory((prev) => prev.filter((item) => item.id !== id));
    if (currentSpecimen?.id === id) {
      setCurrentSpecimen(null);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to incinerate all historic laboratory records?")) {
      setSpecimenHistory([]);
      setCurrentSpecimen(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Decorative Biotech background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Futuristic ambient light blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none lab-glow" />
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="border-b border-slate-900/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-950/40">
              <Beaker className="text-slate-950" size={20} />
              <div className="absolute inset-0 rounded-xl border border-emerald-400/40 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black font-display tracking-tight text-slate-100 leading-tight">
                PET FUSION <span className="text-emerald-400">LABORATORY</span>
              </h1>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                GENETIC SPLICING INTERFACE • v1.3.1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400/90 tracking-wide font-medium">
              CORE SYSTEM STABLE
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Splicing Console - Form (Left/Main side) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/20 border border-slate-900/90 backdrop-blur-md shadow-xl relative">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              
              <div className="mb-6">
                <h2 className="text-2xl font-black font-display tracking-tight text-slate-100 flex items-center gap-2">
                  🧬 Specimen Splicing Station
                </h2>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                  Welcome, Master Geneticist. Input two biological strings or everyday items below. Our AI sequence analyzer will splice their chromosomes and render them in your chosen aesthetic preset.
                </p>
              </div>

              <form onSubmit={handleSplicing} className="flex flex-col gap-6">
                {/* Step 1: DNA inputs */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Atom className="text-emerald-400" size={18} />
                    <h3 className="text-md font-bold tracking-tight text-slate-200">
                      Step 1: Input DNA Elements
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SubjectInput
                      id="dna-element-a"
                      label="DNA Subject A (Primary Creature)"
                      value={animal1}
                      onChange={setAnimal1}
                      placeholder="e.g. Red Panda, Shark, Corgi"
                      choices={SAMPLE_ANIMALS}
                      icon={<span className="text-indigo-400">🧬</span>}
                    />
                    <SubjectInput
                      id="dna-element-b"
                      label="DNA Subject B (Hybrid Blend/Object)"
                      value={animal2}
                      onChange={setAnimal2}
                      placeholder="e.g. Avocado, Toaster, Jellyfish"
                      choices={SAMPLE_OBJECTS_OR_ANIMALS}
                      icon={<span className="text-teal-400">🧪</span>}
                    />
                  </div>
                </div>

                {/* Step 2: Choose Art Specimen Style */}
                <StyleSelector
                  selectedStyleId={selectedStyleId}
                  onSelectStyleId={setSelectedStyleId}
                  customStyle={customStyle}
                  onChangeCustomStyle={setCustomStyle}
                />

                {/* Splicing Trigger Actions */}
                <div className="flex flex-col gap-4 mt-2">
                  <button
                    type="submit"
                    disabled={isSplicing || !animal1.trim() || !animal2.trim()}
                    className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden cursor-pointer flex items-center justify-center gap-2.5 text-base"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:40px_40px] animate-[pulse_2s_linear_infinite] opacity-20" />
                    <Beaker size={20} className="animate-bounce" />
                    <span>Initiate Molecular Fusion!</span>
                  </button>

                  {error && (
                    <div className="flex items-start gap-2.5 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-300 text-xs">
                      <AlertTriangle className="flex-shrink-0 mt-0.5 text-red-400" size={16} />
                      <div className="leading-relaxed">
                        <strong className="font-semibold text-red-200">Splicing Aborted:</strong> {error}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Splicing Loading Matrix Animation */}
            <AnimatePresence>
              {isSplicing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-8 rounded-3xl bg-slate-950 border border-emerald-500/20 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden"
                >
                  {/* Digital backdrop grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.06)_1.5px,transparent_1.5px)] bg-[size:12px_12px] pointer-events-none" />
                  
                  <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-emerald-500/5 border-b-teal-400 animate-spin" style={{ animationDirection: "reverse" }} />
                    <Sparkles className="text-emerald-400 animate-pulse" size={32} />
                  </div>

                  <h3 className="text-lg font-black font-display text-slate-200 tracking-tight">
                    Splicing Genomes...
                  </h3>
                  
                  {/* Dynamic rotating loading stages */}
                  <div className="h-6 mt-2 relative w-full overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={loadingStageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs font-mono text-emerald-400 tracking-wide"
                      >
                        {LOADING_STAGES[loadingStageIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div className="w-full max-w-sm h-1.5 bg-slate-900 rounded-full overflow-hidden mt-4 border border-slate-800/80">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((loadingStageIndex + 1) / LOADING_STAGES.length) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Specimen Output Results */}
            {currentSpecimen && !isSplicing && (
              <SpecimenDisplay
                animal1={currentSpecimen.animal1}
                animal2={currentSpecimen.animal2}
                styleName={currentSpecimen.style}
                result={currentSpecimen.result}
                imageUrl={currentSpecimen.imageUrl}
                onSetImageUrl={(url) => {
                  setCurrentSpecimen((prev) => prev ? { ...prev, imageUrl: url } : null);
                  // Update item in history as well so it's cached
                  setSpecimenHistory((history) =>
                    history.map((h) => (h.id === currentSpecimen.id ? { ...h, imageUrl: url } : h))
                  );
                }}
              />
            )}

          </div>

          {/* History / Catalog sidebar (Right side) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/20 border border-slate-900/90 backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <Database className="text-emerald-400" size={16} />
                  <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase">
                    Specimen Archives
                  </h3>
                </div>
                {specimenHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[11px] font-medium text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Clean All</span>
                  </button>
                )}
              </div>

              {specimenHistory.length === 0 ? (
                <div className="py-12 text-center text-slate-600 flex flex-col items-center justify-center gap-2.5">
                  <BookOpen size={24} className="stroke-1 opacity-60" />
                  <p className="text-xs leading-relaxed max-w-[200px]">
                    No historical hybrid files logged. Complete a fusion above to save records!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {specimenHistory.map((item) => {
                    const isActive = currentSpecimen?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => loadHistorySpecimen(item)}
                        className={`group relative p-3 rounded-xl border transition-all duration-300 cursor-pointer text-left flex gap-3 items-center ${
                          isActive
                            ? "bg-slate-900 border-emerald-500 shadow-md"
                            : "bg-slate-950/60 border-slate-900 hover:border-slate-800 hover:bg-slate-900/40"
                        }`}
                      >
                        {/* Compact thumbnail preview if render is loaded */}
                        <div className="h-10 w-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.result.creatureName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Atom size={14} className="text-slate-600" />
                          )}
                        </div>

                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                            {item.result.creatureName}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {item.animal1} + {item.animal2} ({item.style})
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => deleteHistoryItem(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all cursor-pointer flex-shrink-0"
                          title="Incinerate Log"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Master Geneticist Instruction panel */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-900/90 text-xs text-slate-400 leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                🔬 Master Geneticist Guideline
              </h4>
              <p>
                1. <strong>Splicing:</strong> Splicing will trigger the server-side Gemini 3.5 LLM to analyze characteristics and generate an image prompt.
              </p>
              <p>
                2. <strong>Visual Synthesis:</strong> Click "Render Specimen Image" on the visualizer block to run Gemini 3.1-Flash-Lite Image synthesis directly from the generated prompt.
              </p>
              <p>
                3. <strong>Copy and Use:</strong> Copy prompts into other text-to-image generators like Midjourney or Stable Diffusion for amazing renders!
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer credit */}
      <footer className="border-t border-slate-900/80 py-8 mt-12 bg-slate-950/90 relative">
        <div className="max-w-6xl mx-auto px-4 text-center flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-mono">
            PET FUSION LABS © 2026 • CODED WITH PRECISION • GEMINI MOLECULAR CORE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <span className="text-slate-500">
              Built By{" "}
              <a
                href="https://harishkotra.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 transition-colors"
              >
                Harish Kotra
              </a>
            </span>
            <span className="text-slate-700">|</span>
            <a
              href="https://dailybuild.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 underline underline-offset-4 decoration-teal-500/30 transition-colors"
            >
              Checkout my other builds
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
