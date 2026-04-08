"use client";

import React, { useEffect, useState } from "react";
import { FormBuilder, FormField } from "@/components/admin/forms/FormBuilder";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { saveForm, fetchForms } from "@/lib/store/forms/formsThunk";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { allForms, loading } = useAppSelector((state: RootState) => state.adminForms);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (allForms.length === 0) {
      dispatch(fetchForms());
    }
  }, [allForms.length, dispatch]);

  useEffect(() => {
    if (allForms.length > 0 && id) {
      const found = allForms.find((f: any) => f._id === id);
      if (found) {
        setForm(found);
      } else {
        toast.error("MATRIX NODE NOT FOUND");
        router.push("/admin/forms");
      }
    }
  }, [allForms, id, router]);

  const handleSave = async (name: string, fields: FormField[]) => {
    try {
      const tId = toast.loading("SYNCHRONIZING MATRIX...");
      await dispatch(saveForm({ id, payload: { name, fields } })).unwrap();
      toast.success("MATRIX NODE UPDATED", { id: tId });
      setTimeout(() => router.push("/admin/forms"), 1000);
    } catch (err: any) {
      toast.error(err || "SYNCHRONIZATION FAILED");
    }
  };

  if (!form) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
          Initializing Hub...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-12 w-12 rounded-sm bg-white/5 border border-white/10 text-white/20 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all shadow-xl"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Modify <span className="text-gold">Matrix Node</span>
          </h1>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">
            Adjusting established dynamic data capture structures.
          </p>
        </div>
      </div>

      <FormBuilder 
        onSave={handleSave} 
        loading={loading} 
        initialFields={form.fields} 
        initialName={form.name} 
      />
    </div>
  );
}
