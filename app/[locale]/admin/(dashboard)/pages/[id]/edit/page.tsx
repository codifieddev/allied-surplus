"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageEditor } from "@/components/admin/cms/PageEditor";
import { toast } from "sonner";
import { Page } from "@/lib/store/pages/pageType";
import { updatePageThunk } from "@/lib/store/pages/pageThunk";
import { useAppDispatch } from "@/lib/store/hooks";

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/pages/${id}`);
        const data = await response.json();
        if (data.success) {
          setPage(data.page);
        } else {
          toast.error("REMOTE INTEL ACCESS FAILED");
          router.push("/admin/pages");
        }
      } catch (err) {
        toast.error("NETWORK INTERFERENCE DETECTED.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPage();
  }, [id, router]);

  const handleUpdate = async (pageData: Page) => {
    setSaving(true);
    const toastId = toast.loading("COMMITTING UPDATES...");

    try {
      const resultAction = await dispatch(updatePageThunk({ id: id as string, pageData }));
      if (updatePageThunk.fulfilled.match(resultAction)) {
        toast.success("OBJECTIVE RE-FORGED SUCCESSFULLY", { id: toastId });
        router.push("/admin/pages");
      } else {
        toast.error(`COMMISSION FAILED: ${resultAction.payload || "ACCESS DENIED"}`, { id: toastId });
      }
    } catch (err) {
      toast.error("NETWORK INTERFERENCE DETECTED.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 bg-ink">
        <div className="h-10 w-10 animate-spin border-4 border-charcoal-light border-t-gold" />
        <p className="text-gold font-bold uppercase tracking-[0.3em] text-[10px]">LOCALIZING REPOSITORY DATA...</p>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="container mx-auto py-10 px-4">
      <PageEditor initialData={page} onSave={handleUpdate} isLoading={saving} />
    </div>
  );
}
