"use client";

import { useState } from "react";
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  Package, 
  Layers, 
  Info, 
  Database, 
  Globe, 
  Zap, 
  ShieldAlert, 
  ArrowUpRight, 
  ChevronRight,
  DatabaseZap,
  CheckCircle2,
  AlertCircle,
  X,
  Container,
  Activity,
  Target,
  Terminal,
  Cpu,
  Radio,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function SyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startSync = async () => {
    setSyncing(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/sync-surplus", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to sync data.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sync.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-head font-black text-white uppercase tracking-tighter leading-none">Inventory <span className="text-gold/80 italic">Ingestion</span></h1>
           <p className="text-sm text-white/40 font-medium italic flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <Target size={12} className="text-gold" /> Consolidating product nodes from <span className="text-gold font-bold uppercase tracking-widest text-[9px] ring-1 ring-gold/20 px-2 py-0.5 bg-gold/5 rounded-sm italic mx-1">alliedsurplus.com</span> Hub.
           </p>
        </div>
        
        <div className="flex items-center gap-4 bg-charcoal p-4 rounded-sm border border-white/5 shadow-2xl shadow-black/40">
           <div className="flex flex-col items-end px-4 border-r border-white/5">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Source Node</span>
              <span className="text-emerald-400 font-bold flex items-center gap-2 text-xs uppercase tracking-widest italic outline-none">
                <Globe size={12} className="text-gold" /> LIVE MATRIX
              </span>
           </div>
           <div className="flex flex-col items-end px-2">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Tunnel Status</span>
              <span className="text-white/80 font-bold text-xs uppercase tracking-widest italic flex items-center gap-2">
                 <Lock size={12} className="text-gold" /> SECURED
              </span>
           </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CONTROL COLUMN */}
        <div className="lg:col-span-1 space-y-10">
           <motion.div 
             className="relative bg-charcoal border border-white/5 p-10 rounded-sm shadow-2xl shadow-black/60 space-y-8 overflow-hidden group"
             whileHover={{ y: -5 }}
             transition={{ type: "spring", stiffness: 300 }}
           >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 -rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="relative z-10 flex items-center gap-5">
                 <div className="h-12 w-12 rounded-sm bg-olive/10 border border-olive/30 text-gold flex items-center justify-center ring-1 ring-gold/5 shadow-inner transition-all group-hover:bg-olive group-hover:text-white group-hover:ring-gold/30">
                    <DatabaseZap size={22} strokeWidth={2.5} />
                 </div>
                 <h3 className="text-xl font-head font-black text-white uppercase tracking-tighter italic">Sync Protocol</h3>
              </div>
              <p className="relative z-10 text-[11px] font-bold text-white/30 leading-relaxed italic uppercase tracking-wider border-l-2 border-gold/20 pl-6">
                Execute the mission-critical ingestion of fresh product nodes and supply hierarchy schemas. Existing data integrity will be prioritized and updated.
              </p>
              <button 
                onClick={startSync}
                disabled={syncing}
                className={cn(
                  "relative z-10 w-full h-16 rounded-sm flex items-center justify-center gap-4 font-head font-bold uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95 shadow-2xl",
                  syncing 
                    ? "bg-ink text-white/20 cursor-not-allowed border border-white/5" 
                    : "bg-red text-white hover:bg-red-lt shadow-red/20"
                )}
              >
                {syncing ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} />}
                {syncing ? "Ingesting Matrix Core..." : "Initiate Field Sync Phase"}
              </button>
           </motion.div>

           <div className="bg-ink border border-white/5 p-10 rounded-sm space-y-8 shadow-2xl shadow-black/80 relative overflow-hidden group">
              <div className="absolute top-0 right-0 mt-6 mr-6 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Cpu size={120} className="text-white" />
              </div>
              <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Operational Meta</h3>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                    <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest italic">Monitoring</span>
                 </div>
              </div>
              <div className="relative z-10 space-y-6">
                 {[
                   { label: "Target Density", val: "100 Units", icon: Layers },
                   { label: "Asset Mapping", val: "Recursive", icon: Zap },
                   { label: "Schema Sync", val: "Level-1", icon: Container },
                 ].map((meta, i) => (
                   <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group/item">
                      <div className="flex items-center gap-4 text-white/20 group-hover/item:text-gold transition-colors">
                         <meta.icon size={16} />
                         <span className="text-[10px] font-black uppercase tracking-[0.25em]">{meta.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-gold/60 uppercase tracking-widest italic">{meta.val}</span>
                   </div>
                 ))}
              </div>
              <div className="pt-4">
                 <button className="w-full h-12 border border-white/5 bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white hover:border-gold/30 hover:bg-gold/5 transition-all italic">Diagnostics Engine</button>
              </div>
           </div>
        </div>

        {/* RESULT COLUMN */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {result || error ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "relative overflow-hidden p-12 rounded-sm border shadow-black/80 shadow-2xl group min-h-[600px]",
                    error ? "bg-red/[0.03] border-red/20" : "bg-emerald-400/[0.03] border-emerald-500/20"
                  )}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-current opacity-[0.02] -rotate-45 translate-x-16 -translate-y-16" />
                  
                  <div className="flex items-center gap-8 mb-12 relative z-10">
                    <div className={cn(
                      "h-20 w-20 rounded-sm flex items-center justify-center shadow-2xl ring-1 ring-white/10 shadow-black/40",
                      error ? "bg-red text-white" : "bg-emerald-500 text-white"
                    )}>
                      {error ? <ShieldAlert size={40} strokeWidth={2.5} /> : <CheckCircle2 size={40} strokeWidth={2.5} />}
                    </div>
                    <div>
                        <h2 className={cn("text-3xl font-head font-black uppercase tracking-tighter italic", error ? "text-red" : "text-emerald-400")}>
                          {error ? "Protocol Breach Detected" : "Ingestion Synchronization Successful"}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic mt-2">Intelligence Report Generated at {new Date().toLocaleTimeString()} // ID: 0{Math.floor(Math.random()*9999)}</p>
                    </div>
                  </div>
                  
                  {result && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-ink border border-white/5 p-10 rounded-sm shadow-2xl shadow-black/60 group/card hover:border-gold/20 transition-all">
                            <div className="h-14 w-14 bg-charcoal text-white/20 flex items-center justify-center rounded-sm mb-6 border border-white/10 group-hover/card:bg-olive group-hover/card:text-white transition-all ring-1 ring-gold/0 group-hover/card:ring-gold/20 shadow-inner group-hover/card:scale-110"><Package size={24} /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3 italic">Material & Supply Nodes Ingested</h4>
                            <div className="flex items-baseline gap-4">
                               <p className="text-6xl font-head font-black text-white tracking-tighter drop-shadow-2xl">{result.count}</p>
                               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Sync Complete</span>
                            </div>
                        </div>
                        <div className="bg-olive border border-olive/30 p-10 rounded-sm shadow-2xl shadow-olive/10 flex flex-col justify-center text-white ring-1 ring-gold/10">
                            <div className="flex items-center gap-3 mb-4 opacity-60">
                               <Radio size={14} className="animate-pulse" />
                               <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Phase</h4>
                            </div>
                            <p className="text-2xl font-head font-black uppercase tracking-tighter italic leading-tight">Sector Data High-Link Synchronized</p>
                        </div>
                      </div>
                      
                      <div className="p-8 bg-charcoal border border-white/5 rounded-sm shadow-inner italic flex items-start gap-6 border-l-4 border-l-emerald-500/40">
                        <Activity size={24} className="text-emerald-400 flex-shrink-0 mt-1 animate-pulse" />
                        <div className="space-y-3">
                           <p className="text-[12px] font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                              The matrix core has been force-updated with the latest intelligence from source nodes.
                           </p>
                           <div className="flex gap-4">
                              <a href="/admin/products" className="text-[10px] font-black text-gold uppercase tracking-[0.2em] hover:text-white hover:underline transition-all italic flex items-center gap-2">View Materials <ArrowUpRight size={14} /></a>
                              <a href="/admin/categories" className="text-[10px] font-black text-gold uppercase tracking-[0.2em] hover:text-white hover:underline transition-all italic flex items-center gap-2">View Taxonomy <ArrowUpRight size={14} /></a>
                           </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                         <button onClick={() => setResult(null)} className="h-12 px-8 border border-white/10 text-white/20 text-[10px] font-black uppercase tracking-[0.3em] hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all italic rounded-sm">Purge Ingestion Report</button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="animate-in slide-in-from-top-4 duration-500 relative z-10 space-y-10">
                       <div className="bg-ink border border-red/20 p-10 rounded-sm shadow-2xl shadow-black/80 space-y-6">
                          <div className="flex items-center gap-3">
                             <ShieldAlert className="text-red" size={20} />
                             <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-red italic">Protocol Breach Logs</h4>
                          </div>
                          <p className="text-sm font-bold text-white/60 leading-tight italic uppercase tracking-wider drop-shadow-2xl">{error}</p>
                          <div className="pt-4 border-t border-white/5">
                             <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] leading-relaxed italic">
                               Interception failed. Ensure the satellite link to the source node is established and encryption keys are valid. Re-triggering protocol may be necessary.
                             </p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button onClick={startSync} className="h-16 px-12 bg-red text-white font-head font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-red/20 hover:bg-red-lt transition-all active:scale-95 rounded-sm flex items-center gap-4"><RefreshCw size={20} /> Force Re-Execute Phase</button>
                          <button onClick={() => setError(null)} className="h-16 px-10 border border-white/10 text-white/20 font-head font-bold uppercase tracking-widest text-[11px] hover:text-white hover:border-white/30 transition-all rounded-sm italic">Abort Intel Report</button>
                       </div>
                    </div>
                  )}
                </motion.div>
             ) : (
                <motion.div 
                   key="idle"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="h-full min-h-[600px] rounded-sm border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-20 bg-charcoal/30 shadow-inner group"
                >
                  <div className="relative mb-12">
                     <div className="absolute inset-0 bg-gold/5 rounded-full blur-3xl scale-150 animate-pulse" />
                     <Sparkles size={100} className="text-white/[0.03] group-hover:text-gold/10 transition-colors duration-1000 relative z-10" strokeWidth={0.5} />
                     <RefreshCw size={32} className="absolute -top-6 -right-6 text-gold opacity-10 group-hover:opacity-30 group-hover:rotate-180 transition-all duration-1000" />
                  </div>
                  <h2 className="text-4xl font-head font-black uppercase tracking-tighter text-white/10 group-hover:text-white/20 transition-colors italic">Awaiting Operational Command</h2>
                  <p className="max-w-sm text-[11px] font-black text-white/10 uppercase tracking-[0.3em] mt-6 leading-relaxed italic group-hover:text-white/30 transition-colors">
                    Establish secure satellite linkage and initiate the synchronization protocol to begin data ingestion from the target supply matrix.
                  </p>
                  <div className="mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                     <button onClick={startSync} className="h-14 px-12 border border-gold/30 text-gold font-head font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-ink transition-all shadow-2xl shadow-gold/10 italic">Execute Phase-Sync</button>
                  </div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
