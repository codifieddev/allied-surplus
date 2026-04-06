"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ContentItem } from "@/components/admin/cms/ContentItem";
import { 
  Plus, 
  Trash, 
  Layers, 
  ChevronUp, 
  ChevronDown,
  LayoutGrid,
  ChevronRight,
  ChevronDown as ChevronDownIcon,
  Columns as ColumnsIcon,
  Zap,
  Maximize2,
  Terminal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SectionBlockProps {
  section: any;
  onUpdate: (updates: any) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!section.columns || section.columns.length === 0) {
      const initialContent = section.content || [];
      onUpdate({ columns: [initialContent], content: [] });
    }
  }, []);

  const getColCount = (layout: string) => {
    switch (layout) {
      case "grid-1": return 1;
      case "grid-2": return 2;
      case "grid-3": return 3;
      case "grid-4": return 4;
      default: return 1;
    }
  };

  const handleLayoutChange = (newLayout: string) => {
    const newCount = getColCount(newLayout);
    const currentCols = section.columns || [[]];
    const newCols = [...currentCols];

    if (newCount > currentCols.length) {
      for (let i = currentCols.length; i < newCount; i++) {
        newCols.push([]);
      }
    } else if (newCount < currentCols.length) {
      const mergedContent = [...newCols[newCount - 1]];
      for (let i = newCount; i < currentCols.length; i++) {
        mergedContent.push(...currentCols[i]);
      }
      newCols[newCount - 1] = mergedContent;
      newCols.splice(newCount);
    }

    onUpdate({ layout: newLayout, columns: newCols });
  };

  const addContentElement = (type: string, colIndex: number = 0) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      ...(type === "heading" ? { level: "h2", text: "NEW TACTICAL HEADING" } : {}),
      ...(type === "paragraph" ? { text: "" } : {}),
      ...(type === "image" ? { url: "", alt: "" } : {}),
      ...(type === "button" ? { buttons: [{ id: Math.random().toString(36).substr(2, 9), label: "ACTION", link: "#", actionType: "link" }] } : {}),
      ...(type === "list" ? { items: [""] } : {}),
      ...(type === "section" ? { layout: "grid-1", columns: [[]] } : {}),
      ...(type === "carousel" ? { items: [{ id: Math.random().toString(36).substr(2, 9), adminTitle: "TACTICAL SLIDE", layout: "grid-1", columns: [[]] }] } : {}),
      ...(type === "cta" ? { title: "", subtitle: "", description: "", buttonLabel: "", buttonLink: "" } : {}),
      ...(type === "cards" ? { items: [] } : {}),
      ...(type === "features" ? { items: [] } : {}),
      ...(type === "testimonial" ? { quote: "", author: "", role: "", avatar: "" } : {}),
    };

    const newCols = [...(section.columns || [[]])];
    if (!newCols[colIndex]) newCols[colIndex] = [];
    newCols[colIndex] = [...newCols[colIndex], newItem];
    
    onUpdate({ columns: newCols });
    setIsOpen(true);
  };

  const updateItem = (itemId: string, colIndex: number, updates: any) => {
    const newCols = [...(section.columns || [[]])];
    newCols[colIndex] = newCols[colIndex].map((item: any) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    onUpdate({ columns: newCols });
  };

  const removeItem = (itemId: string, colIndex: number) => {
    const newCols = [...(section.columns || [[]])];
    newCols[colIndex] = newCols[colIndex].filter((item: any) => item.id !== itemId);
    onUpdate({ columns: newCols });
  };

  const moveItem = (index: number, colIndex: number, direction: "up" | "down") => {
    const newCols = [...(section.columns || [[]])];
    const colContent = [...newCols[colIndex]];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= colContent.length) return;
    
    [colContent[index], colContent[targetIndex]] = [
      colContent[targetIndex],
      colContent[index],
    ];
    newCols[colIndex] = colContent;
    onUpdate({ columns: newCols });
  };

  const columns = section.columns || [section.content || []];
  const totalItemCount = columns.reduce((acc: number, col: any[]) => acc + (col?.length || 0), 0);

  return (
    <div className="bg-charcoal border-2 border-charcoal-light rounded-none p-6 space-y-6 relative group/section transition-all hover:border-gold/50 shadow-2xl border-l-4 border-l-gold">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-charcoal-light">
        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-ink border border-charcoal-light text-gold hover:bg-gold hover:text-ink transition-all rounded-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronDownIcon size={20} /> : <ChevronRight size={20} />}
          </Button>

          <div className="p-2 bg-charcoal-light border border-charcoal text-gold">
            <Layers size={18} />
          </div>
          
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 leading-none italic">Sector Module</span>
              {!isOpen && totalItemCount > 0 && (
                 <span className="px-2 py-0.5 bg-gold text-[9px] font-black text-ink uppercase tracking-widest">
                   {totalItemCount} Units Detected
                 </span>
              )}
            </div>
            {isOpen ? (
              <Input 
                value={section.adminTitle || ""} 
                onChange={(e) => onUpdate({ adminTitle: e.target.value })} 
                placeholder="SECTOR REPOSITORY CODENAME..." 
                className="h-10 bg-ink border border-charcoal-light text-xs font-black text-white hover:border-gold transition-all uppercase tracking-widest" 
              />
            ) : (
              <span className="text-sm font-black text-white uppercase tracking-[0.2em] truncate cursor-pointer hover:text-gold transition-colors" onClick={() => setIsOpen(true)}>
                {section.adminTitle || "UNNAMED SECTOR"}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-ink border border-charcoal-light p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-gold hover:bg-charcoal transition-all rounded-none"
              onClick={onMoveUp}
              disabled={isFirst}
            >
              <ChevronUp size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-gold hover:bg-charcoal transition-all rounded-none"
              onClick={onMoveDown}
              disabled={isLast}
            >
              <ChevronDown size={16} />
            </Button>
          </div>

          <Select
            value={section.layout || "grid-1"}
            onValueChange={handleLayoutChange}
          >
            <SelectTrigger className="w-[140px] h-10 bg-ink border border-charcoal-light text-[10px] font-black text-white uppercase tracking-widest rounded-none focus:ring-1 focus:ring-gold">
              <LayoutGrid size={14} className="mr-2 text-gold opacity-50" />
              <SelectValue placeholder="Layout" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal border-gold text-white font-black uppercase tracking-widest text-[9px]">
              <SelectItem value="grid-1">01 Sector</SelectItem>
              <SelectItem value="grid-2">02 Sectors</SelectItem>
              <SelectItem value="grid-3">03 Sectors</SelectItem>
              <SelectItem value="grid-4">04 Sectors</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-charcoal-light/50 text-slate-500 hover:text-red-500 transition-all rounded-none border border-transparent hover:border-red-500/30"
            onClick={onRemove}
          >
            <Trash size={18} />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className={cn(
          "grid gap-10 animate-in fade-in duration-300",
          columns.length === 1 ? "grid-cols-1" : 
          columns.length === 2 ? "grid-cols-2" :
          columns.length === 3 ? "grid-cols-3" : "grid-cols-4"
        )}>
          {columns.map((col: any[], colIdx: number) => (
            <div key={colIdx} className={cn(
              "space-y-6 pb-6 relative",
              columns.length > 1 ? "border-r border-charcoal-light last:border-r-0 pr-8 last:pr-0" : ""
            )}>
              {columns.length > 1 && (
                <div className="flex items-center gap-3 mb-6 bg-ink border border-charcoal-light p-2 w-fit">
                   <ColumnsIcon size={12} className="text-gold" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Sector {colIdx+1}</span>
                </div>
              )}
              
              <div className="space-y-6 min-h-[100px] bg-ink/20 p-2 border border-charcoal-light/30 border-dashed">
                {(col || []).map((item: any, idx: number) => (
                  <ContentItem
                    key={item.id}
                    item={item}
                    onChange={(updates: any) => updateItem(item.id, colIdx, updates)}
                    onRemove={() => removeItem(item.id, colIdx)}
                    onMoveUp={() => moveItem(idx, colIdx, "up")}
                    onMoveDown={() => moveItem(idx, colIdx, "down")}
                    isFirst={idx === 0}
                    isLast={idx === (col?.length || 0) - 1}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-charcoal-light mt-6">
                 {[
                   { type: "heading", label: "Heading", icon: Plus },
                   { type: "paragraph", label: "Intel Text", icon: Plus },
                   { type: "image", label: "Asset Lab", icon: Plus },
                   { type: "section", label: "Sub Sector", icon: Maximize2 },
                   { type: "button", label: "Action Trigger", icon: Zap },
                   { type: "carousel", label: "Stream", icon: Plus },
                   { type: "cards", label: "Unit Grid", icon: Plus },
                 ].map((act) => (
                    <button
                      key={act.type}
                      onClick={() => addContentElement(act.type, colIdx)}
                      className="px-3 py-2 bg-charcoal border border-charcoal-light text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-gold hover:text-gold transition-all flex items-center gap-2"
                    >
                      <act.icon size={12} className="opacity-50" /> {act.label}
                    </button>
                 ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isOpen && (
         <div className="flex items-center gap-3 opacity-20">
            <Terminal size={12} className="text-gold" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Sector Module Dormant</span>
         </div>
      )}
    </div>
  );
};
