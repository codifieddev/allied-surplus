import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Plus,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  ArrowLeft,
  Save,
  Shield,
  Zap,
  Terminal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomerAddress } from "@/lib/store/users/userSlice";
import { AddressForm } from "./AddressForm";

interface CustomerFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  title: string;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
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
    phone: "",
    addresses: [] as CustomerAddress[],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "", // Password is never pre-filled
        phone: initialData.phone || "",
        addresses: initialData.addresses || [],
      });
    }
  }, [initialData]);

  const handleAddAddress = () => {
    const newAddress: CustomerAddress = {
      _id: Math.random().toString(36).substr(2, 9),
      label: "NEW DEPLOYMENT ZONE",
      addressLine1: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      isDefault: formData.addresses.length === 0,
    };
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddress],
    }));
  };

  const handleAddressChange = (
    id: string,
    updatedFields: Partial<CustomerAddress>,
  ) => {
    setFormData((prev) => {
      let newAddresses = prev.addresses.map((addr) =>
        addr._id === id ? { ...addr, ...updatedFields } : addr,
      );

      if (updatedFields.isDefault) {
        newAddresses = newAddresses.map((addr) =>
          addr._id === id ? addr : { ...addr, isDefault: false },
        );
      }

      return { ...prev, addresses: newAddresses };
    });
  };

  const handleRemoveAddress = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr._id !== id),
    }));
  };

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
            className="h-12 w-12 rounded-sm bg-white/5 border border-white/10 text-white/20 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all shadow-xl"
          >
            <ArrowLeft size={20} strokeWidth={3} />
          </Button>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-gold opacity-60">
              <Terminal size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                Personnel Profile Configuration
              </span>
            </div>
            <h1 className="text-4xl font-head font-black text-white uppercase tracking-tighter">
              {title.split(" ")[0]}{" "}
              <span className="text-gold/80 italic">
                {title.split(" ").slice(1).join(" ")}
              </span>
            </h1>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-sm bg-olive text-white h-12 px-10 gap-3 shadow-2xl shadow-olive/20 border border-olive/30 hover:bg-olive-lt transition-all active:scale-95 text-[11px] font-black uppercase tracking-widest italic"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
          ) : (
            <>
              <Save size={18} strokeWidth={3} /> Save Intelligence
            </>
          )}
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-4 gap-10"
      >
        <div className="lg:col-span-3 space-y-12">
          {/* General Information Section */}
          <div className="bg-charcoal border border-white/5 p-10 rounded-sm shadow-2xl shadow-black/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <User size={120} className="text-white" />
            </div>

            <div className="relative z-10 flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
              <div className="h-10 w-10 flex items-center justify-center rounded-sm bg-olive/10 border border-olive/30 text-gold ring-1 ring-gold/5 shadow-inner">
                <Shield size={18} />
              </div>
              <h3 className="text-xl font-head font-black text-white uppercase tracking-tighter italic">
                Core <span className="text-gold/80">Identity</span>
              </h3>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1 italic">
                  Legal Name
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
                    placeholder="PERSONNEL@NETWORK.SYS"
                    className="pl-10 h-14 bg-ink/40 border-white/5 rounded-sm focus:border-gold/30 transition-all shadow-inner text-[13px] font-bold italic tracking-wider text-white uppercase"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1 italic">
                  Secure Line (Phone)
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center text-white/10 pointer-events-none group-focus-within:text-gold transition-colors">
                    <Phone size={16} />
                  </div>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91-0000000000"
                    className="pl-10 h-14 bg-ink/40 border-white/5 rounded-sm focus:border-gold/30 transition-all shadow-inner text-[13px] font-bold italic tracking-wider text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1 italic">
                  {initialData
                    ? "Update Access Code (Optional)"
                    : "Primary Access Code"}
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
                    className="pl-10 h-14 bg-ink/40 border-white/5 rounded-sm focus:border-gold/30 transition-all shadow-inner text-[13px] font-bold italic tracking-wider text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 ring-1 ring-emerald-500/5 shadow-inner">
                  <MapPin size={18} />
                </div>
                <h3 className="text-xl font-head font-black text-white uppercase tracking-tighter italic">
                  Deployment <span className="text-emerald-400/80">Zones</span>
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleAddAddress}
                className="h-10 px-6 rounded-sm bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all gap-2"
              >
                <Plus size={16} strokeWidth={3} /> New Zone
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {formData.addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 rounded-sm border-2 border-dashed border-white/5 text-white/10 bg-charcoal shadow-inner">
                  <MapPin className="h-12 w-12 mb-4 opacity-5" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                    Grid Location: Unknown
                  </p>
                </div>
              ) : (
                formData.addresses.map((address) => (
                  <AddressForm
                    key={address._id}
                    address={address}
                    onChange={handleAddressChange}
                    onRemove={handleRemoveAddress}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-8">
          <div className="bg-charcoal border border-white/5 p-8 rounded-sm shadow-2xl shadow-black/40 space-y-8 sticky top-24">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic pb-4 border-b border-white/5">
              Intel Summary
            </h4>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-sm bg-olive/10 border border-olive/30 flex items-center justify-center text-gold font-head font-black text-xl shadow-inner ring-1 ring-gold/5">
                  {formData.name.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex flex-col space-y-1 overflow-hidden">
                  <span className="text-sm font-black text-white uppercase tracking-wider truncate italic">
                    {formData.name || "UNIDENTIFIED ASSET"}
                  </span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest truncate italic">
                    {formData.email || "NO RELAY DETECTED"}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-ink/60 border border-white/5 rounded-sm space-y-4 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-gold/5 -rotate-45 translate-x-6 -translate-y-6" />

                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest italic">
                  <span className="text-white/20">Operational Zones</span>
                  <span className="text-emerald-400">
                    {formData.addresses.length}
                  </span>
                </div>

                <div className="flex flex-col space-y-1 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em] italic mb-1">
                    Primary Node
                  </span>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest truncate bg-gold/5 px-3 py-2 rounded-sm ring-1 ring-gold/10 italic">
                    {formData.addresses.find((a) => a.isDefault)?.label ||
                      "PENDING SELECTION"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gold/5 border border-gold/10 rounded-sm italic">
                <Zap className="text-gold" size={14} />
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                  Auto-synchronization active
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
