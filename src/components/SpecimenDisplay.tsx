import React, { useState } from "react";
import { FusionResult } from "../types";
import { Copy, Check, Sparkles, Image, Zap, FileText, AlertTriangle, Atom, Eye, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SpecimenDisplayProps {
  animal1: string;
  animal2: string;
  styleName: string;
  result: FusionResult;
  imageUrl?: string;
  onSetImageUrl: (url: string) => void;
}

export default function SpecimenDisplay({
  animal1,
  animal2,
  styleName,
  result,
  imageUrl,
  onSetImageUrl,
}: SpecimenDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.imagePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderVisualSpecimen = async () => {
    setIsRendering(true);
    setRenderError(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: result.imagePrompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to render visual representation.");
      }

      if (data.imageUrl) {
        onSetImageUrl(data.imageUrl);
      } else {
        throw new Error("No image URL returned from laboratory rendering engine.");
      }
    } catch (err: any) {
      console.error(err);
      setRenderError(
        err?.message || "Molecular compilation error: Splicing core unstable."
      );
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 flex flex-col gap-6"
    >
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Atom className="text-emerald-400 animate-spin" style={{ animationDuration: "6s" }} size={20} />
        <h2 className="text-xl font-bold tracking-tight text-slate-100 font-display">
          Specimen Splicing Complete!
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Splicing Data & Prompt */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-slate-900/60 border border-emerald-500/20 shadow-md">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/10">
              🧬 New Specimen Logged
            </span>
            <h3 className="text-2xl font-black text-slate-100 font-display mt-3 tracking-tight">
              {result.creatureName}
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Fusing <span className="text-emerald-400 font-medium">{animal1}</span> with{" "}
              <span className="text-emerald-400 font-medium">{animal2}</span> in{" "}
              <span className="text-emerald-400 font-medium">{styleName}</span> style.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-xs font-mono font-semibold tracking-wider text-slate-500 block mb-1">
                🔬 Humorous Scientific Bio:
              </span>
              <p className="text-slate-300 text-sm italic leading-relaxed">
                "{result.funBio}"
              </p>
            </div>
          </div>

          {/* Copy Paste Prompt Card */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText size={14} className="text-emerald-400" />
                Optimized Image Generator Prompt
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 font-medium transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={13} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Code Block */}
            <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950/95 shadow-lg">
              <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
                {result.imagePrompt}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: Rendering Frame */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye size={14} className="text-emerald-400" />
              Visualizer Stage
            </span>
          </div>

          <div className="relative aspect-square w-full rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center overflow-hidden shadow-lg group">
            {/* Visualizer Loading State */}
            <AnimatePresence>
              {isRendering && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90"
                >
                  <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                    {/* Ring spinning */}
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-emerald-500/10 border-b-emerald-400 animate-spin" style={{ animationDirection: "reverse" }} />
                    <Atom className="text-emerald-400 animate-pulse" size={32} />
                  </div>
                  <h4 className="text-base font-bold text-slate-200 tracking-tight font-display text-center">
                    Crystallizing Specimen Structure...
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 text-center max-w-xs font-mono">
                    Compiling prompt aesthetics into pixel clusters. This takes ~5 seconds.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {imageUrl ? (
              /* Success Rendering State */
              <div className="relative w-full h-full">
                <img
                  src={imageUrl}
                  alt={result.creatureName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <a
                    href={imageUrl}
                    download={`${result.creatureName.toLowerCase().replace(/\s+/g, "_")}.png`}
                    className="p-2 rounded-full bg-slate-950/80 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 transition-colors border border-slate-800"
                    title="Download Image"
                  >
                    <Download size={15} />
                  </a>
                </div>
              </div>
            ) : renderError ? (
              /* Fallback Beautiful Blueprint Schematic Layout */
              <div className="absolute inset-0 flex flex-col p-6 overflow-y-auto bg-slate-900 border border-cyan-500/30 relative" style={{
                backgroundImage: "radial-gradient(rgba(6, 182, 212, 0.08) 1.5px, transparent 1.5px)",
                backgroundSize: "16px 16px",
              }}>
                <div className="flex flex-col items-center justify-center flex-grow text-center">
                  <div className="relative mb-4 flex items-center justify-center">
                    {/* Pulsing blueprint circle */}
                    <div className="absolute inset-0 rounded-full bg-cyan-500/5 animate-ping" style={{ animationDuration: "3s" }} />
                    <div className="p-4 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-cyan-400 relative">
                      <Atom size={32} className="animate-spin" style={{ animationDuration: "12s" }} />
                    </div>
                  </div>

                  <h4 className="text-sm font-black font-mono text-cyan-400 uppercase tracking-widest">
                    GENETIC BLUEPRINT GENERATED
                  </h4>
                  
                  {/* Detailed Specimen Schematic Box */}
                  <div className="mt-4 w-full p-4 rounded-xl border border-cyan-500/20 bg-slate-950/80 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 bg-cyan-500/10 text-cyan-400 font-mono text-[8px] border-bl border-cyan-500/15">
                      CODE: SEC-99
                    </div>
                    
                    <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-wider block mb-2 font-bold">
                      🧬 SPECIMEN MOLECULAR SCHEMATIC:
                    </span>
                    
                    <div className="space-y-2 text-[11px] font-mono text-slate-300">
                      <div className="flex justify-between border-b border-cyan-500/10 pb-1">
                        <span className="text-cyan-600">SPECIMEN CODENAME:</span> 
                        <span className="text-cyan-300 font-bold">{result.creatureName.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between border-b border-cyan-500/10 pb-1">
                        <span className="text-cyan-600">PRIMARY SEQUENCE:</span> 
                        <span className="text-slate-200">{animal1.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between border-b border-cyan-500/10 pb-1">
                        <span className="text-cyan-600">SPLICE CATALYST:</span> 
                        <span className="text-slate-200">{animal2.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between pb-0.5">
                        <span className="text-cyan-600">TARGET AESTHETIC:</span> 
                        <span className="text-amber-400">{styleName.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-4 leading-relaxed font-sans max-w-xs">
                    Due to high traffic, the Gemini visualizer is temporarily resting. But your custom genetic sequence is perfectly compiled! 
                  </p>
                  
                  <div className="mt-4 text-[11px] text-cyan-400 font-mono bg-cyan-950/20 px-3 py-1.5 rounded-full border border-cyan-500/10">
                    💡 Copy prompt above for Midjourney or DALL-E!
                  </div>

                  {/* Retry action link */}
                  <button
                    type="button"
                    onClick={renderVisualSpecimen}
                    className="mt-4 text-xs font-semibold text-slate-400 hover:text-emerald-400 underline transition-all cursor-pointer"
                  >
                    Tap to Re-Attempt Image Synthesis
                  </button>
                </div>
              </div>
            ) : (
              /* Initial State: Prompting to Render */
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500 mb-4 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-300">
                  <Image size={32} />
                </div>
                <h4 className="text-sm font-bold text-slate-300">Visualizer Core Offline</h4>
                <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
                  Compile genetic code to formulate a funny hybrid name and image prompt, then tap below to run the rendering scanner.
                </p>
                <button
                  type="button"
                  onClick={renderVisualSpecimen}
                  className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-emerald-500/10 transform active:scale-95 cursor-pointer"
                >
                  <Zap size={13} className="fill-current" />
                  Render Specimen Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
