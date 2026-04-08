"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { CustomerForm } from "@/components/admin/customers/CustomerForm";
import { toast } from "sonner";
import { addUser } from "@/lib/store/users/usersThunk";

export default function NewCustomerPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("IDENTIFICATION DATA REQUIRED: NAME, EMAIL, AND ACCESS CODE.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("PROCESSING PERSONNEL REGISTRATION...");
    try {
      const result = await dispatch(
        addUser({
          userData: formData,
          role: "customer",
        }),
      );
      if (addUser.fulfilled.match(result)) {
        toast.success("PERSONNEL REGISTERED SUCCESSFULLY.", { id: toastId });
        router.push("/admin/customers");
      } else {
        toast.error((result.payload as string) || "REGISTRATION FAILURE.", { id: toastId });
      }
    } catch (err) {
      toast.error("SYSTEM MALFUNCTION DURING REGISTRATION.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <CustomerForm
        onSubmit={handleSubmit}
        loading={loading}
        title="Register New Personnel"
      />
    </div>
  );
}
