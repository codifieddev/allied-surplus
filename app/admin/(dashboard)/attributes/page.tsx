"use client";

import React, { useEffect, useMemo, useState } from "react";
import { 
  ListFilter, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X, 
  Circle, 
  CheckCircle2,
  Tag,
  Settings,
  MoreVertical,
  ChevronRight,
  Database,
  Search,
  ArrowUpRight,
  Rows,
  HelpCircle,
  Component,
  Layers,
  Activity,
  Boxes,
  Target,
  Zap,
  Cpu,
  ShieldCheck,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";

type AttributeFieldDraft = {
  key: string;
  label: string;
  type: string;
  options: string;
  enabled: boolean;
};

type AttributeSetDraft = {
  name: string;
  key: string;
  appliesTo: string;
  contexts: string;
  description: string;
  attributes: AttributeFieldDraft[];
};

type AttributeSetRecord = {
  _id: string;
  name: string;
  key?: string;
  appliesTo?: string;
  contexts?: string[];
  description?: string;
  attributes?: Array<{
    key?: string;
    label?: string;
    type?: string;
    options?: string[];
    enabled?: boolean;
  }>;
};

function createEmptyField(): AttributeFieldDraft {
  return {
    key: "",
    label: "",
    type: "select",
    options: "",
    enabled: true,
  };
}

function createEmptyDraft(): AttributeSetDraft {
  return {
    name: "",
    key: "",
    appliesTo: "product",
    contexts: "",
    description: "",
    attributes: [createEmptyField()],
  };
}

function fromRecord(record: AttributeSetRecord): AttributeSetDraft {
  return {
    name: record.name || "",
    key: record.key || "",
    appliesTo: record.appliesTo || "product",
    contexts: Array.isArray(record.contexts) ? record.contexts.join(", ") : "",
    description: record.description || "",
    attributes: Array.isArray(record.attributes) && record.attributes.length > 0
      ? record.attributes.map((attribute) => ({
          key: attribute.key || "",
          label: attribute.label || "",
          type: attribute.type || "select",
          options: Array.isArray(attribute.options) ? attribute.options.join(", ") : "",
          enabled: attribute.enabled !== false,
        }))
      : [createEmptyField()],
  };
}

export default function AttributesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [records, setRecords] = useState<AttributeSetRecord[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AttributeSetDraft>(createEmptyDraft());

  async function fetchRecords() {
    setLoading(true);
    try {
      const res = await fetch("/api/ecommerce/attributes");
      if (res.ok) {
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return records;
    return records.filter((r) => r.name.toLowerCase().includes(keyword) || r.key?.toLowerCase().includes(keyword));
  }, [records, search]);

  const resetForm = () => {
    setForm(createEmptyDraft());
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (record: AttributeSetRecord) => {
    setForm(fromRecord(record));
    setEditingId(record._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name.trim(),
      key: form.key.trim(),
      appliesTo: form.appliesTo,
      contexts: form.contexts.split(",").map(i => i.trim()).filter(Boolean),
      description: form.description.trim(),
      attributes: form.attributes.map(a => ({
        key: a.key.trim(),
        label: a.label.trim(),
        type: a.type || "select",
        options: a.options.split(",").map(i => i.trim()).filter(Boolean),
        enabled: a.enabled,
      })).filter(a => a.key && a.label),
    };

    if (!payload.name || payload.attributes.length === 0) {
      toast.error("Name and at least one attribute are required.");
      return;
    }

    setSaving(true);
    const endpoint = editingId ? `/api/ecommerce/attributes/${editingId}` : "/api/ecommerce/attributes";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      toast.success(editingId ? "Attribute set synchronized." : "New attribute hub established.");
      resetForm();
      fetchRecords();
    } else {
      const data = await res.json();
      toast.error(data?.error || "Command failed: transmission error.");
    }
  };

  const handleDelete = async (record: AttributeSetRecord) => {
    if (!confirm(`Relinquish attribute set "${record.name}"?`)) return;
    const res = await fetch(`/api/ecommerce/attributes/${record._id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Record purged from main matrix.");
      fetchRecords();
    } else {
      toast.error("Failed to delete attribute set.");
    }
  };

  const updateAttribute = (index: number, patch: Partial<AttributeFieldDraft>) => {
    setForm(prev => ({
      ...prev,
      attributes: prev.attributes.map((a, i) => i === index ? { ...a, ...patch } : a),
    }));
  };

  const removeAttribute = (index: number) => {
    setForm(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-head font-black text-white uppercase tracking-tighter leading-none">Attribute</h1>
           <p className="text-sm text-white/40 font-medium italic flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <Target size={12} className="text-gold" /> Synchronizing tactical variant schemas and field configurations.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <button className="h-12 px-8 bg-white/5 border border-white/10 text-white/40 font-head font-bold text-xs uppercase tracking-widest rounded-sm hover:text-white hover:border-gold/30 transition-all flex items-center gap-2 group italic">
              <Database size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Asset Library
           </button>
           <button onClick={() => { setForm(createEmptyDraft()); setEditingId(null); setShowForm(true); }} className="h-12 px-10 bg-olive text-white hover:bg-olive-lt font-head font-bold text-xs uppercase tracking-widest rounded-sm transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-olive/20">
              <Plus size={18} /> Establish Set
           </button>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row items-center gap-6 bg-charcoal p-5 rounded-sm border border-white/5 shadow-2xl shadow-black/60">
         <div className="flex bg-ink p-1 rounded-sm border border-white/10 gap-1 overflow-x-auto scrollbar-none w-full lg:w-auto">
            {["Sector All", "Active Hubs", "Dormant Node", "Archive Map"].map((status) => (
              <button key={status} className={cn(
                "px-8 py-2.5 rounded-sm font-head font-bold text-[10px] uppercase tracking-[0.2em] transition-all italic whitespace-nowrap",
                status === "Sector All" ? "bg-olive text-white shadow-xl shadow-olive/10" : "text-white/20 hover:text-white hover:bg-white/5"
              )}>
                {status}
              </button>
            ))}
         </div>
         <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
            <input 
               placeholder="IDENTIFY SPECIFIC ATTRIBUTE SCHEMAS..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full h-12 pl-12 pr-4 bg-ink border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
            />
         </div>
      </div>

      <div className="w-full">
         {loading ? (
            <div className="py-40 flex flex-col items-center justify-center gap-4 text-white/10 bg-charcoal rounded-sm border border-white/5 shadow-2xl">
               <div className="h-10 w-10 border-2 border-white/10 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
               <span className="font-head font-black text-xs uppercase tracking-[0.4em] italic animate-pulse">Interrogating Attribute Matrix...</span>
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-60 flex flex-col items-center justify-center gap-8 text-white/10 bg-charcoal rounded-sm border border-white/5 border-dashed shadow-inner">
               <div className="h-24 w-24 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02] shadow-inner">
                  <Boxes size={48} strokeWidth={1} className="opacity-40" />
               </div>
               <div className="text-center space-y-2">
                 <h3 className="font-head font-black text-xl text-white uppercase tracking-tighter italic">Asset Schema Offline</h3>
                 <p className="text-[10px] font-bold text-white/30 max-w-xs px-10 italic uppercase tracking-widest leading-relaxed">No attribute field sets identified in the current sector.</p>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10 animate-in slide-in-from-bottom-4 duration-700">
               {filtered.map((record) => (
                 <motion.article 
                   key={record._id} 
                   layout
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="group relative bg-charcoal border border-white/5 p-10 rounded-sm shadow-2xl shadow-black/80 hover:border-gold/30 transition-all duration-500 overflow-hidden"
                 >
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 -rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700" />
                    
                    <div className="relative z-10 flex justify-between items-start mb-8">
                       <div className="flex items-center gap-5">
                          <div className="h-14 w-14 flex items-center justify-center rounded-sm bg-olive/10 border border-olive/30 group-hover:bg-olive group-hover:text-white transition-all duration-500 ring-1 ring-gold/0 group-hover:ring-gold/20 shadow-inner">
                             <Tag size={24} strokeWidth={2.5} />
                          </div>
                          <div className="flex flex-col space-y-1">
                             <h3 className="text-lg font-head font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors italic">{record.name}</h3>
                             <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono italic">Sector: /{record.key}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="h-10 w-10 text-white/20 hover:text-gold hover:bg-gold/10 border border-white/5 flex items-center justify-center rounded-sm transition-all shadow-xl active:scale-95" onClick={() => handleEdit(record)} title="Modify Schema"><Pencil size={18} /></button>
                          <button className="h-10 w-10 text-white/20 hover:text-red hover:bg-red/10 border border-white/5 flex items-center justify-center rounded-sm transition-all shadow-xl active:scale-95" onClick={() => handleDelete(record)} title="Purge Schema"><Trash2 size={18} /></button>
                       </div>
                    </div>
                    
                    <div className="relative z-10 space-y-5 pt-8 border-t border-white/5 mt-8">
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 italic">Field Manifest Intel</span>
                          <span className="text-[9px] font-black text-gold bg-gold/10 px-3 py-1 rounded-sm border border-gold/20 tracking-[0.2em] uppercase italic">{record.attributes?.length || 0} Enabled Parameters</span>
                       </div>
                       <div className="space-y-3">
                          {(record.attributes || []).slice(0, 3).map((attr, i) => (
                             <div key={i} className="flex items-center justify-between p-4 rounded-sm bg-ink/40 border border-white/5 group-hover:border-gold/10 transition-all shadow-inner">
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{attr.label}</span>
                                <span className="text-[9px] font-black uppercase text-gold/40 tracking-[0.2em] italic">{attr.type}</span>
                             </div>
                          ))}
                          {((record.attributes || []).length > 3) && (
                            <div className="text-center pt-4">
                              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 italic animate-pulse">...and {(record.attributes || []).length - 3} additional coordinates</span>
                            </div>
                          )}
                       </div>
                    </div>
                    
                    <div className="relative z-10 mt-10">
                       <button className="w-full h-12 rounded-sm border border-white/10 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-gold group-hover:border-gold/30 group-hover:bg-gold/5 transition-all flex items-center justify-center gap-3 italic">Establish Linkage Matrix <ArrowUpRight size={16} /></button>
                    </div>
                 </motion.article>
               ))}
            </div>
         )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-ink/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }} className="relative w-full max-w-5xl bg-charcoal p-12 rounded-sm border border-white/10 shadow-2xl shadow-black/95 max-h-[95vh] overflow-y-auto scrollbar-none group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 -rotate-45 translate-x-16 -translate-y-16" />
              
              <button onClick={resetForm} className="absolute top-10 right-10 h-10 w-10 flex items-center justify-center rounded-sm bg-white/5 text-white/20 hover:text-white border border-white/10 hover:border-gold/30 transition-all shadow-xl active:scale-95"><X size={20} /></button>
              
              <div className="relative z-10 flex items-center gap-5 mb-12">
                 <div className="h-14 w-14 flex items-center justify-center rounded-sm bg-olive text-white shadow-2xl shadow-olive/20 ring-1 ring-gold/20"><Settings size={28} strokeWidth={2.5} /></div>
                 <div>
                    <h2 className="text-3xl font-head font-black tracking-tighter text-white uppercase italic">{editingId ? "Modify Attribute Matrix" : "Establish New Attribute Hub"}</h2>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mt-1">Configuring tactical field parameters for asset deployment.</p>
                 </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic ml-1">Asset Set Identification</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-14 bg-ink border border-white/10 rounded-sm px-6 focus:border-gold transition-all font-head font-bold text-lg text-white uppercase tracking-wider outline-none shadow-inner" placeholder="e.g. Footwear Dynamics Sector" required />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic ml-1">Matrix Map (Unique Slug)</label>
                    <input value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} className="w-full h-14 bg-ink border border-white/10 rounded-sm px-6 focus:border-gold transition-all font-mono text-sm font-bold text-gold uppercase tracking-widest outline-none shadow-inner" placeholder="footwear_sector_id" required />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic ml-1">Operational Manifest (Description)</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full h-44 p-6 bg-ink border border-white/10 rounded-sm focus:border-gold focus:outline-none font-bold text-[11px] text-white/60 uppercase tracking-widest leading-relaxed scrollbar-none italic shadow-inner resize-none" placeholder="Provide strategic context for this attribute set..."></textarea>
                  </div>
                </div>

                <div className="bg-ink/40 rounded-sm p-10 border border-white/5 flex flex-col shadow-inner">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Field Manifest Parameters</h3>
                     <button type="button" onClick={() => setForm(prev => ({ ...prev, attributes: [...prev.attributes, createEmptyField()] }))} className="h-12 px-6 bg-olive text-white font-head font-bold text-[10px] uppercase tracking-widest hover:bg-olive-lt transition-all active:scale-95 shadow-2xl shadow-olive/20 flex items-center gap-2"><Plus size={18} /> Add Coordinate</button>
                  </div>

                  <div className="space-y-6 flex-1 max-h-[440px] overflow-y-auto pr-4 scrollbar-none">
                    {form.attributes.map((attr, idx) => (
                      <div key={idx} className="relative bg-charcoal border border-white/5 rounded-sm p-8 shadow-2xl group/field hover:border-gold/20 transition-all">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">Coordinate Key</label>
                               <input value={attr.key} onChange={e => updateAttribute(idx, { key: e.target.value })} className="w-full h-12 text-xs font-mono font-bold uppercase tracking-widest bg-ink border border-white/10 rounded-sm px-4 focus:border-gold outline-none text-gold" placeholder="color_id" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">Display Handle</label>
                               <input value={attr.label} onChange={e => updateAttribute(idx, { label: e.target.value })} className="w-full h-12 text-xs font-black uppercase bg-ink border border-white/10 rounded-sm px-4 focus:border-gold outline-none text-white italic" placeholder="Asset Hue" />
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">Intelligence Type</label>
                               <select value={attr.type} onChange={e => updateAttribute(idx, { type: e.target.value })} className="w-full h-12 px-4 bg-ink border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-widest text-white/80 focus:border-gold outline-none appearance-none cursor-pointer">
                                  <option value="select">Dynamic Selection</option>
                                  <option value="multiselect">Multi-Grid Matrix</option>
                                  <option value="text">Observation Stream</option>
                               </select>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">Options Stream (CSV)</label>
                               <input value={attr.options} onChange={e => updateAttribute(idx, { options: e.target.value })} className="w-full h-12 text-xs font-bold bg-ink border border-white/10 rounded-sm px-4 focus:border-gold outline-none text-white/60" placeholder="OD-Green, Black, Coyote" />
                            </div>
                         </div>
                         <button onClick={() => removeAttribute(idx)} className="absolute -top-3 -right-3 h-10 w-10 rounded-sm bg-red/10 text-red hover:bg-red hover:text-white flex items-center justify-center opacity-0 group-field-hover:opacity-100 transition-all border border-red/20 shadow-2xl active:scale-95"><X size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-16 flex justify-end gap-6 border-t border-white/5 pt-12">
                 <button type="button" onClick={resetForm} className="h-14 px-12 rounded-sm text-white/20 hover:text-white font-head font-bold uppercase tracking-widest text-[11px] transition-all italic">Abort Command</button>
                 <button onClick={handleSave} disabled={saving} className="h-14 px-20 bg-red text-white hover:bg-red-lt font-head font-bold uppercase tracking-widest text-[11px] shadow-2xl shadow-red/20 transition-all active:scale-95 flex items-center justify-center gap-4">
                    {saving ? <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : editingId ? "Force Synchronization" : "Commit Establishment"}
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
