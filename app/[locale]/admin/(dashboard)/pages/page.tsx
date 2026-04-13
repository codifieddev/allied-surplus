"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchPagesThunk, deletePageThunk } from "@/lib/store/pages/pageThunk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash,
  Globe,
  FileText,
  ShieldAlert,
  Database,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Page } from "@/lib/store/pages/pageType";

function PagesPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { allPages: pages, isLoading: loading } = useSelector(
    (state: RootState) => state.pages
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPagesThunk());
  }, [dispatch]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`CONFIRM DESTRUCTION: Are you sure you want to delete the page "${title}"?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`PURGING ${title}...`);

    try {
      const resultAction = await dispatch(deletePageThunk(id));
      if (deletePageThunk.fulfilled.match(resultAction)) {
        toast.success(`${title} PURGED FROM REPOSITORY`, { id: toastId });
      } else {
        toast.error(`PURGE FAILED: ${resultAction.payload || "ACCESS DENIED"}`, { id: toastId });
      }
    } catch (err) {
      toast.error("NETWORK INTERFERENCE. RETRY PROTOCOL.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 bg-ink min-h-screen">
      {/* Tactical Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-gold pl-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <Database className="text-gold" size={24} />
             <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em]">
               CMS <span className="text-gold">Intelligence</span>
             </h1>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic opacity-70">
            Interface for content deployment and page-level logistics.
          </p>
        </div>
        <Button
          className="bg-olive text-white hover:bg-olive-light gap-2 px-8 py-6 rounded-none font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-olive/10 transition-all border-b-2 border-charcoal"
          onClick={() => router.push("/admin/pages/new")}
        >
          <Plus className="h-4 w-4" /> Deploy New Objective
        </Button>
      </div>

      {/* Tactical Table Container */}
      <div className="bg-charcoal border border-charcoal-light shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-ink/50 border-b border-charcoal-light">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-black text-gold uppercase tracking-[0.2em] text-[10px] py-6">
                Objective Header
              </TableHead>
              <TableHead className="font-black text-gold uppercase tracking-[0.2em] text-[10px]">
                Network Slug
              </TableHead>
              <TableHead className="font-black text-gold uppercase tracking-[0.2em] text-[10px]">
                Deployment Status
              </TableHead>
              <TableHead className="font-black text-gold uppercase tracking-[0.2em] text-[10px]">
                Last Intel Update
              </TableHead>
              <TableHead className="text-right font-black text-gold uppercase tracking-[0.2em] text-[10px]">
                Operations
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-64">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin border-4 border-charcoal-light border-t-gold" />
                    <span className="text-[10px] text-gold font-black uppercase tracking-[0.3em]">
                      Decoding Repository...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-64 "
                >
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <ShieldAlert size={48} className="text-slate-600" />
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Repository Vacant. No objectives localized.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page: Page) => (
                <TableRow
                  key={page._id || Math.random().toString()}
                  className="hover:bg-ink/30 border-charcoal-light transition-colors group"
                >
                  <TableCell className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-ink border border-charcoal-light flex items-center justify-center text-gold group-hover:border-gold transition-colors shadow-inner">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-sm uppercase tracking-widest">
                          {page.title}
                        </span>
                        <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                          <Globe size={10} className="text-olive" />
                          <span>/{page.slug}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                    /{page.slug}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span
                        className={`w-2 h-2 rounded-full ${page.isPublished ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-600"}`}
                       />
                       <span
                         className={`text-[9px] font-black uppercase tracking-widest ${
                           page.isPublished
                             ? "text-emerald-500"
                             : "text-slate-500"
                         }`}
                       >
                         {page.isPublished ? "Active" : "Undercover"}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 bg-charcoal-light/50 text-slate-400 hover:text-gold hover:bg-gold/10 transition-all rounded-none border border-transparent hover:border-gold/30"
                        onClick={() => router.push(`/admin/pages/${page._id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 bg-charcoal-light/50 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-none border border-transparent hover:border-red-500/30"
                        disabled={deletingId === page._id}
                        onClick={() =>
                          page._id &&
                          handleDelete(page._id, page.title || "Untitled")
                        }
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Intel */}
      <div className="flex items-center gap-3 opacity-40">
         <Terminal size={14} className="text-gold" />
         <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Sector Access Level: Authorized Level-4</span>
      </div>
    </div>
  );
}

export default function PagesPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-ink flex items-center justify-center">
          <div className="h-10 w-10 animate-spin border-4 border-charcoal-light border-t-gold" />
       </div>
    }>
      <PagesPageContent />
    </Suspense>
  );
}
