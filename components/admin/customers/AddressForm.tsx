import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash, Home, Briefcase, MapPin, Target, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerAddress } from "@/lib/store/users/userSlice";
import { cn } from "@/lib/utils";

interface AddressFormProps {
  address: CustomerAddress;
  onChange: (id: string, updatedAddress: Partial<CustomerAddress>) => void;
  onRemove: (id: string) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onChange,
  onRemove,
}) => {
  return (
    <div className="p-8 rounded-sm border border-white/5 bg-ink/40 space-y-6 relative group transition-all hover:bg-ink/60 hover:border-gold/20 shadow-inner">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-gold/40 group-hover:text-gold transition-colors">
            {address.label.toLowerCase() === "home" ? (
              <Home size={18} />
            ) : address.label.toLowerCase() === "office" ? (
              <Briefcase size={18} />
            ) : (
              <Target size={18} />
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] italic">Sector Label</span>
            <Input
              value={address.label}
              onChange={(e) => onChange(address._id, { label: e.target.value.toUpperCase() })}
              placeholder="SECTOR NAME"
              className="h-9 w-48 bg-charcoal border-white/5 rounded-sm text-[11px] font-black tracking-widest uppercase text-white shadow-inner focus:border-gold/30 italic"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-sm border border-white/5">
             <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                id={`default-${address._id}`}
                checked={address.isDefault}
                onChange={(e) => onChange(address._id, { isDefault: e.target.checked })}
                className="peer h-4 w-4 opacity-0 absolute cursor-pointer z-10"
              />
              <div className="h-4 w-4 border border-white/20 rounded-sm peer-checked:bg-gold peer-checked:border-gold transition-all flex items-center justify-center">
                {address.isDefault && <ShieldCheck size={10} className="text-ink" strokeWidth={4} />}
              </div>
            </div>
            <Label
              htmlFor={`default-${address._id}`}
              className="text-[9px] font-black uppercase tracking-widest text-white/40 cursor-pointer italic"
            >
              Primary Node
            </Label>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-sm text-white/10 hover:text-red hover:bg-red/10 border border-transparent hover:border-red/20 transition-all shadow-xl"
            onClick={() => onRemove(address._id)}
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1 italic">
            Coordinate Line 1
          </Label>
          <Input
            value={address.addressLine1}
            onChange={(e) =>
              onChange(address._id, { addressLine1: e.target.value })
            }
            placeholder="STREET ADDRESS / PO BOX"
            className="h-11 bg-charcoal border-white/5 rounded-sm text-[12px] font-bold italic tracking-wide text-white uppercase shadow-inner focus:border-gold/30"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1 italic">
            Coordinate Line 2
          </Label>
          <Input
            value={address.addressLine2}
            onChange={(e) =>
              onChange(address._id, { addressLine2: e.target.value })
            }
            placeholder="SUITE / UNIT / BASE"
            className="h-11 bg-charcoal border-white/5 rounded-sm text-[12px] font-bold italic tracking-wide text-white uppercase shadow-inner focus:border-gold/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1 italic">
            Visual Landmark
          </Label>
          <Input
            value={address.landmark}
            onChange={(e) =>
              onChange(address._id, { landmark: e.target.value })
            }
            placeholder="NEARBY LOGISTICS HUB"
            className="h-11 bg-charcoal border-white/5 rounded-sm text-[12px] font-bold italic tracking-wide text-white uppercase shadow-inner focus:border-gold/30"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1 italic">
              City Hub
            </Label>
            <Input
              value={address.city}
              onChange={(e) => onChange(address._id, { city: e.target.value })}
              placeholder="ZONE-A CITY"
              className="h-11 bg-charcoal border-white/5 rounded-sm text-[12px] font-bold italic tracking-wide text-white uppercase shadow-inner focus:border-gold/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1 italic">
              Postal Grid
            </Label>
            <Input
              value={address.pincode}
              onChange={(e) =>
                onChange(address._id, { pincode: e.target.value })
              }
              placeholder="000-000"
              className="h-11 bg-charcoal border-white/5 rounded-sm text-[12px] font-bold italic tracking-wide text-white uppercase shadow-inner focus:border-gold/30"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1 italic">
            Territory / State
          </Label>
          <Input
            value={address.state}
            onChange={(e) => onChange(address._id, { state: e.target.value })}
            placeholder="COMMAND REGION"
            className="h-11 bg-charcoal border-white/5 rounded-sm text-[12px] font-bold italic tracking-wide text-white uppercase shadow-inner focus:border-gold/30"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] ml-1 italic">
            Global Nation
          </Label>
          <Input
            value={address.country}
            onChange={(e) => onChange(address._id, { country: e.target.value })}
            placeholder="DOMINION / NATION"
            className="h-11 bg-charcoal border-white/5 rounded-sm text-[12px] font-bold italic tracking-wide text-white uppercase shadow-inner focus:border-gold/30"
          />
        </div>
      </div>
    </div>
  );
};
