"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  FolderTree, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Package, 
  Layout, 
  FileText, 
  Save, 
  Loader2, 
  X,
  Boxes,
  Tag,
  Activity,
  Layers,
  ChevronRight,
  Filter,
  Target,
  Zap,
  Cpu,
  ShieldCheck,
  Terminal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type CategoryType = "product" | "portfolio" | "blog";

type CategoryRecord = {
  _id: string;
  name?: string;
  title?: string;
  slug: string;
  type: CategoryType;
  parentId?: string | null;
  description?: string;
  entityCount?: number;
};

type CategoryDraft = {
  name: string;
  slug: string;
  type: CategoryType;
  parentId: string | null;
  description: string;
};

function createDraft(type: CategoryType = "product"): CategoryDraft {
  return { name: "", slug: "", type, parentId: null, description: "" };
}

function toDraft(record: CategoryRecord): CategoryDraft {
  return {
    name: record.name || record.title || "",
    slug: record.slug || "",
    type: record.type || "product",
    parentId: record.parentId || null,
    description: record.description || "",
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState<CategoryType | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryDraft>(createDraft());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/ecommerce/categories?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      }
    } catch (e) {
      toast.error("Network error fetching taxonomy records");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [typeFilter]);

  const tree = useMemo(() => {
    const map = new Map<string, CategoryRecord & { children: any[] }>();
    const roots: any[] = [];
    const lowerQuery = searchQuery.toLowerCase();
    const matches = categories.filter(c => {
       const n = c.name || c.title || "";
       return n.toLowerCase().includes(lowerQuery) || c.slug.toLowerCase().includes(lowerQuery);
    });
    matches.forEach(c => map.set(c._id, { ...c, children: [] }));
    map.forEach(c => {
      const pId = c.parentId?.toString();
      if (pId && map.has(pId)) map.get(pId)!.children.push(c);
      else roots.push(c);
    });
    return roots;
  }, [categories, searchQuery]);

  const renderNode = (node: CategoryRecord & { children: any[] }, depth: number = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node._id) || searchQuery.length > 0;
    const name = node.name || node.title || "Unnamed Unit";

    return (
      <div key={node._id} className={cn("relative transition-all", depth > 0 ? "ml-10 mt-6" : "mb-6")}>
        {depth > 0 && <div className="absolute -left-5 top-0 bottom-0 w-px bg-white/5" />}
        <div className={cn(
          "bg-charcoal border border-white/5 rounded-sm px-8 py-6 transition-all shadow-2xl hover:border-gold/30 group",
          isExpanded ? "ring-1 ring-gold/20 bg-white/[0.02]" : "shadow-black/40"
        )}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div 
                onClick={() => hasChildren && setExpandedNodes(prev => {
                  const next = new Set(prev);
                  next.has(node._id) ? next.delete(node._id) : next.add(node._id);
                  return next;
                })}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-sm bg-ink text-white/20 transition-all cursor-pointer border border-white/10 group-hover:border-gold/40 group-hover:text-gold shadow-inner",
                  isExpanded && "bg-olive text-white border-olive/30 shadow-none ring-1 ring-gold/10"
                )}
              >
                {hasChildren ? (isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />) : <Cpu size={16} />}
              </div>
              <div className="flex flex-col space-y-1.5 overflow-hidden">
                <span className={cn("font-head font-black text-white uppercase tracking-tighter leading-none group-hover:text-gold transition-colors italic", depth === 0 ? "text-lg" : "text-sm")}>{name}</span>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono italic">Sector: /{node.slug}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-10 px-5 border border-white/5 bg-white/[0.03] text-white/30 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all font-head font-bold text-[10px] uppercase tracking-widest rounded-sm italic" onClick={() => { setForm({ ...createDraft(), parentId: node._id }); setShowForm(true); }}>
                Establish Child
              </button>
              <button className="h-10 w-10 rounded-sm border border-white/5 bg-white/[0.03] text-white/20 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all flex items-center justify-center group/btn shadow-xl active:scale-95" onClick={() => { setForm(toDraft(node)); setEditingId(node._id); setShowForm(true); }} title="Modify Intel"><Pencil size={18} /></button>
              <button className="h-10 w-10 rounded-sm border border-white/5 bg-white/[0.03] text-white/20 hover:text-red hover:border-red/30 hover:bg-red/10 transition-all flex items-center justify-center group/btn shadow-xl active:scale-95" onClick={async () => {
                if (confirm(`Remove unit ${name}?`)) {
                  const res = await fetch(`/api/ecommerce/categories/${node._id}`, { method: "DELETE" });
                  if (res.ok) { toast.success("Taxonomy record purged"); fetchCategories(); }
                }
              }} title="Purge Record"><Trash2 size={18} /></button>
            </div>
          </div>
          {isExpanded && hasChildren && (
            <div className="pt-8 border-t border-white/5 mt-8 animate-in fade-in slide-in-from-top-2 duration-500">
              {node.children.map(child => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-40">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-head font-black text-white uppercase tracking-tighter leading-none">Categories</h1>
           <p className="text-sm text-white/40 font-medium italic flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <Target size={12} className="text-gold" /> Engineering mission-critical navigation hierarchy nodes.
           </p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="h-12 px-10 bg-olive text-white hover:bg-olive-lt font-head font-bold text-xs uppercase tracking-widest rounded-sm transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-olive/20">
          <Plus size={18} /> Establish New Unit
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between bg-charcoal border border-white/5 rounded-sm p-4 shadow-2xl shadow-black/60">
        <div className="flex bg-ink p-1 rounded-sm border border-white/10 gap-1">
          {(["", "product", "portfolio", "blog"] as const).map((type) => (
            <button
              key={type || "all"}
              onClick={() => setTypeFilter(type)}
              className={cn(
                "px-6 py-2.5 rounded-sm font-head font-bold text-[10px] uppercase tracking-[0.2em] transition-all italic",
                typeFilter === type ? "bg-olive text-white shadow-xl shadow-olive/10" : "text-white/20 hover:text-white hover:bg-white/5"
              )}
            >
              {type || "Global Network"}
            </button>
          ))}
        </div>
        <div className="relative w-full xl:w-[450px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
          <input 
            placeholder="INTERCEPT TACTICAL NODES..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-ink border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
          />
        </div>
      </div>

      <div className="w-full pb-40">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-40 gap-4 text-white/10 bg-charcoal rounded-sm border border-white/5 shadow-2xl">
              <div className="h-10 w-10 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
              <span className="font-head font-black text-xs uppercase tracking-[0.4em] italic animate-pulse">Compiling Taxonomy Matrix...</span>
           </div>
        ) : tree.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-60 gap-8 text-white/10 bg-charcoal rounded-sm border border-white/5 border-dashed shadow-inner">
              <div className="h-24 w-24 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02] shadow-inner">
                 <FolderTree size={48} strokeWidth={1} className="opacity-40" />
              </div>
              <div className="flex flex-col gap-2 text-center">
                <h3 className="font-head font-black text-xl text-white uppercase tracking-tighter italic">Taxonomy Dormant</h3>
                <p className="text-[10px] font-bold text-white/30 max-w-xs px-10 italic uppercase tracking-widest leading-relaxed">Your tactical node map is offline. Establish a new unit to initiate command hierarchy.</p>
              </div>
           </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {tree.map(node => renderNode(node, 0))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-ink/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }} className="relative w-full max-w-2xl bg-charcoal p-12 rounded-sm border border-white/10 shadow-2xl shadow-black/90 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 -rotate-45 translate-x-12 -translate-y-12" />
              
              <button onClick={resetForm} className="absolute top-10 right-10 h-10 w-10 flex items-center justify-center rounded-sm bg-white/5 text-white/20 hover:text-white border border-white/10 hover:border-gold/30 transition-all shadow-xl active:scale-95"><X size={20} /></button>
              
              <div className="flex items-center gap-3 mb-10">
                 <Terminal size={20} className="text-gold" />
                 <h2 className="text-2xl font-head font-black tracking-tighter text-white uppercase italic">{editingId ? "Revise Taxonomy Node" : "Establish New Supply Unit"}</h2>
              </div>

              <form onSubmit={async (e) => {
                  e.preventDefault();
                  setSaving(true);
                  const endpoint = editingId ? `/api/ecommerce/categories/${editingId}` : "/api/ecommerce/categories";
                  try {
                    const res = await fetch(endpoint, {
                      method: editingId ? "PUT" : "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(form),
                    });
                    if (res.ok) { toast.success("Node successfully synchronized"); resetForm(); fetchCategories(); }
                  } catch (e) { toast.error("Command failed: transmission error"); }
                  setSaving(false);
              }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic ml-1">Asset Handle / Name</Label>
                    <input 
                      value={form.name} 
                      onChange={e => setForm({ ...form, name: e.target.value })} 
                      className="w-full h-12 bg-ink border border-white/10 rounded-sm px-4 focus:border-gold transition-all font-head font-bold text-sm text-white uppercase tracking-wider outline-none h-14" 
                      placeholder="e.g. Footwear Sector-01" 
                      required 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic ml-1">Serial Map (Slug)</Label>
                    <input 
                      value={form.slug} 
                      onChange={e => setForm({ ...form, slug: e.target.value })} 
                      className="w-full h-12 bg-ink border border-white/10 rounded-sm px-4 focus:border-gold transition-all font-mono text-[11px] font-bold text-gold uppercase tracking-widest outline-none h-14" 
                      placeholder="sector-id" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic ml-1">Logistics Assignment</Label>
                    <Select value={form.type} onValueChange={(v: CategoryType) => setForm({ ...form, type: v })}>
                      <SelectTrigger className="h-14 bg-ink border-white/10 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] text-white focus:ring-gold/20 focus:border-gold drop-shadow-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-charcoal border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/80">
                        <SelectItem value="product" className="focus:bg-olive focus:text-white">Product Material</SelectItem>
                        <SelectItem value="portfolio" className="focus:bg-olive focus:text-white">Tactical Portfolio</SelectItem>
                        <SelectItem value="blog" className="focus:bg-olive focus:text-white">Intelligence Intel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic ml-1">Command Relay (Parent Control)</Label>
                    <Select value={form.parentId || "none"} onValueChange={v => setForm({ ...form, parentId: v === "none" ? null : v })}>
                      <SelectTrigger className="h-14 bg-ink border-white/10 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] text-white focus:ring-gold/20 focus:border-gold drop-shadow-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-charcoal border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/80">
                        <SelectItem value="none" className="focus:bg-olive focus:text-white italic text-gold">Root Command Unit</SelectItem>
                        {categories.filter(c => c._id !== editingId).map(c => (
                          <SelectItem key={c._id} value={c._id} className="focus:bg-olive focus:text-white">{c.name || c.slug}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic ml-1">Mission Intel (Manifest)</Label>
                  <textarea 
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                    className="w-full min-h-[140px] bg-ink border border-white/10 rounded-sm overflow-hidden p-6 text-[11px] font-bold text-white/60 uppercase tracking-widest leading-relaxed focus:border-gold outline-none transition-all resize-none shadow-inner italic" 
                    placeholder="DEFINE OPERATIONAL MISSION PARAMETERS FOR THIS NODE..." 
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                  <button type="button" onClick={resetForm} className="h-14 px-10 rounded-sm text-white/20 hover:text-white font-head font-bold uppercase tracking-widest text-[11px] transition-all italic">Abort Command</button>
                  <button type="submit" disabled={saving} className="h-14 px-14 bg-red text-white hover:bg-red-lt font-head font-bold uppercase tracking-widest text-[11px] transition-all shadow-2xl shadow-red/20 active:scale-95 flex items-center justify-center gap-3">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? "Update Intelligence" : "Force Deployment Status"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function resetForm() {
    setForm(createDraft(typeFilter || "product"));
    setEditingId(null);
    setShowForm(false);
  }
}
