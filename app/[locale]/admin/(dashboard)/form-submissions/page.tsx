"use client";

import React, { useEffect, useState } from "react";
import { Terminal, FileSpreadsheet, Eye, ArrowRight, Package, User as UserIcon, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchSubmissions, fetchForms } from "@/lib/store/forms/formsThunk";
import { fetchProducts } from "@/lib/store/products/productsThunk";
import { RootState } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

export default function FormSubmissionsPage() {
  const dispatch = useAppDispatch();
  const { submissions, allForms, loading } = useAppSelector((state: RootState) => state.adminForms);
  const { allProducts } = useAppSelector((state: RootState) => state.adminProducts);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const getFormName = (id: string) => allForms.find((f: any) => f._id === id)?.name || "UNKNOWN MATRIX";
  const getProductName = (id: string) => allProducts.find((p: any) => p._id === id)?.name || "DIRECT ENTRY";

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      {/* Tactical Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-l-4 border-gold pl-6 py-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
              Data <span className="text-gold">Intelligence</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest italic">
            <Terminal size={12} className="text-gold/50" />
            Registry of Incoming Data Streams (Submissions)
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
            Parsing Data Packets...
          </span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="h-[40vh] border-2 border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center gap-6 bg-white/[0.02]">
           <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-white/10">
            <FileSpreadsheet size={32} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-black text-white/40 uppercase tracking-wider italic">
              NO DATA STREAMS DETECTED
            </h3>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] italic">
              Awaiting first transmission from field units.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {submissions.map((sub: any) => (
            <div 
              key={sub._id}
              className="bg-charcoal border border-white/5 p-6 rounded-sm shadow-xl hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8 flex-1">
                <div className="flex flex-col space-y-1">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">Origin Matrix</span>
                  <span className="text-sm font-black text-white uppercase tracking-wider italic group-hover:text-gold transition-colors">
                    {getFormName(sub.formId)}
                  </span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">Asset Reference</span>
                  <div className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase italic">
                    <Package size={12} className="text-gold/40" />
                    {getProductName(sub.productId)}
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">Transmission Timestamp</span>
                  <div className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase italic">
                    <Calendar size={12} className="text-gold/40" />
                    {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setSelectedSubmission(sub)}
                    className="bg-ink/60 border border-white/5 text-white/40 hover:text-white hover:border-gold/30 hover:bg-gold/5 transition-all text-[10px] font-black uppercase tracking-widest italic h-10 px-6 gap-2"
                  >
                    <Eye size={14} /> View Intelligence
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-charcoal border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                   <DialogHeader className="border-b border-white/5 pb-4 mb-6">
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
                      Intelligence <span className="text-gold">Report</span>
                    </DialogTitle>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest italic mt-1">
                      <span>Ref: {sub._id}</span>
                      <span className="h-1 w-1 bg-white/20 rounded-full" />
                      <span>Matrix: {getFormName(sub.formId)}</span>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6">
                    {sub.data && Object.entries(sub.data).map(([key, val]: [string, any]) => (
                      <div key={key} className="space-y-2 p-4 bg-ink/40 border border-white/5 rounded-sm">
                        <Label className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em] italic">
                          {key.replace(/-/g, ' ')}
                        </Label>
                        <div className="text-sm font-bold text-white uppercase tracking-wide">
                          {Array.isArray(val) ? val.join(", ") : String(val)}
                        </div>
                      </div>
                    ))}

                    <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
                       <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em] italic">Metadata</span>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-ink/20 border border-white/5 rounded-sm">
                             <span className="block text-[8px] text-white/20 font-black uppercase tracking-widest italic mb-1">User ID</span>
                             <span className="text-[10px] font-bold text-white/40 uppercase">{sub.userId || "GUEST_UNIT"}</span>
                          </div>
                          {sub.productId && (
                             <div className="p-3 bg-ink/20 border border-white/5 rounded-sm">
                                <span className="block text-[8px] text-white/20 font-black uppercase tracking-widest italic mb-1">Product ID</span>
                                <span className="text-[10px] font-bold text-white/40 uppercase">{sub.productId}</span>
                             </div>
                          )}
                       </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
