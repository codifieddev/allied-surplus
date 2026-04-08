import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Save,
  Shield,
  Activity,
  UserPlus,
  Terminal,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface UserFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  title: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  loading,
  title,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    status: "active",
    isTenantOwner: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "", // Password is never pre-filled
        role: initialData.role || "staff",
        status: initialData.status || "active",
        isTenantOwner: initialData.isTenantOwner || false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-white/5">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            type="button"
            className="h-12 w-12 rounded-sm bg-white/5 border border-white/10 text-white/20 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all shadow-xl"
          >
            <ArrowLeft size={20} strokeWidth={3} />
          </Button>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-gold opacity-60">
              <Terminal size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                Personnel Authorization Console
              </span>
            </div>
            <h1 className="text-4xl font-head font-black text-white uppercase tracking-tighter">
              {title.split(' ')[0]} <span className="text-gold/80 italic">{title.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          type="button"
          className="rounded-sm bg-olive text-white h-12 px-10 gap-3 shadow-2xl shadow-olive/20 border border-olive/30 hover:bg-olive-lt transition-all active:scale-95 text-[11px] font-black uppercase tracking-widest italic"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
          ) : (
            <>
              <Save size={18} strokeWidth={3} /> Save Credentials
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-12">
          {/* General Information Section */}
          <div className="bg-charcoal border border-white/5 p-10 rounded-sm shadow-2xl shadow-black/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <UserPlus size={120} className="text-white" />
            </div>

            <div className="relative z-10 flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
              <div className="h-10 w-10 flex items-center justify-center rounded-sm bg-olive/10 border border-olive/30 text-gold ring-1 ring-gold/5 shadow-inner">
                <Shield size={18} />
              </div>
              <h3 className="text-xl font-head font-black text-white uppercase tracking-tighter italic">
                Operator <span className="text-gold/80">Credentials</span>
              </h3>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1 italic">
                  Operator Name
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center text-white/10 pointer-events-none group-focus-within:text-gold transition-colors">
                    <User size={16} />
                  </div>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="ENTER FULL NAME"
                    required
                    className="pl-10 h-14 bg-ink/40 border-white/5 rounded-sm focus:border-gold/30 transition-all shadow-inner text-[13px] font-bold italic tracking-wider text-white uppercase"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1 italic">
                  Communication Frequency (Email)
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center text-white/10 pointer-events-none group-focus-within:text-gold transition-colors">
                    <Mail size={16} />
                  </div>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="OPERATOR@NETWORK.SYS"
                    required
                    className="pl-10 h-14 bg-ink/40 border-white/5 rounded-sm focus:border-gold/30 transition-all shadow-inner text-[13px] font-bold italic tracking-wider text-white uppercase"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1 italic">
                  Clearance Level
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center text-white/10 z-10 pointer-events-none">
                    <Shield size={16} />
                  </div>
                  <Select
                    value={formData.role}
                    onValueChange={(val) =>
                      setFormData({ ...formData, role: val })
                    }
                  >
                    <SelectTrigger className="pl-10 h-14 bg-ink/40 border-white/5 rounded-sm focus:border-gold/30 transition-all shadow-inner text-[13px] font-bold italic tracking-wider text-white uppercase">
                      <SelectValue placeholder="Select Clearance" />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal border-white/5 text-white font-bold uppercase tracking-widest italic">
                      <SelectItem value="admin">Administrator (Level 4)</SelectItem>
                      <SelectItem value="staff">Staff (Level 2)</SelectItem>
                      <SelectItem value="manager">Manager (Level 3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1 italic">
                  {initialData ? "Update Encryption Key (Optional)" : "Primary Encryption Key"}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center text-white/10 pointer-events-none group-focus-within:text-gold transition-colors">
                    <Lock size={16} />
                  </div>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    required={!initialData}
                    className="pl-10 h-14 bg-ink/40 border-white/5 rounded-sm focus:border-gold/30 transition-all shadow-inner text-[13px] font-bold italic tracking-wider text-white uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Access Control Section */}
          <div className="bg-charcoal border border-white/5 p-10 rounded-sm shadow-2xl shadow-black/40 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <Zap size={120} className="text-white" />
            </div>

            <div className="relative z-10 flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
              <div className="h-10 w-10 flex items-center justify-center rounded-sm bg-gold/10 border border-gold/30 text-gold ring-1 ring-gold/5 shadow-inner">
                <Shield size={18} />
              </div>
              <h3 className="text-xl font-head font-black text-white uppercase tracking-tighter italic">
                Advanced <span className="text-gold/80">Permissions</span>
              </h3>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex items-center justify-between p-6 rounded-sm border border-white/5 bg-ink/40 shadow-inner">
                <div className="space-y-2">
                  <Label className="text-sm font-black text-white uppercase tracking-wider italic">
                    Operator Status
                  </Label>
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">
                    Active operators can access the backbone grid.
                  </p>
                </div>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger className="w-[140px] h-10 bg-charcoal border-white/10 rounded-sm text-[10px] font-black uppercase tracking-widest text-gold italic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-white/5 text-white font-bold uppercase tracking-widest italic px-2">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-6 rounded-sm border border-white/5 bg-ink/40 shadow-inner">
                <div className="space-y-2">
                  <Label className="text-sm font-black text-white uppercase tracking-wider italic">
                    Grid Ownership
                  </Label>
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">
                    Delegate root authority for the terminal.
                  </p>
                </div>
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={formData.isTenantOwner}
                    onChange={(e) => setFormData({ ...formData, isTenantOwner: e.target.checked })}
                    className="peer h-6 w-12 opacity-0 absolute cursor-pointer z-10"
                  />
                  <div className="h-6 w-12 bg-white/5 border border-white/10 rounded-full transition-all peer-checked:bg-gold/20 peer-checked:border-gold/50 flex items-center px-1">
                    <div className={cn("h-4 w-4 bg-white/20 rounded-full transition-all translate-x-0 peer-checked:translate-x-6 peer-checked:bg-gold")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary Section */}
        <div className="space-y-8">
          <div className="bg-charcoal border border-white/5 p-8 rounded-sm shadow-2xl shadow-black/40 space-y-8 sticky top-24">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic pb-4 border-b border-white/5">
              Operator Intel
            </h4>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-sm bg-olive/10 border border-olive/30 flex items-center justify-center text-gold font-head font-black text-xl shadow-inner ring-1 ring-gold/5">
                  {formData.name.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex flex-col space-y-1 overflow-hidden">
                  <span className="text-sm font-black text-white uppercase tracking-wider truncate italic">
                    {formData.name || "UNIDENTIFIED UNIT"}
                  </span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest truncate italic">
                    {formData.role.toUpperCase() || "PENDING ROLE"}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-ink/60 border border-white/5 rounded-sm space-y-4 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-gold/5 -rotate-45 translate-x-6 -translate-y-6" />
                
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest italic">
                  <span className="text-white/20">Operational State</span>
                  <span className={cn(formData.status === 'active' ? 'text-emerald-400' : 'text-red')}>{formData.status.toUpperCase()}</span>
                </div>
                
                <div className="flex flex-col space-y-1 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em] italic mb-1">Clearance Protocol</span>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest truncate bg-gold/5 px-3 py-2 rounded-sm ring-1 ring-gold/10 italic">
                    {formData.isTenantOwner ? "TENANT ROOT ACCESS" : "STANDARD OPERATOR"}
                  </span>
                </div>
              </div>

               <div className="flex items-center gap-3 p-4 bg-gold/5 border border-gold/10 rounded-sm italic">
                <Shield className="text-gold" size={14} />
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                  Authentication mandatory
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
