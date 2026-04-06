"use client";

import React, { useState } from "react";
import { PageEditor } from "@/components/admin/cms/PageEditor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Page } from "@/lib/store/pages/pageType";
import { createPageThunk } from "@/lib/store/pages/pageThunk";
import { useAppDispatch } from "@/lib/store/hooks";

export default function NewPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleSave = async (pageData: Page) => {
    setLoading(true);
    const toastId = toast.loading("INITIATING NEW DEPLOYMENT...");

    try {
      const resultAction = await dispatch(createPageThunk(pageData));
      if (createPageThunk.fulfilled.match(resultAction)) {
        toast.success("OBJECTIVE FORGED SUCCESSFULLY", { id: toastId });
        router.push("/admin/pages");
      } else {
        toast.error(
          `FORGE FAILED: ${resultAction.payload || "ACCESS DENIED"}`,
          { id: toastId },
        );
      }
    } catch (err) {
      toast.error("NETWORK INTERFERENCE DETECTED.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <PageEditor onSave={handleSave} isLoading={loading} />
    </div>
  );
}
