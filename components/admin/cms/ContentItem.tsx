"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Type, 
  AlignLeft, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  List, 
  Trash, 
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  CreditCard,
  Zap,
  Quote,
  GalleryHorizontal,
  PlusCircle,
  Terminal,
  Activity,
  Maximize2,
  ShieldCheck
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionBlock } from "@/components/admin/cms/SectionBlock";
import { MediaLibraryModal } from "../media/MediaLibraryModal";

interface ContentItemProps {
  item: any;
  onChange: (updates: any) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const ContentItem: React.FC<ContentItemProps> = ({
  item,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const renderFields = () => {
    switch (item.type) {
      case "carousel":
        return (
          <div className="space-y-6">
            {(item.items || []).map((slide: any, idx: number) => (
              <div key={idx} className="bg-ink border border-charcoal-light p-6 rounded-none relative group/slide">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-charcoal-light">
                   <div className="flex items-center gap-3">
                     <span className="px-3 py-1 bg-gold text-[9px] font-black uppercase text-ink">Slide #{idx + 1}</span>
                     <Input 
                        value={slide.adminTitle || ""} 
                        onChange={(e) => {
                          const newItems = [...item.items];
                          newItems[idx] = { ...slide, adminTitle: e.target.value };
                          onChange({ items: newItems });
                        }} 
                        placeholder="SLIDE CODENAME..." 
                        className="h-8 text-[10px] font-black border-none bg-transparent p-0 w-48 focus-visible:ring-0 text-white uppercase tracking-widest" 
                     />
                   </div>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-none transition-all" 
                    onClick={() => {
                      const newItems = item.items.filter((_: any, i: number) => i !== idx);
                      onChange({ items: newItems });
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
                <div className="mt-4 border-l-2 border-gold pl-6 py-4 w-full bg-charcoal/30">
                  <SectionBlock
                    section={slide}
                    onUpdate={(updates) => {
                      const newItems = [...item.items];
                      newItems[idx] = { ...slide, ...updates };
                      onChange({ items: newItems });
                    }}
                    onRemove={() => {
                      const newItems = item.items.filter((_: any, i: number) => i !== idx);
                      onChange({ items: newItems });
                    }}
                    onMoveUp={() => {
                      if (idx === 0) return;
                      const newItems = [...item.items];
                      [newItems[idx], newItems[idx-1]] = [newItems[idx-1], newItems[idx]];
                      onChange({ items: newItems });
                    }}
                    onMoveDown={() => {
                      if (idx === item.items.length - 1) return;
                      const newItems = [...item.items];
                      [newItems[idx], newItems[idx+1]] = [newItems[idx+1], newItems[idx]];
                      onChange({ items: newItems });
                    }}
                    isFirst={idx === 0}
                    isLast={idx === (item.items || []).length - 1}
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full py-6 border-dashed border-charcoal-light bg-charcoal text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-gold hover:border-gold transition-all rounded-none gap-3" onClick={() => {
              const newItems = [...(item.items || []), { 
                id: Math.random().toString(36).substr(2, 9),
                adminTitle: "NEW TACTICAL SLIDE",
                layout: "grid-1", 
                columns: [[]] 
              }];
              onChange({ items: newItems });
            }}>
              <PlusCircle size={16} className="text-gold" /> Initiate New Transition Segment
            </Button>
          </div>
        );

      case "section":
        return (
          <div className="mt-4 border-l-2 border-gold pl-6 py-4 w-full bg-charcoal/20">
            <SectionBlock
              section={item}
              onUpdate={(updates) => onChange(updates)}
              onRemove={onRemove}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              isFirst={isFirst}
              isLast={isLast}
            />
          </div>
        );

      case "heading":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <Select
                value={item.level || "h1"}
                onValueChange={(val) => onChange({ level: val })}
              >
                <SelectTrigger className="w-[85px] h-10 bg-ink border-charcoal-light text-[11px] font-black text-gold uppercase tracking-widest rounded-none">
                  <SelectValue placeholder="LVL" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-gold text-white font-black uppercase tracking-widest text-[10px]">
                  <SelectItem value="h1">LVL 01</SelectItem>
                  <SelectItem value="h2">LVL 02</SelectItem>
                  <SelectItem value="h3">LVL 03</SelectItem>
                  <SelectItem value="h4">LVL 04</SelectItem>
                  <SelectItem value="h5">LVL 05</SelectItem>
                  <SelectItem value="h6">LVL 06</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="HEADING INTEL..."
                value={item.text || ""}
                onChange={(e) => onChange({ text: e.target.value })}
                className="h-10 bg-ink border-charcoal-light text-sm font-black text-white hover:border-gold transition-all uppercase tracking-widest rounded-none"
              />
            </div>
          </div>
        );

      case "paragraph":
        return (
          <Textarea
            placeholder="PROBE FOR CONTENT..."
            value={item.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
            className="min-h-[120px] bg-ink border-charcoal-light text-xs font-bold text-slate-300 focus:border-gold transition-all rounded-none uppercase tracking-widest"
          />
        );

      case "image":
        return (
          <div className="space-y-6">
            {!item.url ? (
              <MediaLibraryModal 
                onSelect={(m) => onChange({ url: m.url, alt: m.alt || item.alt })}
                trigger={
                  <Button variant="outline" className="w-full h-32 border-2 border-dashed border-charcoal-light bg-ink text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-gold hover:border-gold transition-all rounded-none flex flex-col gap-3">
                    <ImageIcon size={24} className="text-gold opacity-50" />
                    <span>Select Tactical Asset</span>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                <div className="relative group/img-preview border-2 border-charcoal-light bg-ink flex items-center justify-center min-h-[200px] max-h-[400px] overflow-hidden">
                  <img src={item.url} alt={item.alt} className="w-full h-full object-contain opacity-80" />
                  <div className="absolute inset-0 bg-ink/80 opacity-0 group-hover/img-preview:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                    <div className="flex gap-4">
                       <MediaLibraryModal 
                        onSelect={(m) => onChange({ url: m.url, alt: m.alt || item.alt })}
                        trigger={
                          <Button className="bg-olive text-white px-6 py-4 rounded-none font-black uppercase tracking-widest text-[10px] transition-all">
                             <ImageIcon size={14} className="mr-2" /> Re-Deploy Asset
                          </Button>
                        }
                      />
                      <Button 
                        variant="destructive" 
                        className="bg-red-600 hover:bg-white hover:text-ink px-6 py-4 rounded-none font-black uppercase tracking-widest text-[10px] transition-all"
                        onClick={() => onChange({ url: "", alt: "" })}
                      >
                        Terminate Asset
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">{item.url.split('/').pop()}</p>
                  </div>
                </div>
                {item.alt && (
                  <div className="flex items-center gap-3 opacity-40">
                     <Terminal size={12} className="text-gold" />
                     <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">INTEL: {item.alt}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case "button":
        const buttonItems = item.buttons || (item.label ? [{ id: 'migrated', label: item.label, link: item.link, actionType: 'link' }] : []);
        
        return (
          <div className="space-y-4">
             {buttonItems.map((btn: any, idx: number) => (
                <div key={idx} className="bg-ink border border-charcoal-light p-6 space-y-6 relative group/btn">
                  <div className="flex items-center justify-between border-b border-charcoal-light pb-4 mb-2">
                    <div className="flex items-center gap-4">
                       <span className="px-3 py-1 bg-charcoal text-[9px] font-black uppercase text-gold tracking-widest">Trigger #{idx + 1}</span>
                       <Select
                          value={btn.actionType || "link"}
                          onValueChange={(val) => {
                            const newButtons = [...buttonItems];
                            newButtons[idx] = { ...btn, actionType: val };
                            onChange({ buttons: newButtons, label: undefined, link: undefined });
                          }}
                        >
                          <SelectTrigger className="w-[120px] h-8 bg-ink border-charcoal-light text-[10px] font-black text-white uppercase tracking-widest rounded-none">
                            <SelectValue placeholder="Action" />
                          </SelectTrigger>
                          <SelectContent className="bg-charcoal border-gold text-white font-black uppercase tracking-widest text-[9px]">
                            <SelectItem value="link">Network Route</SelectItem>
                            <SelectItem value="button">Trigger Event</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-none transition-all"
                      onClick={() => {
                        const newButtons = buttonItems.filter((_: any, i: number) => i !== idx);
                        onChange({ buttons: newButtons, label: undefined, link: undefined });
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Action Label</label>
                      <Input
                        placeholder="INITIATE..."
                        value={btn.label || ""}
                        onChange={(e) => {
                          const newButtons = [...buttonItems];
                          newButtons[idx] = { ...btn, label: e.target.value };
                          onChange({ buttons: newButtons, label: undefined, link: undefined });
                        }}
                        className="h-10 bg-ink border-charcoal-light text-xs text-white font-black uppercase tracking-widest rounded-none focus:border-gold transition-all"
                      />
                    </div>

                    {btn.actionType === "link" ? (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Network Target (href)</label>
                        <Input
                          placeholder="/OPERATIONS"
                          value={btn.link || ""}
                          onChange={(e) => {
                            const newButtons = [...buttonItems];
                            newButtons[idx] = { ...btn, link: e.target.value };
                            onChange({ buttons: newButtons, label: undefined, link: undefined });
                          }}
                          className="h-10 bg-ink border-charcoal-light text-xs text-white font-bold rounded-none focus:border-gold transition-all"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Trigger Protocol</label>
                        <Select
                          value={btn.buttonType || "button"}
                          onValueChange={(val) => {
                            const newButtons = [...buttonItems];
                            newButtons[idx] = { ...btn, buttonType: val };
                            onChange({ buttons: newButtons, label: undefined, link: undefined });
                          }}
                        >
                          <SelectTrigger className="h-10 bg-ink border-charcoal-light text-xs text-white font-black uppercase tracking-widest rounded-none">
                            <SelectValue placeholder="PRT" />
                          </SelectTrigger>
                          <SelectContent className="bg-charcoal border-gold text-white font-black uppercase tracking-widest text-[10px]">
                            <SelectItem value="button">Standard Trigger</SelectItem>
                            <SelectItem value="submit">Commit Form</SelectItem>
                            <SelectItem value="reset">Clear Form</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
             ))}

             <Button 
                variant="outline" 
                className="w-full py-4 border-dashed border-charcoal-light bg-charcoal text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-gold hover:border-gold transition-all rounded-none gap-2"
                onClick={() => {
                  const newButtons = [...buttonItems, { id: Math.random().toString(36).substr(2, 9), label: "EXECUTE", actionType: "link", link: "#" }];
                  onChange({ buttons: newButtons, label: undefined, link: undefined });
                }}
              >
                <PlusCircle size={14} className="text-gold" /> Deploy Secondary Trigger
              </Button>
          </div>
        );

      case "cta":
        return (
          <div className="space-y-6 bg-ink border border-charcoal-light p-6 rounded-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Call Header</label>
                <Input value={item.title || ""} onChange={(e) => onChange({ title: e.target.value })} className="h-10 bg-ink border-charcoal-light text-xs text-white font-black uppercase tracking-widest" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Sub Header</label>
                <Input value={item.subtitle || ""} onChange={(e) => onChange({ subtitle: e.target.value })} className="h-10 bg-ink border-charcoal-light text-xs text-white font-black uppercase tracking-widest" />
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Briefing Description</label>
               <Textarea placeholder="CTA BRIEF..." value={item.description || ""} onChange={(e) => onChange({ description: e.target.value })} className="bg-ink border-charcoal-light text-xs text-white font-bold min-h-[80px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Deploy Button Label</label>
                <Input value={item.buttonLabel || ""} onChange={(e) => onChange({ buttonLabel: e.target.value })} className="h-10 bg-ink border-charcoal-light text-xs text-white font-black uppercase tracking-widest" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Deploy Link Target</label>
                <Input value={item.buttonLink || ""} onChange={(e) => onChange({ buttonLink: e.target.value })} className="h-10 bg-ink border-charcoal-light text-xs text-white font-bold" />
              </div>
            </div>
          </div>
        );

      case "cards":
        return (
          <div className="space-y-6">
            {(item.items || []).map((card: any, idx: number) => (
              <div key={idx} className="bg-ink border border-charcoal-light p-6 rounded-none relative group/card">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal-light">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gold opacity-50">Intelligence Unit #{idx + 1}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-none transition-all" 
                    onClick={() => {
                      const newItems = item.items.filter((_: any, i: number) => i !== idx);
                      onChange({ items: newItems });
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Unit Designation</label>
                    <Input placeholder="SLOT TITLE..." value={card.title || ""} onChange={(e) => {
                      const newItems = [...item.items];
                      newItems[idx] = { ...card, title: e.target.value };
                      onChange({ items: newItems });
                    }} className="h-10 bg-ink border-charcoal-light text-xs font-black text-white uppercase tracking-widest" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Asset Mapping</label>
                       <MediaLibraryModal onSelect={(m) => {
                          const newItems = [...item.items];
                          newItems[idx] = { ...card, image: m.url };
                          onChange({ items: newItems });
                       }} />
                    </div>
                    <Input placeholder="HTTPS://ASSET-NETWORK.COM..." value={card.image || ""} onChange={(e) => {
                      const newItems = [...item.items];
                      newItems[idx] = { ...card, image: e.target.value };
                      onChange({ items: newItems });
                    }} className="h-10 bg-ink border-charcoal-light text-xs font-bold text-white rounded-none" />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">Unit Intel Data</label>
                   <Textarea placeholder="DATA BRIEF..." value={card.description || ""} onChange={(e) => {
                    const newItems = [...item.items];
                    newItems[idx] = { ...card, description: e.target.value };
                    onChange({ items: newItems });
                  }} className="bg-ink border-charcoal-light text-xs text-white font-bold min-h-[80px]" />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full py-4 border-dashed border-charcoal-light bg-charcoal text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-gold hover:border-gold transition-all rounded-none gap-2" onClick={() => {
              const newItems = [...(item.items || []), { title: "NEW UNIT", description: "DATA PENDING...", image: "", link: "" }];
              onChange({ items: newItems });
            }}>+ Deploy Unit Deployment Slot</Button>
          </div>
        );

      case "list":
        return (
          <div className="space-y-4">
            {(item.items || []).map((li: string, idx: number) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="p-2 bg-charcoal-light border border-charcoal text-gold">
                   <Activity size={14} />
                </div>
                <Input
                  value={li}
                  placeholder={`INTEL LINE ${idx + 1}...`}
                  onChange={(e) => {
                    const newItems = [...(item.items || [])];
                    newItems[idx] = e.target.value;
                    onChange({ items: newItems });
                  }}
                  className="h-10 bg-ink border-charcoal-light text-xs font-bold text-white rounded-none focus:border-gold transition-all uppercase tracking-widest"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-none transition-all flex-shrink-0"
                  onClick={() => {
                    const newItems = (item.items || []).filter((_: any, i: number) => i !== idx);
                    onChange({ items: newItems });
                  }}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full py-4 border-dashed border-charcoal-light bg-charcoal text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-gold hover:border-gold transition-all rounded-none gap-2"
              onClick={() => {
                const newItems = [...(item.items || []), "NEW INTEL LINE"];
                onChange({ items: newItems });
              }}
            >
              + Sub-Objective Entry
            </Button>
          </div>
        );

      default:
        return (
          <div className="flex items-center gap-3 p-4 bg-red-950 border border-red-500 text-red-500">
             <ShieldCheck size={20} />
             <span className="text-[10px] font-black uppercase tracking-widest italic">UNIDENTIFIED MODULE TYPE: ACCESS PROTOCOL FAIL</span>
          </div>
        );
    }
  };

  const getIcon = () => {
    switch (item.type) {
      case "heading": return <Type size={18} />;
      case "paragraph": return <AlignLeft size={18} />;
      case "image": return <ImageIcon size={18} />;
      case "button": return <LinkIcon size={18} />;
      case "list": return <List size={18} />;
      case "section": return <Layers size={18} />;
      case "cta": return <Zap size={18} />;
      case "cards": return <CreditCard size={18} />;
      case "features": return <Zap size={18} />;
      case "testimonial": return <Quote size={18} />;
      case "carousel": return <GalleryHorizontal size={18} />;
      default: return <FileText size={18} />;
    }
  };

  if (item.type === "section") {
    return renderFields();
  }

  return (
    <div className="group relative bg-charcoal border-2 border-charcoal-light rounded-none p-8 transition-all hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5">
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-4 border-b border-charcoal-light">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-ink border border-charcoal-light text-gold group-hover:border-gold transition-all">
            {getIcon()}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
              {item.type} Module
            </span>
            <div className="flex items-center gap-2 mt-1 opacity-40">
               <Activity size={10} className="text-gold" />
               <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">{item.id}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-ink border border-charcoal-light p-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
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
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-charcoal-light/50 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-none border border-transparent hover:border-red-500/30"
            onClick={onRemove}
          >
            <Trash size={20} />
          </Button>
        </div>
      </div>

      <div className="relative">
         {renderFields()}
         <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gold/10 group-hover:bg-gold/40 transition-colors" />
      </div>
    </div>
  );
};
