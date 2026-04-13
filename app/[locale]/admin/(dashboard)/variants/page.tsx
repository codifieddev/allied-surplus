"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchVariants, selectAdminVariants, selectAdminVariantsLoading } from "@/lib/store/features/adminVariantsSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash, 
  ListTree, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Plus,
  Box,
  Layers,
  ArrowUpRight,
  Database,
  Tag,
  AlertCircle,
  CheckCircle2,
  Package,
  Target,
  Zap,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function VariantsPage() {
  const dispatch = useAppDispatch();
  const variants = useAppSelector(selectAdminVariants);
  const loading = useAppSelector(selectAdminVariantsLoading);
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchVariants());
  }, [dispatch]);

  const filteredVariants = variants.filter(v => 
    v.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-head font-black text-white uppercase tracking-tighter leading-none">Variant </h1>
           <p className="text-sm text-white/40 font-medium italic flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <Target size={12} className="text-gold" /> Synchronizing and coordinating mission-critical asset variations.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <button className="h-12 px-6 bg-white/5 border border-white/10 text-white/40 font-head font-bold text-xs uppercase tracking-widest rounded-sm hover:text-white hover:border-gold/30 transition-all flex items-center gap-2 group italic">
              <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Export Data Stream
           </button>
           <button className="h-12 px-10 bg-olive text-white hover:bg-olive-lt font-head font-bold text-xs uppercase tracking-widest rounded-sm transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-olive/20">
              <Plus size={18} /> New Variant Unit
           </button>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Deployments", count: variants.length, icon: Layers, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
          { label: "Supply Depleted", count: variants.filter(v => (v.stock || 0) <= 0).length, icon: AlertCircle, color: "text-red", bg: "bg-red/10", border: "border-red/30" },
          { label: "Inventory Valuation", count: `$${variants.reduce((acc, v) => acc + (v.price || 0) * (v.stock || 0), 0).toLocaleString()}`, icon: Database, color: "text-gold", bg: "bg-gold/10", border: "border-gold/30" },
        ].map((stat, i) => (
          <div key={i} className="bg-charcoal border border-white/5 p-6 rounded-sm shadow-2xl shadow-black/40 flex items-center gap-6 group hover:border-gold/20 transition-all">
             <div className={cn("h-14 w-14 rounded-sm flex items-center justify-center border ring-1 ring-white/0 group-hover:ring-gold/10 transition-all shadow-inner", stat.bg, stat.color, stat.border)}>
                <stat.icon size={24} strokeWidth={2.5} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 leading-none mb-2 group-hover:text-gold/50 transition-colors uppercase italic">{stat.label}</p>
                <p className="text-3xl font-head font-black text-white tracking-tighter leading-none">{stat.count}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row items-center gap-6 bg-charcoal p-5 rounded-sm border border-white/5 shadow-2xl shadow-black/60">
         <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
            <input 
               placeholder="SEARCH BY MISSION ID, SERIAL SKU OR VARIANT HANDLE..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full h-12 pl-12 pr-4 bg-ink border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-3 w-full lg:w-auto">
            <button className="h-12 px-6 flex-1 lg:flex-none border border-white/10 text-white/40 hover:text-white hover:border-gold/30 font-head font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 italic">
               <Filter size={16} /> Filter Parameters
            </button>
            <div className="h-6 w-px bg-white/5 mx-2 hidden lg:block" />
            <button className="h-12 px-6 border border-white/5 text-white/20 font-black text-[9px] uppercase tracking-[0.3em] hover:text-gold transition-colors italic">
               Archive Hub
            </button>
         </div>
      </div>

      {/* Table Container */}
      <div className="bg-charcoal border border-white/5 rounded-sm overflow-hidden shadow-2xl shadow-black/80">
        <Table>
          <TableHeader className="bg-ink/60 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-white/5 h-16">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 px-8">Mission Unit</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Serial (SKU)</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Valuation</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Ready Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Coordinates</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 text-right px-8">Intel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={6} className="h-64 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic animate-pulse">Synchronizing Variant Logs...</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : filteredVariants.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={6} className="h-96 text-center p-12">
                   <div className="flex flex-col items-center gap-6 text-white/10 italic">
                      <div className="h-24 w-24 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02] shadow-inner">
                         <ListTree size={48} strokeWidth={1} className="opacity-40" />
                      </div>
                      <div className="text-center space-y-1">
                        <span className="text-sm font-bold uppercase tracking-[0.3em] leading-relaxed">No variants identified in sector.</span>
                        <p className="text-[9px] font-black text-white/10 uppercase tracking-widest mt-2 italic animate-pulse">Try adjusting mission parameters.</p>
                      </div>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredVariants.map((variant) => (
                <TableRow key={variant._id} className="group border-white/5 hover:bg-white/[0.02] transition-all duration-300">
                  <TableCell className="px-8 py-8">
                     <div className="flex flex-col space-y-1.5 overflow-hidden">
                        <span className="text-sm font-bold text-white uppercase tracking-tight leading-none group-hover:text-gold transition-colors italic truncate">{variant.title}</span>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em] italic">Logistix: Tactical-Alpha-01</span>
                     </div>
                  </TableCell>
                  <TableCell>
                     <span className="text-[9px] font-black text-white/20 px-3 py-1 bg-ink border border-white/5 rounded-sm uppercase tracking-widest italic group-hover:text-gold/40 group-hover:border-gold/20 transition-all">{variant.sku || 'UNRECOGNIZED'}</span>
                  </TableCell>
                  <TableCell>
                     <span className="text-xl font-head font-black text-white tracking-tighter tabular-nums">${variant.price}</span>
                  </TableCell>
                  <TableCell>
                     <div className={cn(
                       "inline-flex items-center gap-2.5 px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest border italic transition-all duration-500",
                       (variant.stock || 0) <= 0 
                         ? "bg-red/10 text-red border-red/30" 
                         : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                     )}>
                       <div className={cn("h-1.5 w-1.5 rounded-full ring-2 ring-white/0 group-hover:ring-current/20", (variant.stock || 0) <= 0 ? "bg-red shadow-[0_0_8px_rgba(220,38,38,0.5)]" : "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]")} />
                       {variant.stock || 0} Assets Ready
                     </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                       {variant.optionValues && Object.entries(variant.optionValues).map(([key, val]) => (
                         <div key={key} className="inline-flex items-center gap-2 px-3 py-1 bg-ink/40 border border-white/5 rounded-sm group-hover:border-gold/20 transition-all">
                           <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">{key}:</span>
                           <span className="text-[10px] font-bold text-white/60 uppercase">{val as string}</span>
                         </div>
                       ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex items-center justify-end gap-2">
                       <button className="h-10 w-10 rounded-sm border border-white/5 bg-white/[0.03] text-white/20 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all flex items-center justify-center group/btn shadow-xl active:scale-95" title="Modify Config">
                          <Edit size={18} className="group-hover/btn:scale-110 transition-transform" />
                       </button>
                       <button className="h-10 w-10 rounded-sm border border-white/5 bg-white/[0.03] text-white/20 hover:text-red hover:border-red/30 hover:bg-red/10 transition-all flex items-center justify-center group/btn shadow-xl active:scale-95" title="Purge Record">
                          <Trash size={18} className="group-hover/btn:scale-110 transition-transform" />
                       </button>
                       <button className="h-10 w-10 rounded-sm border border-white/5 bg-white/[0.03] text-white/20 hover:text-white hover:border-gold/30 hover:bg-gold/10 transition-all flex items-center justify-center group/btn shadow-xl">
                          <MoreVertical size={18} className="group-hover/btn:scale-110 transition-transform" />
                       </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
