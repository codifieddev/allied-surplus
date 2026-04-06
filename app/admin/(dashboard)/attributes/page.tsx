"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import {
  ListFilter,
  Plus,
  Edit,
  Trash,
  Search,
  Save,
  X,
  Circle,
  CheckCircle2,
  Upload,
  Database,
  Terminal,
  Zap,
  Layers,
  Settings,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import {
  createAttributeSet,
  deleteAttributeSet,
  updateAttributeSet,
  fetchAttributes,
  bulkImportAttributes,
} from "@/lib/store/attributes/attributesThunk";
import { TacticalImportModal } from "@/components/admin/TacticalImportModal";

const attributeSampleData = [
  {
    name: "VEHICLE SPECS",
    key: "vehicle-specs",
    description: "Technical specifications for off-road vehicles.",
    attributes: [
      {
        key: "engine",
        label: "Engine Type",
        type: "select",
        options: ["V6", "V8", "Turbo Diesel"],
      },
      {
        key: "armor",
        label: "Armor Level",
        type: "select",
        options: ["None", "Level 1", "Level 2"],
      },
    ],
  },
];
import { toast } from "sonner";
import {
  AttributeFieldDraft,
  AttributeSetDraft,
  AttributeSetRecord,
} from "@/lib/store/attributes/attributeSlices";

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
    attributes:
      Array.isArray(record.attributes) && record.attributes.length > 0
        ? record.attributes.map((attribute) => ({
            key: attribute.key || "",
            label: attribute.label || "",
            type: attribute.type || "select",
            options: Array.isArray(attribute.options)
              ? attribute.options.join(", ")
              : "",
            enabled: attribute.enabled !== false,
          }))
        : [createEmptyField()],
  };
}

function toPayload(draft: AttributeSetDraft) {
  return {
    name: draft.name.trim(),
    key: draft.key.trim(),
    appliesTo: draft.appliesTo,
    contexts: draft.contexts
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    description: draft.description.trim(),
    attributes: draft.attributes
      .map((attribute) => ({
        key: attribute.key.trim(),
        label: attribute.label.trim(),
        type: attribute.type || "select",
        options: attribute.options
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        enabled: attribute.enabled,
      }))
      .filter((attribute) => attribute.key && attribute.label),
  };
}

function AttributesPageContent() {
  const { allattributes: records, attributeLoading: loading } = useAppSelector(
    (state: RootState) => state.adminAttributes,
  );

  const dispatch = useAppDispatch();
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AttributeSetDraft>(createEmptyDraft());
  const [showImportModal, setShowImportModal] = useState(false);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return records;
    return records.filter(
      (r) =>
        r.name.toLowerCase().includes(keyword) ||
        r.key?.toLowerCase().includes(keyword),
    );
  }, [records, search]);

  const resetForm = () => {
    setForm(createEmptyDraft());
    setEditingId(null);
    setShowForm(false);
  };

  const handleImport = async (data: any[]) => {
    const resultAction = await dispatch(bulkImportAttributes(data));
    if (bulkImportAttributes.fulfilled.match(resultAction)) {
      // dispatch(fetchAttributes());
      return { message: `${data.length} ATTRIBUTE SETS SYNCHRONIZED` };
    } else {
      throw new Error(
        (resultAction.payload as any)?.message || "Import failed",
      );
    }
  };

  const handleEdit = (record: AttributeSetRecord) => {
    setForm(fromRecord(record));
    setEditingId(record._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    const payload = toPayload(form);
    if (!payload.name || payload.attributes.length === 0) {
      toast.error(
        "IDENTIFICATION ERROR: Designation and Matrix Fields required.",
      );
      return;
    }

    setSaving(true);
    const tId = toast.loading("SYNCHRONIZING ATTRIBUTE MATRIX...");
    try {
      if (editingId) {
        await dispatch(updateAttributeSet({ id: editingId, payload })).unwrap();
        toast.success("MATRIX UPDATED", { id: tId });
      } else {
        await dispatch(createAttributeSet(payload)).unwrap();
        toast.success("SET DEPLOYED", { id: tId });
      }
      resetForm();
      dispatch(fetchAttributes());
    } catch (err: any) {
      toast.error("DEPLOYMENT FAILURE", { id: tId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: AttributeSetRecord) => {
    if (!confirm(`CONFIRM DESTRUCTION: Delete attribute set "${record.name}"?`))
      return;
    const tId = toast.loading("PURGING MATRIX...");
    try {
      await dispatch(deleteAttributeSet(record._id)).unwrap();
      toast.success("MATRIX PURGED", { id: tId });
      dispatch(fetchAttributes());
    } catch (err: any) {
      toast.error("PURGE FAILURE", { id: tId });
    }
  };

  const updateAttributeField = (
    index: number,
    patch: Partial<AttributeFieldDraft>,
  ) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.map((a, i) =>
        i === index ? { ...a, ...patch } : a,
      ),
    }));
  };

  const removeAttributeField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Tactical Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
            Attribute <span className="text-gold">Intelligence</span>
          </h1>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] italic flex items-center gap-2">
            <Layers size={12} className="text-gold" /> Component-level attribute
            sets for product variant generation.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="h-12 px-6 bg-charcoal border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3"
            onClick={() => setShowImportModal(true)}
          >
            <Upload size={16} /> Bulk Manifest
          </button>
          <button
            className="h-12 px-10 bg-olive text-white hover:bg-olive-lt font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-olive/20"
            onClick={() => {
              setForm(createEmptyDraft());
              setEditingId(null);
              setShowForm(true);
            }}
          >
            <Plus size={18} /> Deploy New Set
          </button>
        </div>
      </div>

      {/* Editor Form */}
      {showForm && (
        <div className="bg-charcoal border-l-4 border-gold p-8 space-y-8 shadow-2xl shadow-black/60 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-ink border border-gold/20 flex items-center justify-center text-gold">
                <Settings size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest">
                  {editingId
                    ? "Modify Attribute Logic"
                    : "Configure New Matrix Set"}
                </h3>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic mt-1">
                  Define data fields and synchronization contexts.
                </p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="h-10 w-10 bg-ink border border-white/5 text-white/20 hover:text-white transition-all flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Set Designation
              </label>
              <input
                placeholder="e.g. VEHICLE SPECS"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full h-12 bg-ink border border-white/10 rounded-sm px-4 text-xs font-black text-white uppercase tracking-widest focus:border-gold outline-none"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Serial Key
              </label>
              <input
                placeholder="vehicle-specs"
                value={form.key}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    key: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-"),
                  }))
                }
                className="w-full h-12 bg-ink border border-white/10 rounded-sm px-4 text-xs font-mono font-bold text-gold lowercase tracking-widest focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Operational Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="DESCRIBE SET PURPOSE..."
                className="w-full h-24 bg-ink border border-white/10 rounded-sm p-4 text-xs font-bold text-white uppercase tracking-widest focus:border-gold outline-none resize-none"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Network Contexts (CSV)
              </label>
              <textarea
                value={form.contexts}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contexts: e.target.value }))
                }
                placeholder="e.g. automotive, gear, outdoor"
                className="w-full h-24 bg-ink border border-white/10 rounded-sm p-4 text-xs font-bold text-white uppercase tracking-widest focus:border-gold outline-none resize-none"
              />
            </div>
          </div>

          {/* Attribute Fields */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-gold" /> Matrix Fields
              </h4>
              <button
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    attributes: [...prev.attributes, createEmptyField()],
                  }))
                }
                className="px-4 py-2 bg-charcoal border border-white/10 text-gold text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
              >
                <Plus size={14} /> Add Data Field
              </button>
            </div>

            <div className="space-y-4">
              {form.attributes.map((field, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-ink/40 p-4 border border-white/5 rounded-sm relative group"
                >
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">
                      KEY
                    </label>
                    <input
                      value={field.key}
                      onChange={(e) =>
                        updateAttributeField(idx, { key: e.target.value })
                      }
                      placeholder="field-key"
                      className="w-full h-9 bg-ink border border-white/10 rounded-sm px-3 text-[10px] font-mono font-bold text-gold focus:border-gold outline-none"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">
                      LABEL
                    </label>
                    <input
                      value={field.label}
                      onChange={(e) =>
                        updateAttributeField(idx, { label: e.target.value })
                      }
                      placeholder="Field Label"
                      className="w-full h-9 bg-ink border border-white/10 rounded-sm px-3 text-[10px] font-bold text-white uppercase focus:border-gold outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">
                      TYPE
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) =>
                        updateAttributeField(idx, { type: e.target.value })
                      }
                      className="w-full h-9 bg-ink border border-white/10 rounded-sm px-3 text-[10px] font-black text-white uppercase focus:border-gold outline-none appearance-none"
                    >
                      <option value="select">Select</option>
                      <option value="multiselect">Multi-Select</option>
                      <option value="text">Protocol Text</option>
                      <option value="number">Integer</option>
                      <option value="boolean">Boolean Logic</option>
                    </select>
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">
                      OPTIONS (CSV)
                    </label>
                    <input
                      value={field.options}
                      onChange={(e) =>
                        updateAttributeField(idx, { options: e.target.value })
                      }
                      placeholder="Option A, Option B..."
                      className="w-full h-9 bg-ink border border-white/10 rounded-sm px-3 text-[10px] font-bold text-white/60 focus:border-gold outline-none"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end justify-center pb-1">
                    <button
                      onClick={() => removeAttributeField(idx)}
                      className="p-2 text-white/10 hover:text-red transition-colors"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
            <button
              type="button"
              onClick={resetForm}
              className="h-12 px-8 bg-charcoal border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white"
            >
              Abort Config
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-12 px-12 bg-olive text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-olive/20 flex items-center gap-3"
            >
              {saving ? (
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {editingId ? "Update Logic" : "Deploy Matrix"}
            </button>
          </div>
        </div>
      )}

      {/* Grid Controls */}
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-charcoal p-5 rounded-none border border-white/5 shadow-2xl shadow-black/40">
        <div className="relative w-full sm:w-[400px] group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors"
            size={16}
          />
          <input
            placeholder="IDENTIFY MATRIX BY DESIGNATION OR KEY..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-12 pr-4 bg-ink border border-white/10 rounded-sm text-xs font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:border-gold outline-none"
          />
        </div>
        <div className="flex items-center gap-3 text-white/20 italic text-[10px] font-black uppercase tracking-widest">
          <Database size={14} /> Repository Sync Active
        </div>
      </div>

      {/* Attributes Grid */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 bg-charcoal border border-white/5">
          <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic animate-pulse">
            Decoding Attribute Matrix...
          </span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-6 bg-charcoal border border-white/5 opacity-10">
          <Layers size={48} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">
            Matrix Node Registry Vacant
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((record) => (
            <div
              key={record._id}
              className="bg-charcoal border border-white/5 p-6 space-y-4 hover:border-gold/30 transition-all group shadow-2xl shadow-black/40"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest group-hover:text-gold transition-colors">
                    {record.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono font-bold text-gold/60 uppercase tracking-widest px-2 py-0.5 bg-ink border border-gold/10">
                      {record.key}
                    </span>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                      {record.attributes?.length || 0} LOGIC FIELDS
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="p-2 text-white/10 hover:text-gold hover:bg-gold/10 transition-all"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(record)}
                    className="p-2 text-white/10 hover:text-red hover:bg-red/10 transition-all"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                {(record.attributes || []).slice(0, 3).map((a, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest"
                  >
                    <span className="text-white/40">{a.label}</span>
                    <span className="text-white/20 italic">{a.type}</span>
                  </div>
                ))}
                {(record.attributes || []).length > 3 && (
                  <p className="text-[8px] font-bold text-white/10 uppercase tracking-[0.2em] pt-1">
                    + {(record.attributes || []).length - 3} ADDITIONAL FIELDS
                    DETECTED
                  </p>
                )}
              </div>

              {record.description && (
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-tight italic line-clamp-2 pt-2 border-t border-white/5">
                  {record.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer Intel */}
      <div className="flex items-center gap-3 opacity-40">
        <Terminal size={14} className="text-gold" />
        <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">
          Logistics Terminal: Secure Link | Stream Encryption: AES-256
        </span>
      </div>

      <TacticalImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        sampleData={attributeSampleData}
        title="Attribute Matrix Injection"
        description="Synchronize bulk attribute logic hubs via secure JSON manifest."
        fileName="attributes"
      />
    </div>
  );
}

export default function AttributesPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen bg-ink">
      <Suspense
        fallback={
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
              Initializing Tactical Hub...
            </span>
          </div>
        }
      >
        <AttributesPageContent />
      </Suspense>
    </div>
  );
}
