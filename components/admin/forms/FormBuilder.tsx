"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Settings2,
  Terminal,
  Type,
  Hash,
  AlignLeft,
  ChevronDownSquare,
  CheckSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface FormField {
  id: string;
  type: "text" | "number" | "textarea" | "select" | "checkbox";
  label: string;
  name?: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select type
}

interface FormBuilderProps {
  initialFields?: FormField[];
  onSave: (name: string, fields: FormField[]) => void;
  initialName?: string;
  loading?: boolean;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  initialFields = [],
  onSave,
  initialName = "",
  loading = false,
}) => {
  const [formName, setFormName] = useState(initialName);
  const [fields, setFields] = useState<FormField[]>(initialFields);

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      name: `field_${Date.now()}`,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: "",
      required: false,
      options: type === "select" ? ["Option 1"] : undefined,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newFields = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    [newFields[index], newFields[targetIndex]] = [
      newFields[targetIndex],
      newFields[index],
    ];
    setFields(newFields);
  };

  const handleAddFieldOption = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field && field.options) {
      updateField(fieldId, {
        options: [...field.options, `Option ${field.options.length + 1}`],
      });
    }
  };

  const updateFieldOption = (
    fieldId: string,
    optIndex: number,
    value: string,
  ) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field && field.options) {
      const newOpts = [...field.options];
      newOpts[optIndex] = value;
      updateField(fieldId, { options: newOpts });
    }
  };

  const getIcon = (type: FormField["type"]) => {
    switch (type) {
      case "text":
        return <Type size={16} />;
      case "number":
        return <Hash size={16} />;
      case "textarea":
        return <AlignLeft size={16} />;
      case "select":
        return <ChevronDownSquare size={16} />;
      case "checkbox":
        return <CheckSquare size={16} />;
      default:
        return <Type size={16} />;
    }
  };


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Configuration Header */}
      <div className="bg-charcoal border border-white/5 p-8 rounded-sm shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Settings2 size={120} className="text-white" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-white/5">
            <div className="h-10 w-10 flex items-center justify-center rounded-sm bg-olive/10 border border-olive/30 text-gold shadow-inner">
              <Terminal size={18} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
              Form <span className="text-gold/80">Configuration</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1 italic">
                Form Designation (Name)
              </Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="ENTER FORM NAME e.g. CUSTOM PC BUILD"
                className="h-14 bg-ink/40 border-white/5 rounded-sm focus:border-gold/30 transition-all shadow-inner text-sm font-bold italic tracking-wider text-white uppercase"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => onSave(formName, fields)}
                disabled={loading || !formName.trim() || fields.length === 0}
                className="w-full h-14 bg-olive text-white font-black text-[11px] uppercase tracking-[0.2em] italic hover:bg-olive-lt shadow-xl active:scale-95 transition-all"
              >
                {loading
                  ? "Synchronizing..."
                  : "Initialize Registry Node (Save Form)"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Field List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-4 pb-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
              Form Matrix Structure
            </h4>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/40 italic">
              {fields.length} Nodes Localized
            </span>
          </div>

          {fields.length === 0 ? (
            <div className="h-64 border-2 border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center gap-4 bg-white/[0.02]">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white/10">
                <Plus size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">
                No fields deployed. Use the sidebar to add components.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-charcoal border border-white/5 p-6 rounded-sm shadow-xl hover:border-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-sm bg-ink/60 border border-white/5 flex items-center justify-center text-gold/60">
                          {getIcon(field.type)}
                        </div>
                        <div className="flex-1">
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              updateField(field.id, { label: e.target.value })
                            }
                            placeholder="FIELD LABEL"
                            className="bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-white font-black uppercase tracking-tighter text-lg italic"
                          />
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/20 hover:text-white"
                            onClick={() => moveField(index, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/20 hover:text-white"
                            onClick={() => moveField(index, "down")}
                            disabled={index === fields.length - 1}
                          >
                            <ChevronDown size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/20 hover:text-red"
                            onClick={() => removeField(field.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-1 italic">
                            Internal Name
                          </Label>
                          <Input
                            value={field.name || ""}
                            onChange={(e) =>
                              updateField(field.id, {
                                name: e.target.value.replace(/\s+/g, ""),
                              })
                            }
                            placeholder="FIELD_KEY"
                            className="h-10 bg-ink/40 border-white/5 rounded-sm text-[11px] font-bold italic tracking-wider text-white/60"
                          />
                        </div>

                        {field.type !== "checkbox" && (
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-1 italic">
                              Placeholder
                            </Label>
                            <Input
                              value={field.placeholder || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  placeholder: e.target.value,
                                })
                              }
                              placeholder="INSTRUCTIONAL TEXT"
                              className="h-10 bg-ink/40 border-white/5 rounded-sm text-[11px] font-bold italic tracking-wider text-white/60 uppercase"
                            />
                          </div>
                        )}

                        <div className="flex items-end justify-between p-3 rounded-sm bg-ink/20 border border-white/5">
                          <Label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">
                            Mandatory Entry
                          </Label>
                          <Switch
                            checked={field.required}
                            onCheckedChange={(val) =>
                              updateField(field.id, { required: val })
                            }
                          />
                        </div>
                      </div>

                      {field.type === "select" && (
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          <Label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-1 italic">
                            Option Matrix
                          </Label>
                          <div className="space-y-2">
                            {field.options?.map((opt, optIdx) => (
                              <div key={optIdx} className="flex gap-2">
                                <Input
                                  value={opt}
                                  onChange={(e) =>
                                    updateFieldOption(
                                      field.id,
                                      optIdx,
                                      e.target.value,
                                    )
                                  }
                                  className="h-9 bg-ink/20 border-white/5 text-[10px] font-bold text-white uppercase italic"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-white/10 hover:text-red"
                                  onClick={() => {
                                    const next = field.options!.filter(
                                      (_, i) => i !== optIdx,
                                    );
                                    updateField(field.id, { options: next });
                                  }}
                                  disabled={field.options!.length <= 1}
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              className="w-full h-8 border border-white/5 border-dashed text-[9px] font-black uppercase text-gold/40 hover:text-gold hover:bg-gold/5 italic"
                              onClick={() => handleAddFieldOption(field.id)}
                            >
                              Add New Option Node
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Component Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-charcoal border border-white/5 p-8 rounded-sm shadow-2xl sticky top-24">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic pb-4 border-b border-white/5 mb-6">
              Component Repository
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  type: "text" as const,
                  label: "Text String",
                  desc: "Standard alphanumeric input",
                },
                {
                  type: "number" as const,
                  label: "Numeric Value",
                  desc: "Integer or float data",
                },
                {
                  type: "textarea" as const,
                  label: "Long Message",
                  desc: "Multi-line descriptive text",
                },
                {
                  type: "select" as const,
                  label: "Option Selector",
                  desc: "Defined matrix selection",
                },
                {
                  type: "checkbox" as const,
                  label: "Toggle Switch",
                  desc: "Binary boolean state",
                },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => addField(item.type)}
                  className="flex items-start gap-4 p-4 rounded-sm border border-white/5 bg-ink/40 text-left hover:border-gold/30 hover:bg-gold/5 transition-all group active:scale-95"
                >
                  <div className="h-10 w-10 rounded-sm bg-olive/10 border border-olive/30 flex items-center justify-center text-gold shadow-inner group-hover:scale-110 transition-transform">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white uppercase tracking-wider italic group-hover:text-gold transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">
                      {item.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gold/5 border border-gold/10 rounded-sm italic">
              <div className="flex items-center gap-3 mb-2">
                <GripVertical className="text-gold" size={14} />
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                  Deployment Protocol
                </span>
              </div>
              <p className="text-[8px] text-white/30 uppercase leading-relaxed font-bold tracking-tighter">
                Components are added to the mission grid. Drag-and-drop is
                currently manual via index controls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
