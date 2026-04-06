"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Download,
  FileJson,
  X,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Database,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TacticalImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<any>;
  sampleData: any[];
  title: string;
  description: string;
  fileName: string;
}

export function TacticalImportModal({
  isOpen,
  onClose,
  onImport,
  sampleData,
  title,
  description,
  fileName,
}: TacticalImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/json" &&
      !selectedFile.name.endsWith(".json")
    ) {
      toast.error("SECURITY PROTOCOL: JSON manifest required.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setPreviewData(json.slice(0, 5));
          setFile(selectedFile);
        } else {
          toast.error("DATA MISMATCH: Manifest must be a root-level array.");
        }
      } catch (err) {
        toast.error("DECRYPTION ERROR: Failed to parse manifest.");
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDownloadSample = () => {
    const dataStr = JSON.stringify(sampleData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = `${fileName}_template.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", url);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    const tId = toast.loading("INJECTING DATA MATRIX...");
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          await onImport(json);
          toast.success("SYNCHRONIZATION COMPLETE", { id: tId });
          handleClose();
        } catch (err: any) {
          toast.error(err.message || "INJECTION ABORTED", { id: tId });
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      toast.error("COMMS FAILURE", { id: tId });
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setIsImporting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl bg-ink border border-white/10 rounded-none shadow-2xl p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gold shadow-[0_0_15px_rgba(201,162,39,0.5)]" />

        <DialogHeader className="p-8 border-b border-white/5 space-y-2">
          <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <div className="p-2 bg-gold/10 text-gold border border-gold/20">
              <FileJson size={20} />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic flex items-center gap-2">
            <Terminal size={12} className="text-gold/50" /> {description}
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 bg-black/20 rounded-none p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gold/30 hover:bg-black/40 transition-all group group-focus:border-gold"
            >
              <div className="p-5 bg-white/5 text-white/20 group-hover:bg-gold/10 group-hover:text-gold transition-all border border-white/5 group-hover:border-gold/20">
                <Upload size={32} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                  IDENTIFY DATA SOURCE
                </p>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                  DRAG-DROP OR CLICK TO BROADCAST
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">
                      {file.name}
                    </p>
                    <p className="text-[8px] font-bold text-emerald-400/60 uppercase tracking-[0.3em] italic">
                      Source Validated - Ready for Injection
                    </p>
                  </div>
                </div>
                <button
                  className="h-8 w-8 text-white/20 hover:text-red transition-colors flex items-center justify-center"
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {previewData.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1 flex items-center gap-2">
                    <Database size={10} /> Manifest Preview
                  </p>
                  <div className="border border-white/5 bg-black/40 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-ink/60 border-b border-white/5">
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="text-[8px] font-black uppercase text-white/20 px-4 py-3 tracking-widest">
                            DESIGNATION
                          </TableHead>
                          <TableHead className="text-[8px] font-black uppercase text-white/20 px-4 py-3 tracking-widest">
                            SERIAL ID
                          </TableHead>
                          <TableHead className="text-right text-[8px] font-black uppercase text-white/20 px-4 py-3 tracking-widest">
                            MAPS
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((item, idx) => (
                          <TableRow
                            key={idx}
                            className="border-white/5 hover:bg-white/[0.02] transition-colors"
                          >
                            <TableCell className="text-[9px] font-black text-white uppercase px-4 py-3 tracking-tight">
                              {item.name || item.title || "UNIT-X"}
                            </TableCell>
                            <TableCell className="text-[9px] font-mono font-bold text-gold/40 px-4 py-3">
                              {item.sku || item.slug || item.key || "N/A"}
                            </TableCell>
                            <TableCell className="text-right text-[9px] text-white/20 px-4 py-3 font-bold">
                              {Object.keys(item).length}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/5 pt-6">
            <button
              className="text-[9px] text-gold font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-white transition-colors"
              onClick={handleDownloadSample}
            >
              <Download size={14} /> Extract Template Manifest
            </button>
            <div className="flex items-center gap-2 text-[8px] text-white/20 font-black uppercase tracking-widest italic">
              <Zap size={12} className="text-gold/40" /> Skipping redundant
              identifiers
            </div>
          </div>
        </div>

        <DialogFooter className="bg-charcoal p-8 border-t border-white/5 flex items-center justify-end gap-4 sm:gap-0">
          <button
            onClick={handleClose}
            className="h-12 px-8 bg-ink border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all"
          >
            Abort
          </button>
          <button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="h-12 px-12 bg-olive text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-olive/20 disabled:opacity-20 flex items-center gap-3 ml-4"
          >
            {isImporting ? (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap size={16} />
            )}
            Initiate Injection
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
