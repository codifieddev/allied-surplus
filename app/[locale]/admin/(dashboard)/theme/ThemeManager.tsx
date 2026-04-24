// "use client";

// import React, { useState, useEffect } from "react";
// import { Palette, Type, Upload, Plus, X, Save, RefreshCcw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
// import { fetchThemeThunk, saveThemeThunk } from "@/lib/store/theme/themeThunks";
// import { updateThemeState } from "@/lib/store/theme/themeSlice";
// import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
// import { cn } from "@/lib/utils";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectSeparator,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function ThemeManager() {
//   const dispatch = useAppDispatch();
//   const {
//     config: themeConfig,
//     isLoading: loading,
//     id,
//   } = useAppSelector((state) => state.theme);

//   const saveConfiguration = async () => {
//     if (themeConfig) {
//       dispatch(saveThemeThunk({ id: id, config: themeConfig }));
//     }
//   };

//   const [activeTab, setActiveTab] = useState<"colors" | "typography">("colors");

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-ink text-white p-6 flex items-center justify-center">
//         <p className="text-gold font-bold tracking-widest text-sm uppercase animate-pulse">
//           Initializing Theme Core...
//         </p>
//       </div>
//     );
//   }

//   const updateColor = (group: string, field: string, value: string) => {
//     if (!themeConfig) return;
//     if (group === "buttons") {
//       dispatch(
//         updateThemeState({
//           colors: {
//             ...themeConfig.colors,
//             buttons: {
//               ...themeConfig.colors.buttons,
//               [field]: value,
//             },
//           },
//         }),
//       );
//     } else {
//       dispatch(
//         updateThemeState({
//           colors: {
//             ...themeConfig.colors,
//             [field]: value,
//           },
//         }),
//       );
//     }
//   };

//   const updateTypography = (field: string, value: any) => {
//     if (!themeConfig) return;
//     dispatch(
//       updateThemeState({
//         typography: {
//           ...themeConfig.typography,
//           [field]: value,
//         },
//       }),
//     );
//   };

//   const addCustomFont = (media: any) => {
//     if (!themeConfig) return;
//     const newFont = {
//       id: Date.now().toString(),
//       name:
//         media.name || media.url.split("/").pop()?.split(".")[0] || "New Font",
//       url: media.url,
//       weight: "400",
//       style: "normal",
//     };
//     updateTypography("customFonts", [
//       ...themeConfig.typography.customFonts,
//       newFont,
//     ]);
//   };

//   const removeCustomFont = (id: string) => {
//     if (!themeConfig) return;
//     updateTypography(
//       "customFonts",
//       themeConfig.typography.customFonts.filter((f) => f.id !== id),
//     );
//   };

//   return (
//     <div className="min-h-screen bg-ink text-white">
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Header */}
//         <div className="mb-10 border-b border-white/5 pb-8 flex items-center justify-between">
//           <div>
//             <h1 className="text-4xl font-head font-black tracking-tighter text-white uppercase italic">
//               Theme <span className="text-gold">Command Center</span>
//             </h1>
//             <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">
//               Aesthetic Protocol • CSS Variable Matrix • Visual Identity
//             </p>
//           </div>
//           <Button
//             onClick={saveConfiguration}
//             className="h-14 px-8 bg-olive border-b-4 border-black/30 hover:translate-y-px hover:border-b-2 transition-all shadow-2xl ring-1 ring-gold/20"
//           >
//             <Save className="mr-3 h-5 w-5" />
//             <span className="font-head font-black tracking-widest uppercase italic">
//               Deploy Aesthetics
//             </span>
//           </Button>
//         </div>

//         <div className="grid grid-cols-12 gap-8">
//           {/* Left Sidebar Tabs */}
//           <div className="col-span-3 space-y-2">
//             <button
//               onClick={() => setActiveTab("colors")}
//               className={cn(
//                 "w-full h-16 flex items-center gap-4 px-6 rounded-sm border transition-all uppercase font-black tracking-widest italic text-[11px] text-left",
//                 activeTab === "colors"
//                   ? "bg-olive/10 border-gold/50 text-gold shadow-[0_0_20px_rgba(201,162,39,0.15)]"
//                   : "bg-charcoal/40 border-white/5 text-white/40 hover:text-white hover:bg-white/5",
//               )}
//             >
//               <Palette size={18} />
//               Chromatic Palette
//             </button>
//             <button
//               onClick={() => setActiveTab("typography")}
//               className={cn(
//                 "w-full h-16 flex items-center gap-4 px-6 rounded-sm border transition-all uppercase font-black tracking-widest italic text-[11px] text-left",
//                 activeTab === "typography"
//                   ? "bg-olive/10 border-gold/50 text-gold shadow-[0_0_20px_rgba(201,162,39,0.15)]"
//                   : "bg-charcoal/40 border-white/5 text-white/40 hover:text-white hover:bg-white/5",
//               )}
//             >
//               <Type size={18} />
//               Typography Engine
//             </button>

//             {/* Preview Box - Realtime */}
//             <div className="mt-12 p-6 rounded-sm border border-white/5 bg-charcoal/20 relative overflow-hidden group">
//               <div className="absolute top-0 right-0 p-2 opacity-20">
//                 <Palette size={40} />
//               </div>
//               <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-4">
//                 Live Preview Alpha
//               </h4>
//               <div className="space-y-4">
//                 <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
//                   <div
//                     className="h-full transition-all duration-500"
//                     style={{
//                       width: "65%",
//                       backgroundColor: themeConfig?.colors.primary,
//                     }}
//                   />
//                 </div>
//                 <button
//                   className="w-full py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all"
//                   style={{
//                     backgroundColor: themeConfig?.colors.buttons.primary,
//                     color: themeConfig?.colors.buttons.primaryText,
//                     border: `1px solid ${themeConfig?.colors.accent}44`,
//                   }}
//                 >
//                   Primary Action
//                 </button>
//                 <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
//                   <div
//                     className="h-full transition-all duration-500"
//                     style={{
//                       width: "40%",
//                       backgroundColor: themeConfig?.colors.secondary,
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Panel */}
//           <div className="col-span-9 bg-charcoal/30 border border-white/5 rounded-sm p-8 shadow-inner">
//             {activeTab === "colors" && (
//               <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 <div>
//                   <h3 className="text-lg font-head font-black tracking-widest text-gold uppercase italic mb-6 flex items-center gap-3">
//                     <div className="h-px w-8 bg-gold/30" /> Core System Colors
//                   </h3>
//                   <div className="grid grid-cols-2 gap-8">
//                     <ColorInput
//                       label="Primary Accent"
//                       value={themeConfig?.colors.primary || "#ffffff"}
//                       onChange={(val) => updateColor("core", "primary", val)}
//                     />
//                     <ColorInput
//                       label="Secondary Support"
//                       value={themeConfig?.colors.secondary || "#71717a"}
//                       onChange={(val) => updateColor("core", "secondary", val)}
//                     />
//                     <ColorInput
//                       label="Strategic Accent"
//                       value={themeConfig?.colors.accent || "#c9a227"}
//                       onChange={(val) => updateColor("core", "accent", val)}
//                     />
//                     <ColorInput
//                       label="Void Background"
//                       value={themeConfig?.colors.background || "#0a0a0a"}
//                       onChange={(val) => updateColor("core", "background", val)}
//                     />
//                     <ColorInput
//                       label="Surface Layer"
//                       value={themeConfig?.colors.surface || "#1a1a1a"}
//                       onChange={(val) => updateColor("core", "surface", val)}
//                     />
//                     <ColorInput
//                       label="Readout Text"
//                       value={themeConfig?.colors.text || "#ffffff"}
//                       onChange={(val) => updateColor("core", "text", val)}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-head font-black tracking-widest text-gold uppercase italic mb-6 flex items-center gap-3">
//                     <div className="h-px w-8 bg-gold/30" /> Tactical Button
//                     Styles
//                   </h3>
//                   <div className="grid grid-cols-2 gap-8">
//                     <ColorInput
//                       label="Btn: Primary Background"
//                       value={themeConfig?.colors.buttons.primary || "#616c35"}
//                       onChange={(val) => updateColor("buttons", "primary", val)}
//                     />
//                     <ColorInput
//                       label="Btn: Primary Text"
//                       value={
//                         themeConfig?.colors.buttons.primaryText || "#ffffff"
//                       }
//                       onChange={(val) =>
//                         updateColor("buttons", "primaryText", val)
//                       }
//                     />
//                     <ColorInput
//                       label="Btn: Secondary Background"
//                       value={themeConfig?.colors.buttons.secondary || "#1a1a1a"}
//                       onChange={(val) =>
//                         updateColor("buttons", "secondary", val)
//                       }
//                     />
//                     <ColorInput
//                       label="Btn: Secondary Text"
//                       value={
//                         themeConfig?.colors.buttons.secondaryText || "#ffffff"
//                       }
//                       onChange={(val) =>
//                         updateColor("buttons", "secondaryText", val)
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "typography" && (
//               <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
//                 <div>
//                   <h3 className="text-lg font-head font-black tracking-widest text-gold uppercase italic mb-6 flex items-center gap-3">
//                     <div className="h-px w-8 bg-gold/30" /> Typeface Matrix
//                   </h3>
//                   <div className="grid grid-cols-2 gap-8">
//                     <FontSelector
//                       label="Primary Body Font"
//                       value={themeConfig?.typography.bodyFont || "Barlow"}
//                       customFonts={themeConfig?.typography.customFonts || []}
//                       onChange={(val) => updateTypography("bodyFont", val)}
//                     />
//                     <FontSelector
//                       label="Tactical Heading Font"
//                       value={
//                         themeConfig?.typography.headingFont ||
//                         "Barlow Condensed"
//                       }
//                       customFonts={themeConfig?.typography.customFonts || []}
//                       onChange={(val) => updateTypography("headingFont", val)}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-lg font-head font-black tracking-widest text-gold uppercase italic flex items-center gap-3">
//                       <div className="h-px w-8 bg-gold/30" /> Custom Font Assets
//                     </h3>
//                     <MediaLibraryModal
//                       onSelect={addCustomFont}
//                       trigger={
//                         <Button
//                           variant="outline"
//                           className="h-10 bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2"
//                         >
//                           <Upload size={14} /> Upload Font
//                         </Button>
//                       }
//                     />
//                   </div>

//                   <div className="space-y-3">
//                     {themeConfig?.typography.customFonts.length === 0 ? (
//                       <div className="py-12 border border-dashed border-white/5 bg-white/2 rounded flex flex-col items-center justify-center text-white/20">
//                         <p className="text-[10px] font-black uppercase tracking-[.4em]">
//                           No Custom Assets Detected
//                         </p>
//                       </div>
//                     ) : (
//                       themeConfig?.typography.customFonts.map((font) => (
//                         <div
//                           key={font.id}
//                           className="flex items-center justify-between p-4 bg-ink/50 border border-white/5 group"
//                         >
//                           <div className="flex items-center gap-4">
//                             <div className="h-10 w-10 flex items-center justify-center bg-gold/10 rounded-sm border border-gold/20 text-gold">
//                               <Type size={18} />
//                             </div>
//                             <div>
//                               <h5 className="text-[13px] font-bold text-white uppercase italic">
//                                 {font.name}
//                               </h5>
//                               <p className="text-[9px] text-white/30 font-medium truncate max-w-[200px]">
//                                 {font.url}
//                               </p>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => removeCustomFont(font.id)}
//                             className="p-2 text-white/20 hover:text-red hover:bg-red/10 transition-all opacity-0 group-hover:opacity-100"
//                           >
//                             <X size={16} />
//                           </button>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function FontSelector({
//   label,
//   value,
//   customFonts,
//   onChange,
// }: {
//   label: string;
//   value: string;
//   customFonts: any[];
//   onChange: (v: string) => void;
// }) {
//   const staticFonts = [
//     { name: "Sans-serif", value: "sans-serif" },
//     { name: "Serif", value: "serif" },
//     { name: "Monospace", value: "monospace" },
//     { name: "Barlow", value: "Barlow" },
//     { name: "Barlow Condensed", value: "Barlow Condensed" },
//   ];

//   return (
//     <div className="space-y-2 group">
//       <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">
//         {label}
//       </label>
//       <Select value={value} onValueChange={onChange}>
//         <SelectTrigger className="h-12 bg-ink/50 border-white/10 text-white font-medium focus:border-gold transition-all w-full flex items-center justify-between px-4 rounded-sm">
//           <SelectValue placeholder={`Select ${label}`} />
//         </SelectTrigger>
//         <SelectContent className="bg-charcoal border-white/10 text-white">
//           <SelectGroup>
//             <SelectLabel className="text-gold/50 text-[9px] uppercase tracking-widest">
//               Static Foundations
//             </SelectLabel>
//             {staticFonts.map((font) => (
//               <SelectItem
//                 key={font.value}
//                 value={font.value}
//                 className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
//               >
//                 {font.name}
//               </SelectItem>
//             ))}
//           </SelectGroup>
//           {customFonts.length > 0 && (
//             <>
//               <SelectSeparator className="bg-white/5" />
//               <SelectGroup>
//                 <SelectLabel className="text-gold/50 text-[9px] uppercase tracking-widest">
//                   Custom Tactical Assets
//                 </SelectLabel>
//                 {customFonts.map((font) => (
//                   <SelectItem
//                     key={font.id}
//                     value={font.name}
//                     className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
//                   >
//                     {font.name}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </>
//           )}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

// function ColorInput({
//   label,
//   value,
//   onChange,
// }: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div className="space-y-2 group">
//       <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">
//         {label}
//       </label>
//       <div className="relative flex items-center">
//         <input
//           type="color"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="absolute inset-y-0 left-0 w-12 h-full opacity-0 cursor-pointer z-10"
//         />
//         <div
//           className="w-12 h-12 rounded-l-sm border border-white/10 ring-1 ring-black/20"
//           style={{ backgroundColor: value }}
//         />
//         <Input
//           value={value.toUpperCase()}
//           onChange={(e) => onChange(e.target.value)}
//           className="h-12 rounded-l-none bg-ink/50 border-white/10 border-l-0 text-white font-mono uppercase focus:border-gold transition-all"
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { Palette, Type, Upload, Plus, X, Save, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBusinessBlueprint } from "@/lib/store/businessBlueprints/businessBlueprintsThunk";
import {
  addCustomFont,
  removeCustomFont,
  setActiveThemeMode,
  updateButtonColors,
  updateThemeColors,
  updateTypography,
} from "@/lib/store/businessBlueprints/businessBlueprintSlice";

export default function ThemeManager() {
  const dispatch = useAppDispatch();
  const {
    businessBlueprint,
    isLoading: loading,
    activeThemeMode,
  } = useAppSelector((state) => state.businessBlueprint);

  const [activeTab, setActiveTab] = useState<"colors" | "typography">("colors");

  const saveConfiguration = async () => {
    if (businessBlueprint) {
      const res = await dispatch(
        updateBusinessBlueprint(businessBlueprint.payload),
      );
    }
  };

  // Get the current theme based on active mode
  const currentTheme =
    businessBlueprint?.payload[
      activeThemeMode === "admin" ? "admin_theme" : "public_theme"
    ];

  if (loading) {
    return (
      <div className="min-h-screen bg-ink text-white p-6 flex items-center justify-center">
        <p className="text-gold font-bold tracking-widest text-sm uppercase animate-pulse">
          Initializing Theme Core...
        </p>
      </div>
    );
  }

  const updateColor = (group: string, field: string, value: string) => {
    if (!currentTheme) return;

    if (group === "buttons") {
      dispatch(
        updateButtonColors({
          mode: activeThemeMode,
          buttonColors: {
            [field]: value,
          },
        }),
      );
    } else {
      dispatch(
        updateThemeColors({
          mode: activeThemeMode,
          colors: {
            [field]: value,
          } as any,
        }),
      );
    }
  };

  const updateTypographyField = (field: string, value: any) => {
    if (!currentTheme) return;

    dispatch(
      updateTypography({
        mode: activeThemeMode,
        typography: {
          [field]: value,
        } as any,
      }),
    );
  };

  const handleAddCustomFont = (media: any) => {
    if (!currentTheme) return;

    const newFont = {
      id: Date.now().toString(),
      name:
        media.name || media.url.split("/").pop()?.split(".")[0] || "New Font",
      url: media.url,
      weight: "400",
      style: "normal",
    };

    dispatch(
      addCustomFont({
        mode: activeThemeMode,
        font: newFont,
      }),
    );
  };

  const handleRemoveCustomFont = (id: string) => {
    if (!currentTheme) return;

    dispatch(
      removeCustomFont({
        mode: activeThemeMode,
        fontId: id,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-10 border-b border-white/5 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-head font-black tracking-tighter text-white uppercase italic">
                Theme <span className="text-gold">Command Center</span>
              </h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">
                Aesthetic Protocol • CSS Variable Matrix • Visual Identity
              </p>
            </div>
            <Button
              onClick={saveConfiguration}
              className="h-14 px-8 bg-olive border-b-4 border-black/30 hover:translate-y-px hover:border-b-2 transition-all shadow-2xl ring-1 ring-gold/20"
            >
              <Save className="mr-3 h-5 w-5" />
              <span className="font-head font-black tracking-widest uppercase italic">
                Deploy Aesthetics
              </span>
            </Button>
          </div>

          {/* NEW: Theme Mode Switcher */}
          <div className="flex items-center gap-2 p-1 bg-charcoal/50 border border-white/10 rounded-sm w-fit">
            <button
              onClick={() => dispatch(setActiveThemeMode("admin"))}
              className={cn(
                "px-6 py-3 text-[11px] font-black uppercase tracking-widest italic transition-all rounded-sm",
                activeThemeMode === "admin"
                  ? "bg-olive text-white shadow-lg"
                  : "text-white/40 hover:text-white hover:bg-white/5",
              )}
            >
              Admin Theme
            </button>
            <button
              onClick={() => dispatch(setActiveThemeMode("public"))}
              className={cn(
                "px-6 py-3 text-[11px] font-black uppercase tracking-widest italic transition-all rounded-sm",
                activeThemeMode === "public"
                  ? "bg-olive text-white shadow-lg"
                  : "text-white/40 hover:text-white hover:bg-white/5",
              )}
            >
              Public Theme
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar Tabs */}
          <div className="col-span-3 space-y-2">
            <button
              onClick={() => setActiveTab("colors")}
              className={cn(
                "w-full h-16 flex items-center gap-4 px-6 rounded-sm border transition-all uppercase font-black tracking-widest italic text-[11px] text-left",
                activeTab === "colors"
                  ? "bg-olive/10 border-gold/50 text-gold shadow-[0_0_20px_rgba(201,162,39,0.15)]"
                  : "bg-charcoal/40 border-white/5 text-white/40 hover:text-white hover:bg-white/5",
              )}
            >
              <Palette size={18} />
              Chromatic Palette
            </button>
            <button
              onClick={() => setActiveTab("typography")}
              className={cn(
                "w-full h-16 flex items-center gap-4 px-6 rounded-sm border transition-all uppercase font-black tracking-widest italic text-[11px] text-left",
                activeTab === "typography"
                  ? "bg-olive/10 border-gold/50 text-gold shadow-[0_0_20px_rgba(201,162,39,0.15)]"
                  : "bg-charcoal/40 border-white/5 text-white/40 hover:text-white hover:bg-white/5",
              )}
            >
              <Type size={18} />
              Typography Engine
            </button>

            {/* Preview Box - Realtime */}
            <div className="mt-12 p-6 rounded-sm border border-white/5 bg-charcoal/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <Palette size={40} />
              </div>
              <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-4">
                Live Preview •{" "}
                {activeThemeMode === "admin" ? "Admin" : "Public"}
              </h4>
              <div className="space-y-4">
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: "65%",
                      backgroundColor: currentTheme?.colors.primary,
                    }}
                  />
                </div>
                <button
                  className="w-full py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all"
                  style={{
                    backgroundColor: currentTheme?.colors.buttons.primary,
                    color: currentTheme?.colors.buttons.primaryText,
                    border: `1px solid ${currentTheme?.colors.accent}44`,
                  }}
                >
                  Primary Action
                </button>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: "40%",
                      backgroundColor: currentTheme?.colors.secondary,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="col-span-9 bg-charcoal/30 border border-white/5 rounded-sm p-8 shadow-inner">
            {activeTab === "colors" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h3 className="text-lg font-head font-black tracking-widest text-gold uppercase italic mb-6 flex items-center gap-3">
                    <div className="h-px w-8 bg-gold/30" /> Core System Colors
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    <ColorInput
                      label="Primary Accent"
                      value={currentTheme?.colors.primary || "#ffffff"}
                      onChange={(val) => updateColor("core", "primary", val)}
                    />
                    <ColorInput
                      label="Secondary Support"
                      value={currentTheme?.colors.secondary || "#71717a"}
                      onChange={(val) => updateColor("core", "secondary", val)}
                    />
                    <ColorInput
                      label="Strategic Accent"
                      value={currentTheme?.colors.accent || "#c9a227"}
                      onChange={(val) => updateColor("core", "accent", val)}
                    />
                    <ColorInput
                      label="Void Background"
                      value={currentTheme?.colors.background || "#0a0a0a"}
                      onChange={(val) => updateColor("core", "background", val)}
                    />
                    <ColorInput
                      label="Surface Layer"
                      value={currentTheme?.colors.surface || "#1a1a1a"}
                      onChange={(val) => updateColor("core", "surface", val)}
                    />
                    <ColorInput
                      label="Readout Text"
                      value={currentTheme?.colors.text || "#ffffff"}
                      onChange={(val) => updateColor("core", "text", val)}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-head font-black tracking-widest text-gold uppercase italic mb-6 flex items-center gap-3">
                    <div className="h-px w-8 bg-gold/30" /> Tactical Button
                    Styles
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    <ColorInput
                      label="Btn: Primary Background"
                      value={currentTheme?.colors.buttons.primary || "#616c35"}
                      onChange={(val) => updateColor("buttons", "primary", val)}
                    />
                    <ColorInput
                      label="Btn: Primary Text"
                      value={
                        currentTheme?.colors.buttons.primaryText || "#ffffff"
                      }
                      onChange={(val) =>
                        updateColor("buttons", "primaryText", val)
                      }
                    />
                    <ColorInput
                      label="Btn: Secondary Background"
                      value={
                        currentTheme?.colors.buttons.secondary || "#1a1a1a"
                      }
                      onChange={(val) =>
                        updateColor("buttons", "secondary", val)
                      }
                    />
                    <ColorInput
                      label="Btn: Secondary Text"
                      value={
                        currentTheme?.colors.buttons.secondaryText || "#ffffff"
                      }
                      onChange={(val) =>
                        updateColor("buttons", "secondaryText", val)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h3 className="text-lg font-head font-black tracking-widest text-gold uppercase italic mb-6 flex items-center gap-3">
                    <div className="h-px w-8 bg-gold/30" /> Typeface Matrix
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    <FontSelector
                      label="Primary Body Font"
                      value={currentTheme?.typography.bodyFont || "Barlow"}
                      customFonts={currentTheme?.typography.customFonts || []}
                      onChange={(val) => updateTypographyField("bodyFont", val)}
                    />
                    <FontSelector
                      label="Tactical Heading Font"
                      value={
                        currentTheme?.typography.headingFont ||
                        "Barlow Condensed"
                      }
                      customFonts={currentTheme?.typography.customFonts || []}
                      onChange={(val) =>
                        updateTypographyField("headingFont", val)
                      }
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-head font-black tracking-widest text-gold uppercase italic flex items-center gap-3">
                      <div className="h-px w-8 bg-gold/30" /> Custom Font Assets
                    </h3>
                    <MediaLibraryModal
                      onSelect={handleAddCustomFont}
                      trigger={
                        <Button
                          variant="outline"
                          className="h-10 bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2"
                        >
                          <Upload size={14} /> Upload Font
                        </Button>
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    {currentTheme?.typography.customFonts.length === 0 ? (
                      <div className="py-12 border border-dashed border-white/5 bg-white/2 rounded flex flex-col items-center justify-center text-white/20">
                        <p className="text-[10px] font-black uppercase tracking-[.4em]">
                          No Custom Assets Detected
                        </p>
                      </div>
                    ) : (
                      currentTheme?.typography.customFonts.map((font) => (
                        <div
                          key={font.id}
                          className="flex items-center justify-between p-4 bg-ink/50 border border-white/5 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center bg-gold/10 rounded-sm border border-gold/20 text-gold">
                              <Type size={18} />
                            </div>
                            <div>
                              <h5 className="text-[13px] font-bold text-white uppercase italic">
                                {font.name}
                              </h5>
                              <p className="text-[9px] text-white/30 font-medium truncate max-w-[200px]">
                                {font.url}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveCustomFont(font.id)}
                            className="p-2 text-white/20 hover:text-red hover:bg-red/10 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FontSelector({
  label,
  value,
  customFonts,
  onChange,
}: {
  label: string;
  value: string;
  customFonts: any[];
  onChange: (v: string) => void;
}) {
  const staticFonts = [
    { name: "Sans-serif", value: "sans-serif" },
    { name: "Serif", value: "serif" },
    { name: "Monospace", value: "monospace" },
    { name: "Barlow", value: "Barlow" },
    { name: "Barlow Condensed", value: "Barlow Condensed" },
  ];

  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 bg-ink/50 border-white/10 text-white font-medium focus:border-gold transition-all w-full flex items-center justify-between px-4 rounded-sm">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-charcoal border-white/10 text-white">
          <SelectGroup>
            <SelectLabel className="text-gold/50 text-[9px] uppercase tracking-widest">
              Static Foundations
            </SelectLabel>
            {staticFonts.map((font) => (
              <SelectItem
                key={font.value}
                value={font.value}
                className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
              >
                {font.name}
              </SelectItem>
            ))}
          </SelectGroup>
          {customFonts.length > 0 && (
            <>
              <SelectSeparator className="bg-white/5" />
              <SelectGroup>
                <SelectLabel className="text-gold/50 text-[9px] uppercase tracking-widest">
                  Custom Tactical Assets
                </SelectLabel>
                {customFonts.map((font) => (
                  <SelectItem
                    key={font.id}
                    value={font.name}
                    className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                  >
                    {font.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-y-0 left-0 w-12 h-full opacity-0 cursor-pointer z-10"
        />
        <div
          className="w-12 h-12 rounded-l-sm border border-white/10 ring-1 ring-black/20"
          style={{ backgroundColor: value }}
        />
        <Input
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 rounded-l-none bg-ink/50 border-white/10 border-l-0 text-white font-mono uppercase focus:border-gold transition-all"
        />
      </div>
    </div>
  );
}
