"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { UserForm } from "@/components/admin/users/UserForm";
import { toast } from "sonner";
import { fetchUsers, updateUser } from "@/lib/store/users/usersThunk";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  
  const { adminusers, loading: fetchLoading } = useAppSelector(
    (state) => state.adminUsers
  );

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (adminusers.length > 0) {
      const user = adminusers.find((u) => String(u._id) === String(id));
      if (user) {
        setUserData(user);
      } else {
         dispatch(fetchUsers({ role: "admin" }));
      }
    } else {
      dispatch(fetchUsers({ role: "admin" }));
    }
  }, [adminusers, id, dispatch]);

  useEffect(() => {
    if (!userData && adminusers.length > 0) {
      const user = adminusers.find((u) => String(u._id) === String(id));
      if (user) {
        setUserData(user);
      }
    }
  }, [adminusers, id, userData]);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    const toastId = toast.loading("SYNCHRONIZING OPERATOR DATA...");
    try {
      const result = await dispatch(
        updateUser({
          id,
          userData: formData,
        }),
      );
      if (updateUser.fulfilled.match(result)) {
        toast.success("OPERATOR DATA SYNCHRONIZED SUCCESSFULLY.", { id: toastId });
        router.push("/admin/users");
      } else {
        toast.error((result.payload as string) || "SYNCHRONIZATION FAILURE.", { id: toastId });
      }
    } catch (err) {
      toast.error("SYSTEM MALFUNCTION DURING SYNCHRONIZATION.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading && !userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 bg-ink/10">
        <div className="h-16 w-16 border-4 border-white/5 border-t-gold rounded-sm animate-spin shadow-2xl shadow-gold/20" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/40 italic animate-pulse">
          Retrieving Operator Intel...
        </span>
      </div>
    );
  }

  if (!userData && !fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 bg-ink/10">
        <div className="text-center space-y-4">
          <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.4em] italic">
            Operator node not detected in primary database.
          </p>
          <button 
            onClick={() => router.push('/admin/users')}
            className="text-[10px] font-black text-gold uppercase tracking-[0.4em] hover:text-white transition-colors underline underline-offset-8 decoration-gold/30 hover:decoration-white/30 italic"
          >
            Return to Command Center
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <UserForm
        initialData={userData}
        onSubmit={handleSubmit}
        loading={loading}
        title={`Edit Operator: ${userData?.name}`}
      />
    </div>
  );
}
