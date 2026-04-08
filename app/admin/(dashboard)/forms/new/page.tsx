"use client";

import React from "react";
import { FormBuilder, FormField } from "@/components/admin/forms/FormBuilder";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { saveForm } from "@/lib/store/forms/formsThunk";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";

export default function NewFormPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: RootState) => state.adminForms);

  const handleSave = async (name: string, fields: FormField[]) => {
    try {
      const tId = toast.loading("INITIALIZING MATRIX...");
      await dispatch(saveForm({ payload: { name, fields } })).unwrap();
      toast.success("MATRIX NODE DEPLOYED SUCCESSFULLY", { id: tId });
      setTimeout(() => router.push("/admin/forms"), 1000);
    } catch (err: any) {
      toast.error(err || "DEPLOYMENT FAILED");
    }
  };

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
            Initialize <span className="text-gold">New Node</span>
          </h1>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">
            Establish a dynamic data capture matrix.
          </p>
        </div>
      </div>

      <FormBuilder onSave={handleSave} loading={loading} />
    </div>
  );
}
