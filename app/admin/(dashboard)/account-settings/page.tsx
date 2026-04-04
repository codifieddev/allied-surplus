"use client";

import { useState, useRef } from "react";
import {
  User,
  Mail,
  Lock,
  Shield,
  Bell,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  Image as ImageIcon,
  Upload,
  Target,
  Zap,
  Cpu,
  ShieldCheck,
  Terminal,
  Activity,
  UserCheck,
  Phone,
  Settings,
  History,
  Radio,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

export default function AccountSettingsPage() {
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  const [logoPreview, setLogoPreview] = useState<string | null>("/assets/Image/logo.png");
  const [faviconPreview, setFaviconPreview] = useState<string | null>("/assets/Image/favicon.svg");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFaviconPreview(URL.createObjectURL(file));
  };

  const [profile, setProfile] = useState({
    name: "Admin Commander",
    email: "admin@ironforge.com",
    role: "Delta-1 Superuser",
    phone: "+1 623 435-2640",
    bio: "Primary overseer of the Tactical Surplus network nodes.",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new_: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    orders: true,
    products: true,
    system: true,
    marketing: false,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    showToast("Profile intel updated successfully!");
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new_ || !passwords.confirm) {
      showToast("Fill in all credential fields.");
      return;
    }
    if (passwords.new_ !== passwords.confirm) {
      showToast("Access keys do not match.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setPasswords({ current: "", new_: "", confirm: "" });
    showToast("Security keys rotated successfully!");
    setSaving(false);
  };

  const handleSaveAssets = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    showToast("Brand visual assets synchronized.");
    setSaving(false);
  };

  const inputClass =
    "w-full bg-ink border border-white/10 rounded-sm px-6 py-3 text-sm font-bold text-white placeholder:text-white/20 focus:border-gold outline-none transition-all shadow-inner uppercase tracking-wider";

  const labelClass = "block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2 italic ml-1";

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-8 top-8 z-[2000] flex items-center gap-3 rounded-sm bg-olive px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-black ring-1 ring-gold/20 italic"
          >
            <ShieldCheck size={18} className="text-gold" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO HEADER ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-sm border border-white/5 bg-charcoal shadow-2xl shadow-black/60 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 -rotate-45 translate-x-32 -translate-y-32 transition-transform group-hover:scale-110 duration-1000" />
        
        <div className="relative px-10 py-10 flex flex-col lg:flex-row items-start lg:items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-sm border border-olive/30 bg-ink shadow-2xl shadow-black/40 p-3 ring-1 ring-gold/10">
                <img
                  src={logoPreview || "/assets/Image/favicon.svg"}
                  alt="Identity"
                  className="h-full w-full object-contain grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 bg-olive text-white shadow-2xl hover:bg-olive-lt transition-all active:scale-90 ring-1 ring-gold/20">
                <Camera size={16} />
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-head font-black uppercase tracking-tighter text-white leading-none italic">
                  IronForge <span className="text-gold/80 animate-pulse">Alpha</span>
                </span>
                <span className="rounded-sm bg-gold/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-gold border border-gold/20">
                  Primary-01
                </span>
              </div>
              <p className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase italic">
                Tactical Administrative Terminal
              </p>
            </div>
          </div>

          <div className="hidden lg:block w-px h-16 bg-white/5 mx-4" />

          <div className="flex-1 flex flex-col gap-2">
            <p className="text-2xl font-head font-black text-white uppercase tracking-tight italic leading-none group-hover:text-gold transition-colors">{profile.name}</p>
            <p className="text-[11px] font-bold text-white/40 tracking-widest uppercase italic">{profile.email}</p>
            <div className="flex items-center gap-3 mt-1">
               <span className="inline-flex items-center gap-2 rounded-sm bg-olive/10 border border-olive/30 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-gold italic shadow-inner">
                 <ShieldCheck size={12} />
                 Authorization: {profile.role}
               </span>
               <span className="inline-flex items-center gap-2 rounded-sm bg-ink border border-white/10 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">
                 <History size={12} />
                 ID: {Math.floor(Math.random()*9999)}
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* ── LEFT COLUMN ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-10">

          {/* Profile Info */}
          <section className="rounded-sm border border-white/5 bg-charcoal shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 bg-ink/40 px-8 py-5">
              <div className="flex items-center gap-4">
                 <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-olive/10 border border-olive/30 text-gold shadow-inner ring-1 ring-gold/5">
                   <User size={18} />
                 </div>
                 <div>
                   <h2 className="font-head font-black text-sm uppercase tracking-widest text-white italic">Identity Manifest</h2>
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Update administrator field details</p>
                 </div>
              </div>
              <UserCheck size={18} className="text-gold/20" />
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className={labelClass}>Callsign / Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className={inputClass}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Comms Relay (Phone)</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className={inputClass}
                    placeholder="+1 623 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Network Intelligence (Email)</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className={`${inputClass} pl-14`}
                    placeholder="admin@ironforge.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Mission Profile (Bio)</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  className={`${inputClass} resize-none h-40 italic`}
                  placeholder="Operational profile details..."
                />
              </div>
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-3 rounded-sm bg-olive px-10 py-4 text-xs font-head font-bold uppercase tracking-widest text-white hover:bg-olive-lt shadow-2xl shadow-olive/20 active:scale-95 transition-all transition-colors"
                >
                  <Save size={18} />
                  {saving ? "Ingesting..." : "Update Manifest"}
                </button>
              </div>
            </div>
          </section>

          {/* Brand Assets */}
          <section className="rounded-sm border border-white/5 bg-charcoal shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 bg-ink/40 px-8 py-5">
              <div className="flex items-center gap-4">
                 <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/10 border border-gold/30 text-gold shadow-inner ring-1 ring-gold/5">
                   <ImageIcon size={18} />
                 </div>
                 <div>
                   <h2 className="font-head font-black text-sm uppercase tracking-widest text-white italic">Site Brand Infrastructure</h2>
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Deploy global identifiers (Logo & Favicon)</p>
                 </div>
              </div>
              <Target size={18} className="text-gold/20" />
            </div>
            <div className="p-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
              {/* Logo Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                   <label className={labelClass}>Primary Logo Node</label>
                   <span className="text-[8px] font-black text-gold/40 uppercase tracking-widest italic">Header Active</span>
                </div>
                <div className="rounded-sm border-2 border-dashed border-white/5 bg-ink p-8 text-center hover:bg-white/[0.02] hover:border-gold/30 transition-all group/upload relative overflow-hidden shadow-inner">
                  <div className="mx-auto flex h-24 w-40 items-center justify-center rounded-sm bg-ink border border-white/5 mb-6 p-4 ring-1 ring-gold/0 group-hover/upload:ring-gold/10 transition-all shadow-2xl">
                    <img src={logoPreview || "/assets/Image/logo.png"} alt="Preview" className="max-h-16 max-w-full object-contain grayscale-[0.4] group-hover/upload:grayscale-0 transition-all duration-700" />
                  </div>
                  <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                  <button onClick={() => logoInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-sm bg-olive px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-olive-lt transition-all active:scale-95 shadow-2xl">
                    <Upload size={14} /> Upload Vector Identity
                  </button>
                  <p className="mt-4 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] italic">Recommended: 512x128px // Transparent PNG / SVG</p>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                   <label className={labelClass}>Sub-Grid Matrix Icon (Favicon)</label>
                   <span className="text-[8px] font-black text-gold/40 uppercase tracking-widest italic">Browser Tab Active</span>
                </div>
                <div className="rounded-sm border-2 border-dashed border-white/5 bg-ink p-8 text-center hover:bg-white/[0.02] hover:border-gold/30 transition-all group/upload relative overflow-hidden shadow-inner">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-sm bg-ink border border-white/5 mb-6 p-4 ring-1 ring-gold/0 group-hover/upload:ring-gold/10 transition-all shadow-2xl">
                    <img src={faviconPreview || "/assets/Image/favicon.svg"} alt="Preview" className="h-full w-full object-contain grayscale-[0.6] group-hover/upload:grayscale-0 transition-all duration-500" />
                  </div>
                  <input type="file" ref={faviconInputRef} onChange={handleFaviconUpload} accept="image/*" className="hidden" />
                  <button onClick={() => faviconInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-sm bg-olive px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-olive-lt transition-all active:scale-95 shadow-2xl">
                    <Upload size={14} /> Upload Matrix Icon
                  </button>
                  <p className="mt-4 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] italic">Recommended: 32x32px // ICO / PNG / SVG</p>
                </div>
              </div>
            </div>
            <div className="border-t border-white/5 bg-ink/20 px-8 py-6 flex justify-end">
              <button
                onClick={handleSaveAssets}
                disabled={saving}
                className="inline-flex items-center gap-3 rounded-sm bg-olive/10 border border-olive/30 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-gold hover:bg-gold hover:text-ink transition-all active:scale-95 shadow-2xl italic"
              >
                <Zap size={16} />
                {saving ? "Syncing..." : "Synchronize Visuals"}
              </button>
            </div>
          </section>

          {/* Password */}
          <section className="rounded-sm border border-white/5 bg-charcoal shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 bg-ink/40 px-8 py-5">
              <div className="flex items-center gap-4">
                 <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-red/10 border border-red/30 text-red shadow-inner ring-1 ring-gold/5">
                   <Lock size={18} />
                 </div>
                 <div>
                   <h2 className="font-head font-black text-sm uppercase tracking-widest text-white italic">Security Rotation</h2>
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Cycle administrative decryption keys</p>
                 </div>
              </div>
              <ShieldCheck size={18} className="text-red/20" />
            </div>
            <div className="p-10 space-y-8">
              {[
                { label: "Current Access Key", key: "current", show: showCurrentPwd, toggle: setShowCurrentPwd },
                { label: "New Deployment Key", key: "new_", show: showNewPwd, toggle: setShowNewPwd },
                { label: "Repeat Deployment Key", key: "confirm", show: showConfirmPwd, toggle: setShowConfirmPwd },
              ].map(({ label, key, show, toggle }) => (
                <div key={key} className="space-y-2">
                  <label className={labelClass}>{label}</label>
                  <div className="relative group">
                    <input
                      type={show ? "text" : "password"}
                      value={(passwords as any)[key]}
                      onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                      className={`${inputClass} pr-14 italic tracking-[0.5em]`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => toggle((v) => !v)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold transition-colors"
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-6 border-t border-white/5">
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="inline-flex items-center gap-3 rounded-sm bg-red px-10 py-4 text-xs font-head font-bold uppercase tracking-widest text-white hover:bg-red-lt shadow-2xl shadow-red/20 active:scale-95 transition-all italic"
                >
                  <RefreshCw size={18} className={saving ? "animate-spin" : ""} />
                  {saving ? "Re-triggering..." : "Force Key Rotation"}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────── */}
        <div className="space-y-10">

          {/* Notification Preferences */}
          <section className="rounded-sm border border-white/5 bg-charcoal shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 bg-ink/40 px-8 py-5">
              <div className="flex items-center gap-4">
                 <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/10 border border-gold/30 text-gold shadow-inner ring-1 ring-gold/5">
                   <Bell size={18} />
                 </div>
                 <div>
                   <h2 className="font-head font-black text-sm uppercase tracking-widest text-white italic">Signal Intel</h2>
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Control transmission interceptors</p>
                 </div>
              </div>
              <Radio size={18} strokeWidth={2.5} className="text-gold/20 animate-pulse" />
            </div>
            <div className="p-8 space-y-6">
              {(
                [
                  { key: "orders", label: "Procurement Inbound", desc: "Notify on every mission provision" },
                  { key: "products", label: "Inventory Pulse", desc: "Depletion & asset alerts" },
                  { key: "system", label: "Kernel Signals", desc: "Server & sub-grid uptime alerts" },
                  { key: "marketing", label: "Transmission Out", desc: "External comms & relays" },
                ] as const
              ).map(({ key, label, desc }) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-start gap-4 rounded-sm p-4 hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all group/toggle shadow-inner"
                >
                  <div className="relative shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) =>
                        setNotifications((n) => ({ ...n, [key]: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="h-6 w-11 rounded-sm bg-ink border border-white/10 peer-checked:bg-olive peer-checked:border-gold/30 transition-all shadow-inner" />
                    <div className="absolute top-1 left-1 h-4 w-4 rounded-sm bg-white/20 shadow transition-all peer-checked:translate-x-5 peer-checked:bg-gold peer-checked:shadow-[0_0_12px_rgba(201,162,39,0.5)]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.1em] text-white group-hover:text-gold transition-colors italic">{label}</p>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1.5">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Role / Security summary */}
          <section className="rounded-sm border border-gold/10 bg-gold/5 shadow-2xl shadow-black/40 p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 -rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="relative z-10 flex items-center gap-3 pb-4 border-b border-gold/10">
              <ShieldCheck size={20} className="text-gold" />
              <h2 className="font-head font-black text-sm uppercase tracking-widest text-gold italic">Security Hub</h2>
            </div>
            <ul className="relative z-10 space-y-5">
              <li className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] italic">
                <span className="text-white/30">Primary Role:</span>
                <span className="text-gold bg-gold/10 px-3 py-1 rounded-sm border border-gold/20">{profile.role}</span>
              </li>
              <li className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] italic">
                <span className="text-white/30">Force-2FA Status:</span>
                <span className="text-red/60 animate-pulse">DEACTIVATED</span>
              </li>
              <li className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] italic">
                <span className="text-white/30">Last Intercept:</span>
                <span className="text-emerald-400 font-bold">TODAY_ALPHA</span>
              </li>
            </ul>
            <div className="relative z-10 pt-4">
               <button className="w-full h-12 bg-gold/10 border border-gold/30 rounded-sm text-[9px] font-black uppercase tracking-[0.4em] text-gold hover:bg-gold hover:text-ink transition-all italic">Initiate Lockdown</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
