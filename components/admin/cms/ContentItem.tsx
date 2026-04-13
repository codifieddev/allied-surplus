"use client";

import React, { useState } from "react";
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
  ShieldCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionBlock } from "@/components/admin/cms/SectionBlock";
import { MediaLibraryModal } from "../media/MediaLibraryModal";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const { config: brandConfig, isLoading: loading } = useAppSelector(
    (state) => state.branding,
  );

  const activeLanguages = brandConfig?.languages?.available?.filter(
    (l) => l.enabled,
  ) || [{ code: "en", name: "English", enabled: true }];
  const defaultLang = brandConfig?.languages?.default || "en";

  const getLocalizedValue = (val: any, langCode: string) => {
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      return val[langCode] || "";
    }
    if (langCode === defaultLang && typeof val === "string") {
      return val;
    }
    return "";
  };

  const updateLocalizedValue = (
    currentVal: any,
    langCode: string,
    newValue: string,
  ) => {
    const obj =
      typeof currentVal === "object" &&
      currentVal !== null &&
      !Array.isArray(currentVal)
        ? { ...currentVal }
        : { [defaultLang]: typeof currentVal === "string" ? currentVal : "" };

    obj[langCode] = newValue;
    return obj;
  };

  const getPreviewText = () => {
    switch (item.type) {
      case "heading":
        const hText = item.text;
        const previewH =
          typeof hText === "object"
            ? hText[defaultLang] || Object.values(hText)[0]
            : hText;
        return previewH || "NO HEADING CONTENT";
      case "paragraph":
        const pText = item.text;
        const previewP =
          typeof pText === "object"
            ? pText[defaultLang] || Object.values(pText)[0]
            : pText;
        return previewP
          ? (previewP as string).length > 50
            ? (previewP as string).substring(0, 50).toUpperCase() + "..."
            : (previewP as string).toUpperCase()
          : "EMPTY INTEL SEGMENT";
      case "image":
        return item.url
          ? item.url.split("/").pop()?.toUpperCase() || "ASSET DEPLOYED"
          : "PENDING ASSET";
      case "button":
        const btns = item.buttons || [];
        return btns.length > 0
          ? `${btns.length} TRIGGER(S) CONFIGURED`
          : "NO TRIGGERS";
      case "carousel":
        return `${(item.items || []).length} SLIDES IN STREAM`;
      case "cards":
        return `${(item.items || []).length} INTELLIGENCE UNITS`;
      case "list":
        return `${(item.items || []).length} SUB-OBJECTIVES`;
      case "cta":
        const ctaTitle = item.title;
        const previewCTA =
          typeof ctaTitle === "object"
            ? ctaTitle[defaultLang] || Object.values(ctaTitle)[0]
            : ctaTitle;
        return previewCTA || "CTA PROTOCOL ACTIVE";
      default:
        return "MODULE ACTIVE";
    }
  };

  const renderFields = () => {
    switch (item.type) {
      case "carousel":
        return (
          <div className="space-y-6">
            {(item.items || []).map((slide: any, idx: number) => (
              <div
                key={idx}
                className="bg-ink border border-charcoal-light p-4 rounded-none relative group/slide"
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-charcoal-light">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gold text-[9px] font-black uppercase text-ink">
                      Slide #{idx + 1}
                    </span>
                    <div className="flex-1 space-y-1">
                      {activeLanguages.map((lang) => (
                        <div key={lang.code} className="relative">
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[7px] font-black text-gold/30 pointer-events-none uppercase">
                            {lang.code}
                          </div>
                          <Input
                            value={getLocalizedValue(
                              slide.adminTitle,
                              lang.code,
                            )}
                            onChange={(e) => {
                              const newItems = [...item.items];
                              newItems[idx] = {
                                ...slide,
                                adminTitle: updateLocalizedValue(
                                  slide.adminTitle,
                                  lang.code,
                                  e.target.value,
                                ),
                              };
                              onChange({ items: newItems });
                            }}
                            placeholder={`SLIDE CODENAME (${lang.name})...`}
                            className="h-7 text-[9px] font-black border-none bg-ink/30 p-0 w-full focus-visible:ring-0 text-white uppercase tracking-widest pl-7"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-none transition-all"
                    onClick={() => {
                      const newItems = item.items.filter(
                        (_: any, i: number) => i !== idx,
                      );
                      onChange({ items: newItems });
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
                <div className="mt-2 border-l-2 border-gold pl-4 py-2 w-full bg-charcoal/30">
                  <SectionBlock
                    section={slide}
                    onUpdate={(updates) => {
                      const newItems = [...item.items];
                      newItems[idx] = { ...slide, ...updates };
                      onChange({ items: newItems });
                    }}
                    onRemove={() => {
                      const newItems = item.items.filter(
                        (_: any, i: number) => i !== idx,
                      );
                      onChange({ items: newItems });
                    }}
                    onMoveUp={() => {
                      if (idx === 0) return;
                      const newItems = [...item.items];
                      [newItems[idx], newItems[idx - 1]] = [
                        newItems[idx - 1],
                        newItems[idx],
                      ];
                      onChange({ items: newItems });
                    }}
                    onMoveDown={() => {
                      if (idx === item.items.length - 1) return;
                      const newItems = [...item.items];
                      [newItems[idx], newItems[idx + 1]] = [
                        newItems[idx + 1],
                        newItems[idx],
                      ];
                      onChange({ items: newItems });
                    }}
                    isFirst={idx === 0}
                    isLast={idx === (item.items || []).length - 1}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full py-4 border-dashed border-charcoal-light bg-charcoal text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-gold hover:border-gold transition-all rounded-none gap-3"
              onClick={() => {
                const newItems = [
                  ...(item.items || []),
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    adminTitle: "NEW TACTICAL SLIDE",
                    layout: "grid-1",
                    columns: [[]],
                  },
                ];
                onChange({ items: newItems });
              }}
            >
              <PlusCircle size={16} className="text-gold" /> Initiate New
              Transition Segment
            </Button>
          </div>
        );

      case "section":
        return (
          <div className="mt-2 border-l-2 border-gold pl-4 py-2 w-full bg-charcoal/20">
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
          <div className="flex flex-col gap-2">
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
              <div className="flex-1 space-y-2">
                {activeLanguages.map((lang) => (
                  <div key={lang.code} className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-gold/30 pointer-events-none uppercase">
                      {lang.code}
                    </div>
                    <Input
                      placeholder={`HEADING INTEL (${lang.name})...`}
                      value={getLocalizedValue(item.text, lang.code)}
                      onChange={(e) =>
                        onChange({
                          text: updateLocalizedValue(
                            item.text,
                            lang.code,
                            e.target.value,
                          ),
                        })
                      }
                      className="h-10 bg-ink border-charcoal-light text-sm font-black text-white hover:border-gold transition-all uppercase tracking-widest rounded-none pl-10"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "paragraph":
        return (
          <div className="space-y-3">
            {activeLanguages.map((lang) => (
              <div key={lang.code} className="relative">
                <div className="absolute left-3 top-3 text-[8px] font-black text-gold/30 pointer-events-none uppercase">
                  {lang.code}
                </div>
                <Textarea
                  placeholder={`PROBE FOR CONTENT (${lang.name})...`}
                  value={getLocalizedValue(item.text, lang.code)}
                  onChange={(e) =>
                    onChange({
                      text: updateLocalizedValue(
                        item.text,
                        lang.code,
                        e.target.value,
                      ),
                    })
                  }
                  className="min-h-[80px] bg-ink border-charcoal-light text-xs font-bold text-slate-300 focus:border-gold transition-all rounded-none uppercase tracking-widest pl-10 pt-4"
                />
              </div>
            ))}
          </div>
        );

      case "image":
        return (
          <div className="space-y-6">
            {!item.url ? (
              <MediaLibraryModal
                onSelect={(m) =>
                  onChange({ url: m.url, alt: m.alt || item.alt })
                }
                trigger={
                  <Button
                    variant="outline"
                    className="w-full h-32 border-2 border-dashed border-charcoal-light bg-ink text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-gold hover:border-gold transition-all rounded-none flex flex-col gap-3"
                  >
                    <ImageIcon size={24} className="text-gold opacity-50" />
                    <span>Select Tactical Asset</span>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                <div className="relative group/img-preview border-2 border-charcoal-light bg-ink flex items-center justify-center min-h-[150px] max-h-[300px] overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-contain opacity-80"
                  />
                  <div className="absolute inset-0 bg-ink/80 opacity-0 group-hover/img-preview:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div className="flex gap-2">
                      <MediaLibraryModal
                        onSelect={(m) =>
                          onChange({ url: m.url, alt: m.alt || item.alt })
                        }
                        trigger={
                          <Button className="bg-olive text-white px-4 py-2 rounded-none font-black uppercase tracking-widest text-[9px] transition-all">
                            <ImageIcon size={14} className="mr-2" /> Re-Deploy
                          </Button>
                        }
                      />
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-white hover:text-ink px-4 py-2 rounded-none font-black uppercase tracking-widest text-[9px] transition-all"
                        onClick={() => onChange({ url: "", alt: "" })}
                      >
                        Terminate
                      </Button>
                    </div>
                  </div>
                  {item.alt && activeLanguages.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-charcoal-light/10">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Terminal size={10} className="text-gold" /> Asset Alt
                        Intelligence
                      </p>
                      {activeLanguages.map((lang) => (
                        <div
                          key={lang.code}
                          className="flex items-center gap-3"
                        >
                          <span className="text-[8px] font-black text-gold/40 w-4 uppercase">
                            {lang.code}
                          </span>
                          <Input
                            placeholder={`ALT INTEL (${lang.name})...`}
                            value={getLocalizedValue(item.alt, lang.code)}
                            onChange={(e) =>
                              onChange({
                                alt: updateLocalizedValue(
                                  item.alt,
                                  lang.code,
                                  e.target.value,
                                ),
                              })
                            }
                            className="h-7 bg-ink/50 border-charcoal-light/50 text-[10px] text-slate-400 font-bold rounded-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "button":
        const buttonItems =
          item.buttons ||
          (item.label
            ? [
                {
                  id: "migrated",
                  label: item.label,
                  link: item.link,
                  actionType: "link",
                },
              ]
            : []);

        return (
          <div className="space-y-4">
            {buttonItems.map((btn: any, idx: number) => (
              <div
                key={idx}
                className="bg-ink border border-charcoal-light p-4 space-y-4 relative group/btn"
              >
                <div className="flex items-center justify-between border-b border-charcoal-light pb-2 mb-1">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-charcoal text-[9px] font-black uppercase text-gold tracking-widest">
                      Trigger #{idx + 1}
                    </span>
                    <Select
                      value={btn.actionType || "link"}
                      onValueChange={(val) => {
                        const newButtons = [...buttonItems];
                        newButtons[idx] = { ...btn, actionType: val };
                        onChange({
                          buttons: newButtons,
                          label: undefined,
                          link: undefined,
                        });
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
                      const newButtons = buttonItems.filter(
                        (_: any, i: number) => i !== idx,
                      );
                      onChange({
                        buttons: newButtons,
                        label: undefined,
                        link: undefined,
                      });
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                      Action Label
                    </label>
                    <div className="space-y-2">
                      {activeLanguages.map((lang) => (
                        <div key={lang.code} className="relative">
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-gold/30 pointer-events-none uppercase">
                            {lang.code}
                          </div>
                          <Input
                            placeholder={`LABEL (${lang.name})...`}
                            value={getLocalizedValue(btn.label, lang.code)}
                            onChange={(e) => {
                              const newButtons = [...buttonItems];
                              newButtons[idx] = {
                                ...btn,
                                label: updateLocalizedValue(
                                  btn.label,
                                  lang.code,
                                  e.target.value,
                                ),
                              };
                              onChange({
                                buttons: newButtons,
                                label: undefined,
                                link: undefined,
                              });
                            }}
                            className="h-8 bg-ink border-charcoal-light text-[10px] text-white font-black uppercase tracking-widest rounded-none focus:border-gold transition-all pl-8"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {btn.actionType === "link" ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                        Network Target (href)
                      </label>
                      <Input
                        placeholder="/OPERATIONS"
                        value={btn.link || ""}
                        onChange={(e) => {
                          const newButtons = [...buttonItems];
                          newButtons[idx] = { ...btn, link: e.target.value };
                          onChange({
                            buttons: newButtons,
                            label: undefined,
                            link: undefined,
                          });
                        }}
                        className="h-10 bg-ink border-charcoal-light text-xs text-white font-bold rounded-none focus:border-gold transition-all"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                        Trigger Protocol
                      </label>
                      <Select
                        value={btn.buttonType || "button"}
                        onValueChange={(val) => {
                          const newButtons = [...buttonItems];
                          newButtons[idx] = { ...btn, buttonType: val };
                          onChange({
                            buttons: newButtons,
                            label: undefined,
                            link: undefined,
                          });
                        }}
                      >
                        <SelectTrigger className="h-10 bg-ink border-charcoal-light text-xs text-white font-black uppercase tracking-widest rounded-none">
                          <SelectValue placeholder="PRT" />
                        </SelectTrigger>
                        <SelectContent className="bg-charcoal border-gold text-white font-black uppercase tracking-widest text-[10px]">
                          <SelectItem value="button">
                            Standard Trigger
                          </SelectItem>
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
                const newButtons = [
                  ...buttonItems,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    label: "EXECUTE",
                    actionType: "link",
                    link: "#",
                  },
                ];
                onChange({
                  buttons: newButtons,
                  label: undefined,
                  link: undefined,
                });
              }}
            >
              <PlusCircle size={14} className="text-gold" /> Deploy Secondary
              Trigger
            </Button>
          </div>
        );

      case "cta":
        return (
          <div className="space-y-4 bg-ink border border-charcoal-light p-4 rounded-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                      Call Header
                    </label>
                    {activeLanguages.map((lang) => (
                      <div key={lang.code} className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-gold/30 uppercase">
                          {lang.code}
                        </span>
                        <Input
                          value={getLocalizedValue(item.title, lang.code)}
                          onChange={(e) =>
                            onChange({
                              title: updateLocalizedValue(
                                item.title,
                                lang.code,
                                e.target.value,
                              ),
                            })
                          }
                          className="h-8 bg-ink border-charcoal-light text-[10px] text-white font-black uppercase tracking-widest pl-8"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                      Sub Header
                    </label>
                    {activeLanguages.map((lang) => (
                      <div key={lang.code} className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-gold/30 uppercase">
                          {lang.code}
                        </span>
                        <Input
                          value={getLocalizedValue(item.subtitle, lang.code)}
                          onChange={(e) =>
                            onChange({
                              subtitle: updateLocalizedValue(
                                item.subtitle,
                                lang.code,
                                e.target.value,
                              ),
                            })
                          }
                          className="h-8 bg-ink border-charcoal-light text-[10px] text-white font-black uppercase tracking-widest pl-8"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                    Briefing Description
                  </label>
                  <div className="space-y-2">
                    {activeLanguages.map((lang) => (
                      <div key={lang.code} className="relative">
                        <span className="absolute left-2 top-2 text-[8px] font-black text-gold/30 uppercase">
                          {lang.code}
                        </span>
                        <Textarea
                          placeholder={`CTA BRIEF (${lang.name})...`}
                          value={getLocalizedValue(item.description, lang.code)}
                          onChange={(e) =>
                            onChange({
                              description: updateLocalizedValue(
                                item.description,
                                lang.code,
                                e.target.value,
                              ),
                            })
                          }
                          className="bg-ink border-charcoal-light text-[10px] text-white font-bold min-h-[60px] pl-8 pt-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                      Deploy Button Label
                    </label>
                    {activeLanguages.map((lang) => (
                      <div key={lang.code} className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-gold/30 uppercase">
                          {lang.code}
                        </span>
                        <Input
                          value={getLocalizedValue(item.buttonLabel, lang.code)}
                          onChange={(e) =>
                            onChange({
                              buttonLabel: updateLocalizedValue(
                                item.buttonLabel,
                                lang.code,
                                e.target.value,
                              ),
                            })
                          }
                          className="h-8 bg-ink border-charcoal-light text-[10px] text-white font-black uppercase tracking-widest pl-8"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                      Deploy Link Target
                    </label>
                    <Input
                      value={item.buttonLink || ""}
                      onChange={(e) => onChange({ buttonLink: e.target.value })}
                      className="h-10 bg-ink border-charcoal-light text-xs text-white font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
            ); case "cards": return (
            <div className="space-y-6">
              {(item.items || []).map((card: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-ink border border-charcoal-light p-4 rounded-none relative group/card"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal-light">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gold opacity-50">
                      Intelligence Unit #{idx + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-none transition-all"
                      onClick={() => {
                        const newItems = item.items.filter(
                          (_: any, i: number) => i !== idx,
                        );
                        onChange({ items: newItems });
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                        Unit Designation
                      </label>
                      <div className="space-y-2">
                        {activeLanguages.map((lang) => (
                          <div key={lang.code} className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-gold/30 uppercase">
                              {lang.code}
                            </span>
                            <Input
                              placeholder={`SLOT TITLE (${lang.name})...`}
                              value={getLocalizedValue(card.title, lang.code)}
                              onChange={(e) => {
                                const newItems = [...item.items];
                                newItems[idx] = {
                                  ...card,
                                  title: updateLocalizedValue(
                                    card.title,
                                    lang.code,
                                    e.target.value,
                                  ),
                                };
                                onChange({ items: newItems });
                              }}
                              className="h-8 bg-ink border-charcoal-light text-[10px] font-black text-white uppercase tracking-widest pl-8"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                          Asset Mapping
                        </label>
                        <MediaLibraryModal
                          onSelect={(m) => {
                            const newItems = [...item.items];
                            newItems[idx] = { ...card, image: m.url };
                            onChange({ items: newItems });
                          }}
                        />
                      </div>
                      <Input
                        placeholder="HTTPS://ASSET-NETWORK.COM..."
                        value={card.image || ""}
                        onChange={(e) => {
                          const newItems = [...item.items];
                          newItems[idx] = { ...card, image: e.target.value };
                          onChange({ items: newItems });
                        }}
                        className="h-10 bg-ink border-charcoal-light text-xs font-bold text-white rounded-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50 block">
                      Unit Intel Data
                    </label>
                    <div className="space-y-2">
                      {activeLanguages.map((lang) => (
                        <div key={lang.code} className="relative">
                          <span className="absolute left-2 top-2 text-[8px] font-black text-gold/30 uppercase">
                            {lang.code}
                          </span>
                          <Textarea
                            placeholder={`DATA BRIEF (${lang.name})...`}
                            value={getLocalizedValue(
                              card.description,
                              lang.code,
                            )}
                            onChange={(e) => {
                              const newItems = [...item.items];
                              newItems[idx] = {
                                ...card,
                                description: updateLocalizedValue(
                                  card.description,
                                  lang.code,
                                  e.target.value,
                                ),
                              };
                              onChange({ items: newItems });
                            }}
                            className="bg-ink border-charcoal-light text-[10px] text-white font-bold min-h-[60px] pl-8 pt-2"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full py-4 border-dashed border-charcoal-light bg-charcoal text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-gold hover:border-gold transition-all rounded-none gap-2"
                onClick={() => {
                  const newItems = [
                    ...(item.items || []),
                    {
                      title: "NEW UNIT",
                      description: "DATA PENDING...",
                      image: "",
                      link: "",
                    },
                  ];
                  onChange({ items: newItems });
                }}
              >
                + Deploy Unit Deployment Slot
              </Button>
            </div>
            ); case "list": return (
            {(item.items || []).map((li: any, idx: number) => (
              <div
                key={idx}
                className="bg-ink border border-charcoal-light p-3 space-y-3 relative"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <Activity size={12} className="text-gold" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                      Sub-Objective #{idx + 1}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-none transition-all"
                    onClick={() => {
                      const newItems = (item.items || []).filter(
                        (_: any, i: number) => i !== idx,
                      );
                      onChange({ items: newItems });
                    }}
                  >
                    <Trash size={12} />
                  </Button>
                </div>

                {activeLanguages.map((lang) => (
                  <div key={lang.code} className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-gold/30 uppercase">
                      {lang.code}
                    </span>
                    <Input
                      value={getLocalizedValue(li, lang.code)}
                      placeholder={`INTEL LINE (${lang.name})...`}
                      onChange={(e) => {
                        const newItems = [...(item.items || [])];
                        newItems[idx] = updateLocalizedValue(
                          li,
                          lang.code,
                          e.target.value,
                        );
                        onChange({ items: newItems });
                      }}
                      className="h-8 bg-charcoal/30 border-charcoal-light text-[10px] font-bold text-white rounded-none focus:border-gold transition-all uppercase tracking-widest pl-8"
                    />
                  </div>
                ))}
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
            <span className="text-[10px] font-black uppercase tracking-widest italic">
              UNIDENTIFIED MODULE TYPE: ACCESS PROTOCOL FAIL
            </span>
          </div>
        );
    }
  };

  const getIcon = () => {
    switch (item.type) {
      case "heading":
        return <Type size={18} />;
      case "paragraph":
        return <AlignLeft size={18} />;
      case "image":
        return <ImageIcon size={18} />;
      case "button":
        return <LinkIcon size={18} />;
      case "list":
        return <List size={18} />;
      case "section":
        return <Layers size={18} />;
      case "cta":
        return <Zap size={18} />;
      case "cards":
        return <CreditCard size={18} />;
      case "features":
        return <Zap size={18} />;
      case "testimonial":
        return <Quote size={18} />;
      case "carousel":
        return <GalleryHorizontal size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  if (item.type === "section") {
    return renderFields();
  }

  return (
    <div
      className={cn(
        "group relative bg-charcoal border-2 border-charcoal-light rounded-none p-4 transition-all hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5",
        !isExpanded && "p-2",
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-4 transition-all",
          isExpanded
            ? "mb-4 pb-2 border-b border-charcoal-light"
            : "mb-0 pb-0 border-b-0",
        )}
      >
        <div
          className="flex items-center gap-4 flex-1 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "transition-transform duration-200",
                isExpanded ? "rotate-0" : "-rotate-90",
              )}
            >
              <ChevronDown size={14} className="text-gold opacity-50" />
            </div>
            <div className="p-2 bg-ink border border-charcoal-light text-gold group-hover:border-gold transition-all">
              {getIcon()}
            </div>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white whitespace-nowrap">
                {item.type} Module
              </span>
              {!isExpanded && (
                <span className="text-[9px] font-black uppercase tracking-widest text-gold opacity-40 truncate">
                  // {getPreviewText()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 opacity-40">
              <Activity size={10} className="text-gold" />
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">
                {item.id}
              </span>
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

      {isExpanded && (
        <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
          {renderFields()}
          <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gold/10 group-hover:bg-gold/40 transition-colors" />
        </div>
      )}
    </div>
  );
};
