"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionBlock } from "./SectionBlock";
import {
  Save,
  PlusCircle,
  Settings,
  Layout,
  Eye,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Terminal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Page, PageBlock } from "@/lib/store/pages/pageType";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageEditorProps {
  initialData?: Page;
  onSave: (page: Page) => Promise<void>;
  isLoading?: boolean;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const router = useRouter();
  const [page, setPage] = useState<Page>(
    initialData || {
      title: "",
      slug: "",
      content: [],
      metaTitle: "",
      metaDescription: "",
      isPublished: false,
    },
  );

  const addSection = () => {
    const newSection: PageBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: "section",
      adminTitle: "NEW TACTICAL SECTION",
      content: [],
      layout: "grid-1",
      columns: [[]]
    };
    if (Array.isArray(page.content)) {
      setPage({ ...page, content: [...page.content, newSection] });
    }
  };

  const updateSection = (sectionId: string, updates: any) => {
    if (Array.isArray(page.content)) {
      setPage({
        ...page,
        content: page.content.map((sec: PageBlock) =>
          sec.id === sectionId ? { ...sec, ...updates } : sec,
        ),
      });
    }
  };

  const removeSection = (sectionId: string) => {
    if (Array.isArray(page.content)) {
      setPage({
        ...page,
        content: page.content.filter((sec: PageBlock) => sec.id !== sectionId),
      });
    }
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (Array.isArray(page.content)) {
      const newContent = [...page.content];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newContent.length) return;

      [newContent[index], newContent[targetIndex]] = [
        newContent[targetIndex],
        newContent[index],
      ];
      setPage({ ...page, content: newContent });
    }
  };

  const handleSave = async () => {
    if (!page.title || !page.slug) {
      toast.error("ERROR: Objective title and network slug mandatory.");
      return;
    }
    await onSave(page);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      {/* Tactical Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-charcoal pb-8">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 bg-charcoal border border-charcoal-light text-slate-400 hover:text-gold hover:border-gold transition-all rounded-none"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <ShieldCheck className="text-gold" size={18} />
               <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em]">
                 {initialData ? "Refine" : "Forge"} <span className="text-gold">Objective</span>
               </h1>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
               Content Deployment Protocol X-104
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-6 md:mt-0">
          <div className="flex items-center gap-3 bg-charcoal p-1 px-4 border border-charcoal-light">
            <Label
              htmlFor="publish-toggle"
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer"
            >
              {page.isPublished ? "Active Deployment" : "Internal Draft"}
            </Label>
            <Switch
              id="publish-toggle"
              checked={page.isPublished}
              onCheckedChange={(val: boolean) =>
                setPage({ ...page, isPublished: val })
              }
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
          
          <Button
            variant="outline"
            className="bg-charcoal border-charcoal-light text-slate-400 hover:text-white hover:border-white transition-all px-6 py-6 rounded-none font-black uppercase tracking-widest text-xs gap-2"
            disabled={isLoading}
          >
            <Eye className="h-4 w-4 text-gold" /> Simulation
          </Button>
          
          <Button
            className="bg-olive text-white hover:bg-olive-light gap-2 px-8 py-6 rounded-none font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-olive/10 transition-all border-b-2 border-charcoal"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {initialData ? "Commit Updates" : "Initiate Forge"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="flex gap-2 mb-10 bg-transparent h-auto p-0">
          <TabsTrigger
            value="content"
            className="px-8 py-3 rounded-none border border-charcoal-light bg-charcoal text-slate-500 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-gold data-[state=active]:text-ink data-[state=active]:border-gold transition-all flex gap-2"
          >
            <Layout size={14} /> Intelligence Layout
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="px-8 py-3 rounded-none border border-charcoal-light bg-charcoal text-slate-500 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-gold data-[state=active]:text-ink data-[state=active]:border-gold transition-all flex gap-2"
          >
            <Settings size={14} /> Tactical SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-10 outline-none">
          <div className="bg-charcoal border border-charcoal-light p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Terminal size={120} />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-3 block">
                    Objective Identifier (Title)
                  </Label>
                  <Input
                    placeholder="e.g. OPERATIONS COMMAND"
                    value={page.title}
                    onChange={(e) =>
                      setPage({ ...page, title: e.target.value })
                    }
                    className="h-14 bg-ink border-charcoal-light rounded-none text-white font-black uppercase tracking-widest focus:border-gold transition-all"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-3 block">
                    Network Slug Path
                  </Label>
                  <div className="flex items-center">
                    <span className="bg-ink border border-r-0 border-charcoal-light h-14 px-5 flex items-center text-slate-500 text-xs font-black">
                      /
                    </span>
                    <Input
                      placeholder="operations-command"
                      value={page.slug}
                      onChange={(e) =>
                        setPage({
                          ...page,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/ /g, "-"),
                        })
                      }
                      className="h-14 bg-ink border-charcoal-light rounded-none text-white font-bold focus:border-gold transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-charcoal-light pb-4">
              <div className="flex items-center gap-3">
                 <Zap className="text-gold" size={16} />
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                   Page Architecture Blocks
                 </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addSection}
                className="bg-charcoal border-charcoal-light text-gold hover:bg-gold hover:text-ink transition-all rounded-none font-black uppercase tracking-widest text-[10px] h-10 px-6"
              >
                <PlusCircle size={14} className="mr-2" /> Insert Component
              </Button>
            </div>

            {Array.isArray(page.content) && page.content.length === 0 ? (
              <div className="h-80 border-2 border-dashed border-charcoal-light bg-charcoal/30 flex flex-col items-center justify-center text-slate-600 gap-6">
                <Layout size={64} className="opacity-10" />
                <div className="text-center">
                   <p className="text-xs font-black uppercase tracking-[0.3em] mb-2">Interface Workspace Vacant</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Initiate architecture sequence to begin forge.</p>
                </div>
                <Button
                  variant="outline"
                  className="bg-ink border-charcoal-light text-gold hover:border-gold rounded-none font-black uppercase tracking-widest text-[10px] px-8 py-5"
                  onClick={addSection}
                >
                  Initiate First Sector
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-10">
                {Array.isArray(page.content) && page.content.map((section: PageBlock, idx: number) => (
                  <SectionBlock
                    key={section.id}
                    section={section}
                    onUpdate={(updates: any) =>
                      updateSection(section.id, updates)
                    }
                    onRemove={() => removeSection(section.id)}
                    onMoveUp={() => moveSection(idx, "up")}
                    onMoveDown={() => moveSection(idx, "down")}
                    isFirst={idx === 0}
                    isLast={idx === page.content.length - 1}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-charcoal-dark border border-charcoal-light p-10 flex flex-col md:flex-row items-center gap-10 opacity-80">
            <div className="flex-1 space-y-4">
               <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gold border-b border-charcoal-light pb-2 inline-block">
                 Operational Intelligence
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                    <span className="text-2xl font-black text-slate-800">01</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-relaxed">
                       Deploy **Sectors** to establish core layout hierarchy.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-2xl font-black text-slate-800">02</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-relaxed">
                       Insert **Tactical Assets** (Text, Imagery) within sector grids.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-10 outline-none">
          <div className="max-w-3xl bg-charcoal border border-charcoal-light p-10 shadow-2xl space-y-8">
            <div className="flex items-center gap-3 border-b border-charcoal-light pb-4">
               <ShieldCheck className="text-gold" size={18} />
               <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                 Search Engine <span className="text-gold">Cloaking</span> (SEO)
               </h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-3 block">
                  CRAWLER TITLE IDENTIFIER
                </Label>
                <Input
                  placeholder="Objective designation for web crawlers"
                  value={page.metaTitle}
                  onChange={(e) =>
                    setPage({ ...page, metaTitle: e.target.value })
                  }
                  className="bg-ink border-charcoal-light rounded-none text-white font-bold focus:border-gold h-12"
                />
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-3 block">
                  MISSION BRIEF (META DESCRIPTION)
                </Label>
                <Textarea
                  placeholder="Operational summary for network indexing"
                  value={page.metaDescription}
                  onChange={(e) =>
                    setPage({ ...page, metaDescription: e.target.value })
                  }
                  className="bg-ink border-charcoal-light rounded-none text-white font-bold focus:border-gold min-h-[150px] p-4"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
