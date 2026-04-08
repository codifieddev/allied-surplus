"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash,
  Mail,
  Search,
  Clock,
  User,
  Shield,
  Activity,
  Terminal,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { deleteUser, fetchUsers } from "@/lib/store/users/usersThunk";
import { cn } from "@/lib/utils";

function UsersPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { adminusers, loading } = useAppSelector(
    (state) => state.adminUsers,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      fetchUsers({
        role: "admin",
      }),
    );
  }, [dispatch]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`CONFIRM DECOMMISSIONING OF COMMAND STAFF: "${name}"?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`REVOKING ACCESS FOR ${name}...`);

    try {
      const resultAction = await dispatch(deleteUser(id));

      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success(`COMMAND STAFF ${name} DECOMMISSIONED.`, { id: toastId });
      } else {
        toast.error(
          (resultAction.payload as string) || "OPERATION FAILURE.",
          { id: toastId },
        );
      }
    } catch {
      toast.error("SYSTEM ERROR DURING DECOMMISSIONING.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/users/${id}/edit`);
  };

  const handleAdd = () => {
    router.push("/admin/users/new");
  };

  const filteredUsers = useMemo(() => {
    return (adminusers || []).filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [adminusers, searchQuery]);

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gold opacity-60">
            <Terminal size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
              Authorization Intel: Console 07
            </span>
          </div>
          <h1 className="text-5xl font-head font-black text-white uppercase tracking-tighter leading-none">
            Command <span className="text-gold/80 italic">Staff</span>
          </h1>
          <p className="text-sm font-medium text-white/40 italic flex items-center gap-2">
            Managing elevated clearance levels and tactical operator profiles on the{" "}
            <span className="text-gold font-bold uppercase tracking-widest text-[10px] ring-1 ring-gold/20 px-2 py-0.5 bg-gold/5 rounded-sm italic">
              Ironforge Backbone
            </span>.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center text-white/20 group-focus-within:text-gold transition-colors pointer-events-none">
              <Search size={16} />
            </div>
            <Input
              placeholder="Scan operator records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-full md:w-64 bg-charcoal border-white/5 rounded-sm focus:border-gold/30 transition-all shadow-inner text-[13px] font-bold italic tracking-wider text-white uppercase"
            />
          </div>

          <Button
            onClick={handleAdd}
            className="rounded-sm bg-olive text-white h-10 px-6 gap-2 shadow-xl shadow-olive/10 border border-olive/30 hover:bg-olive-lt transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest italic"
          >
            <Plus size={16} strokeWidth={3} /> Commission Operator
          </Button>
        </div>
      </section>

      {/* DATA TABLE */}
      <div className="rounded-sm border border-white/5 bg-charcoal overflow-hidden shadow-2xl shadow-black/40 relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Shield size={120} className="text-white" />
        </div>

        <Table>
          <TableHeader className="bg-ink/40 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="font-black text-white/20 uppercase tracking-[0.2em] text-[10px] h-14 px-6 italic">
                Operator Profile
              </TableHead>
              <TableHead className="font-black text-white/20 uppercase tracking-[0.2em] text-[10px] h-14 px-6 italic">
                Clearance & Status
              </TableHead>
              <TableHead className="font-black text-white/20 uppercase tracking-[0.2em] text-[10px] h-14 px-6 italic text-center">
                Command Right
              </TableHead>
              <TableHead className="font-black text-white/20 uppercase tracking-[0.2em] text-[10px] h-14 px-6 italic">
                Commissioned
              </TableHead>
              <TableHead className="text-right font-black text-white/20 uppercase tracking-[0.2em] text-[10px] h-14 px-6 italic">
                Operations
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-64">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-white/5 border-t-gold rounded-sm animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">
                      Synchronizing Operator Network...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-64 text-white/20"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Activity className="h-12 w-12 opacity-5" />
                    <p className="font-black text-[10px] uppercase tracking-[0.3em] italic">
                      No matching command staff detected.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={String(user._id)}
                  className="group hover:bg-white/5 border-white/5 transition-all duration-300"
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-sm bg-olive/10 border border-olive/30 flex items-center justify-center text-gold font-head font-black text-lg shadow-inner ring-1 ring-gold/5 group-hover:bg-olive group-hover:text-white transition-all">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-black text-white text-[13px] uppercase tracking-wider group-hover:text-gold transition-colors italic">
                          {user.name}
                        </span>
                        <div className="flex items-center gap-2 text-white/20 group-hover:text-white/40 transition-colors">
                           <Mail size={10} className="text-gold/40" />
                           <span className="text-[9px] font-black uppercase tracking-widest italic">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Shield size={12} className="text-gold" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white italic">
                          {user.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-2 w-2 rounded-full", user.status === 'active' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40 animate-pulse' : 'bg-white/10')} />
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest italic",
                          user.status === "active" ? "text-emerald-400" : "text-white/20"
                        )}>
                          {user.status || "ACTIVE"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <div className="flex justify-center">
                    {user.isTenantOwner ? (
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-sm bg-gold/10 border border-gold/30 shadow-lg shadow-gold/5 ring-1 ring-gold/20">
                        <Shield size={12} className="text-gold" />
                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] italic">Owner</span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] italic">Standard</span>
                    )}
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3 text-white/40">
                      <Clock size={12} className="text-white/20" />
                      <span className="text-[11px] font-bold italic tracking-wide">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "PENDING"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(String(user._id))}
                        className="h-9 w-9 rounded-sm bg-white/5 border border-white/10 text-white/30 hover:text-gold hover:border-gold/40 hover:bg-gold/10 transition-all shadow-xl"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === user._id}
                        onClick={() =>
                          handleDelete(String(user._id), user.name)
                        }
                        className="h-9 w-9 rounded-sm bg-white/5 border border-white/10 text-white/30 hover:text-red hover:border-red/40 hover:bg-red/10 transition-all shadow-xl"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER INFO */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-sm border border-white/5 bg-charcoal px-8 py-5 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 bg-gold shadow-[0_0_10px_rgba(201,162,39,0.3)]" />
          <div className="flex items-center gap-4">
             <Activity size={18} className="text-gold" />
             <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">
              Active Command Units: <span className="text-white ml-2 tabular-nums">{adminusers.length}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 bg-ink/60 border border-white/5 rounded-sm">
           <Zap size={14} className="text-gold" />
           <p className="text-[9px] font-black text-white/40 italic uppercase tracking-widest leading-relaxed max-w-sm">
            Command operators have full system privileges based on their designated clearance level. Unauthorized access is traced via the backbone grid.
           </p>
        </div>
      </section>
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-ink">
          <div className="flex flex-col items-center gap-6">
            <div className="h-16 w-16 border-4 border-white/5 border-t-gold rounded-sm animate-spin shadow-2xl shadow-gold/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/40 italic animate-pulse">
              Authenticating Command Link...
            </span>
          </div>
        </div>
      }
    >
      <UsersPageContent />
    </Suspense>
  );
}
