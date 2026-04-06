"use client";

import React from "react";
import { Layers, Plus, RotateCw, Trash, Zap } from "lucide-react";
import { ProductOption } from "@/lib/admin-products/utils";

interface OptionConfigurationProps {
  attributeSetIds: string[];
  options: ProductOption[];
  onToggleAttributeSet: (id: string) => void;
  onOptionChange: (idx: number, opt: ProductOption) => void;
  onAddOptionValue: (idx: number) => void;
  onRegenerateVariants: () => void;
}

export const OptionConfiguration: React.FC<OptionConfigurationProps> = ({
  attributeSetIds,
  options,
  onToggleAttributeSet,
  onOptionChange,
  onAddOptionValue,
  onRegenerateVariants,
}) => {
  return (
    <div className="bg-charcoal border border-white/5 rounded-sm p-6 space-y-8 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 border-l-2 border-gold pl-4">
          <Layers size={18} className="text-gold" />
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Configuration Matrix</h3>
        </div>
        <button 
           onClick={onRegenerateVariants}
           className="px-4 py-2 bg-ink border border-white/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-sm hover:border-gold hover:bg-gold/10 transition-all flex items-center gap-2 shadow-xl"
        >
           <RotateCw size={14} /> Rebuild Variant Grid
        </button>
      </div>

      {/* Options Loop */}
      <div className="space-y-6">
         {options.map((opt, idx) => (
            <div key={opt.key} className="bg-ink/40 border border-white/5 p-5 rounded-sm space-y-4 hover:border-white/10 transition-colors">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex flex-col">
                     <span className="text-[11px] font-black text-white uppercase tracking-widest">{opt.label}</span>
                     <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">KEY ID: {opt.key}</span>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <span className="text-[9px] font-black text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">Active for Variants</span>
                    <div className="relative">
                       <input 
                         type="checkbox" 
                         className="peer hidden" 
                         checked={opt.useForVariants}
                         onChange={(e) => onOptionChange(idx, { ...opt, useForVariants: e.target.checked })}
                       />
                       <div className="h-5 w-9 bg-ink border border-white/10 rounded-full peer-checked:bg-gold/20 peer-checked:border-gold/40 transition-all" />
                       <div className="absolute top-1 left-1 h-3 w-3 bg-white/20 rounded-full peer-checked:bg-gold peer-checked:translate-x-4 transition-all" />
                    </div>
                  </label>
               </div>

               <div className="flex flex-wrap items-center gap-3">
                  {opt.selectedValues.map((val) => (
                     <div key={val} className="px-3 py-1 bg-charcoal border border-white/5 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 group/tag hover:border-gold/30 transition-all">
                        {val}
                        <button 
                          onClick={() => onOptionChange(idx, { 
                             ...opt, 
                             selectedValues: opt.selectedValues.filter(v => v !== val) 
                          })}
                          className="text-white/20 hover:text-red transition-colors"
                        >
                           <Trash size={12} />
                        </button>
                     </div>
                  ))}
                  
                  <div className="flex-1 flex items-center gap-2 min-w-[200px]">
                     <input 
                        type="text"
                        value={opt.draftValue || ""}
                        onChange={(e) => onOptionChange(idx, { ...opt, draftValue: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && onAddOptionValue(idx)}
                        placeholder="ENTER ATTRIBUTE DATA..."
                        className="flex-1 h-10 bg-black/40 border border-white/10 rounded-sm px-4 text-xs font-bold text-white uppercase tracking-widest placeholder:text-white/10 focus:border-gold outline-none transition-all"
                     />
                     <button 
                        onClick={() => onAddOptionValue(idx)}
                        className="h-10 px-4 bg-charcoal border border-white/10 text-white/40 hover:text-white hover:border-gold/40 transition-all shadow-xl active:scale-95"
                     >
                        <Plus size={16} />
                     </button>
                  </div>
               </div>
            </div>
         ))}

         {options.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 bg-ink/20 border border-white/5 rounded-sm opacity-20 group hover:opacity-40 transition-opacity">
               <Zap size={40} className="text-slate-600 group-hover:text-gold transition-colors" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Global Attributes Unmapped</p>
            </div>
         )}
      </div>
    </div>
  );
};
