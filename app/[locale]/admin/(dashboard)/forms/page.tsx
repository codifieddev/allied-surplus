"use client";

import React, { useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  FileText,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchForms, deleteForm } from "@/lib/store/forms/formsThunk";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";

export default function FormsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { allForms, loading } = useAppSelector(
    (state: RootState) => state.adminForms,
  );

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(`DECOMMISSION FORM "${name.toUpperCase()}"? (CRITICAL ACTION)`)
    ) {
      try {
        await dispatch(deleteForm(id)).unwrap();
        toast.success("FORM DECOMMISSIONED SUCCESSFULLY");
      } catch (err) {
        toast.error("DECOMMISSION FAILED: ACCESS DENIED");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      {/* Tactical Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-l-4 border-gold pl-6 py-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
              Form <span className="text-gold">Intelligence</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest italic">
            <Terminal size={12} className="text-gold/50" />
            Registry of Deployed Form Matrix Nodes
          </div>
        </div>

        <Button
          onClick={() => router.push("/admin/forms/new")}
          className="h-12 px-10 bg-olive text-white font-black text-[10px] uppercase tracking-widest hover:bg-olive-lt transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-olive/20"
        >
          <Plus size={16} />
          Deploy New Matrix Node
        </Button>
      </div>

      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
            Synchronizing Matrix Data...
          </span>
        </div>
      ) : allForms.length === 0 ? (
        <div className="h-[40vh] border-2 border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center gap-6 bg-white/[0.02]">
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-white/10">
            <FileText size={32} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-black text-white/40 uppercase tracking-wider italic">
              NO FORMS DETECTED
            </h3>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] italic">
              Registry is empty. Initialize your first dynamic asset node.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/forms/new")}
            className="text-gold/60 hover:text-gold uppercase text-[10px] font-black tracking-widest italic gap-2"
          >
            Deploy First Node <ArrowRight size={14} />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allForms.map((form) => (
            <div
              key={form.id}
              className="bg-charcoal border border-white/5 p-6 rounded-sm shadow-xl hover:border-white/10 transition-all group flex flex-col justify-between h-56 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rotate-45 translate-x-12 -translate-y-12" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-olive/10 border border-olive/30 flex items-center justify-center text-gold shadow-inner">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tighter truncate w-48 italic">
                      {form.name}
                    </h2>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">
                      {form.fields?.length || 0} Data Nodes Configured
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-1 font-bold text-[9px] text-white/10 uppercase italic">
                  <span>ID:</span>
                  <span className="text-white/20 tracking-tighter">
                    {form.id.slice(-8)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/20 hover:text-gold hover:bg-gold/5"
                    onClick={() => router.push(`/admin/forms/${form.id}/edit`)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/20 hover:text-red hover:bg-red/5"
                    onClick={() => handleDelete(form.id, form.name)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
