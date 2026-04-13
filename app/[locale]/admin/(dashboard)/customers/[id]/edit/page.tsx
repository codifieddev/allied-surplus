"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CustomerForm } from "@/components/admin/customers/CustomerForm";
import { toast } from "sonner";
import { fetchUsers, updateUser } from "@/lib/store/users/usersThunk";

export default function EditCustomerPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("currentPage")) || 1;
  const itemsPerPage = Number(searchParams.get("itemsPerPage")) || 10;
  const role = searchParams.get("role") || "customer";
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const {
    customers,
    loading: storeLoading,
    hasFetchedCustomers,
  } = useAppSelector((state) => state.adminUsers);

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasFetchedCustomers) {
      dispatch(fetchUsers({ role, currentPage, itemsPerPage }));
    }
  }, [hasFetchedCustomers, dispatch, role, currentPage, itemsPerPage]);

  useEffect(() => {
    if (hasFetchedCustomers) {
      const found = customers.find((c) => String(c._id) === String(id));
      if (found) {
        setCustomer(found);
      } else {
        toast.error("PERSONNEL NODE NOT DETECTED IN LOCAL REGISTRY.");
        router.push("/admin/customers");
      }
    }
  }, [id, customers, hasFetchedCustomers, router]);

  const handleSubmit = async (formData: any) => {
    if (!formData.name || !formData.email) {
      toast.error("IDENTIFICATION DATA REQUIRED: NAME AND EMAIL.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("SYNCHRONIZING PERSONNEL DATA...");
    try {
      const result = await dispatch(
        updateUser({ id: id as string, userData: formData }),
      );
      if (updateUser.fulfilled.match(result)) {
        toast.success("PERSONNEL DATA SYNCHRONIZED SUCCESSFULLY.", { id: toastId });
        router.push(
          `/admin/customers?role=${role}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`,
        );
      } else {
        toast.error((result.payload as string) || "SYNCHRONIZATION FAILURE.", { id: toastId });
      }
    } catch (err) {
      toast.error("SYSTEM MALFUNCTION DURING SYNCHRONIZATION.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!hasFetchedCustomers || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 bg-ink/10">
        <div className="h-16 w-16 border-4 border-white/5 border-t-gold rounded-sm animate-spin shadow-2xl shadow-gold/20" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/40 italic animate-pulse">
          Retrieving Personnel Intel...
        </span>
      </div>
    );
  }

  return (
    <div className="py-12">
      <CustomerForm
        initialData={customer}
        onSubmit={handleSubmit}
        loading={loading}
        title="Modify Personnel Profile"
      />
    </div>
  );
}
