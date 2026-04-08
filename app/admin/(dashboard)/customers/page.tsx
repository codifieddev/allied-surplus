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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Edit,
  Trash,
  Mail,
  Phone,
  Search,
  MapPin,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Shield,
  Terminal,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { deleteUser, fetchUsers } from "@/lib/store/users/usersThunk";
import { cn } from "@/lib/utils";

function CustomersPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { customers, loading, totalCustomers } = useAppSelector(
    (state) => state.adminUsers,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentPage = Number(searchParams.get("currentPage")) || 1;
  const itemsPerPage = Number(searchParams.get("itemsPerPage")) || 10;

  const totalPages = Math.max(
    1,
    Math.ceil((totalCustomers || 0) / itemsPerPage),
  );

  const updateQueryParams = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    dispatch(
      fetchUsers({
        role: "customer",
        itemsPerPage,
        currentPage,
      }),
    );
  }, [dispatch, currentPage, itemsPerPage]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Confirm decommissioning of individual: "${name}"?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`Processing removal of ${name}...`);

    try {
      const resultAction = await dispatch(deleteUser(id));

      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success(`Personnel node ${name} removed`, { id: toastId });
        dispatch(
          fetchUsers({
            role: "customer",
            itemsPerPage,
            currentPage,
          }),
        );
      } else {
        toast.error(
          (resultAction.payload as string) || "Operation failed",
          { id: toastId },
        );
      }
    } catch {
      toast.error("System error during decommissioning", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(
      `/admin/customers/${id}/edit?role=customer&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`,
    );
  };

  const handleAdd = () => {
    router.push("/admin/customers/new");
  };

  const filteredCustomers = useMemo(() => {
    return (customers || []).filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery)),
    );
  }, [customers, searchQuery]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updateQueryParams({ currentPage: page });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    updateQueryParams({
      itemsPerPage: Number(e.target.value),
      currentPage: 1,
    });
  };

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gold opacity-60">
            <Terminal size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
              Personnel Intel: Registry 04
            </span>
          </div>
          <h1 className="text-5xl font-head font-black text-white uppercase tracking-tighter leading-none">
            Personnel <span className="text-gold/80 italic">Command</span>
          </h1>
          <p className="text-sm font-medium text-white/40 italic flex items-center gap-2">
            Managing authenticated asset profiles and deployment credentials within the{" "}
            <span className="text-gold font-bold uppercase tracking-widest text-[10px] ring-1 ring-gold/20 px-2 py-0.5 bg-gold/5 rounded-sm italic">
              Ironforge Registry
            </span>.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center text-white/20 group-focus-within:text-gold transition-colors pointer-events-none">
              <Search size={16} />
            </div>
            <Input
              placeholder="Filter intel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-full md:w-64 bg-charcoal border-white/5 rounded-sm focus:border-gold/30 transition-all shadow-inner text-[13px] font-bold italic tracking-wider text-white"
            />
          </div>

          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="h-10 rounded-sm border border-white/5 bg-charcoal px-3 text-[10px] font-black uppercase tracking-widest text-white/40 focus:border-gold/30 outline-none transition-all cursor-pointer"
          >
            <option value={10}>10 per scan</option>
            <option value={25}>25 per scan</option>
            <option value={50}>50 per scan</option>
          </select>

          <Button
            onClick={handleAdd}
            className="rounded-sm bg-olive text-white h-10 px-6 gap-2 shadow-xl shadow-olive/10 border border-olive/30 hover:bg-olive-lt transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest italic"
          >
            <Plus size={16} strokeWidth={3} /> Register Personnel
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
                Personnel Profile
              </TableHead>
              <TableHead className="font-black text-white/20 uppercase tracking-[0.2em] text-[10px] h-14 px-6 italic">
                Communication Relay
              </TableHead>
              <TableHead className="font-black text-white/20 uppercase tracking-[0.2em] text-[10px] h-14 px-6 italic text-center">
                Supply Nodes
              </TableHead>
              <TableHead className="font-black text-white/20 uppercase tracking-[0.2em] text-[10px] h-14 px-6 italic">
                Activation Date
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
                      Synchronizing Registry Intelligence...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-64 text-white/20"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Activity className="h-12 w-12 opacity-5" />
                    <p className="font-black text-[10px] uppercase tracking-[0.3em] italic">
                      No matching personnel nodes detected.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={String(customer._id)}
                  className="group hover:bg-white/5 border-white/5 transition-all duration-300"
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-sm bg-olive/10 border border-olive/30 flex items-center justify-center text-gold font-head font-black text-lg shadow-inner ring-1 ring-gold/5 group-hover:bg-olive group-hover:text-white transition-all">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-black text-white text-[13px] uppercase tracking-wider group-hover:text-gold transition-colors italic">
                          {customer.name}
                        </span>
                        <span className="text-[9px] text-white/20 font-black uppercase tracking-widest italic">
                          ID: {String(customer._id).slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-white/40">
                        <Mail size={12} className="text-gold opacity-40" />
                        <span className="text-[11px] font-bold tracking-wide italic">
                          {customer.email}
                        </span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-3 text-white/40">
                          <Phone size={12} className="text-gold opacity-40" />
                          <span className="text-[11px] font-bold tracking-wide italic">
                            {customer.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2 px-3 py-1 bg-ink/40 border border-white/10 rounded-sm">
                        <MapPin size={10} className="text-gold" />
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">
                          {customer.addresses?.length || 0}
                        </span>
                      </div>
                      <span className="text-[8px] font-bold text-white/10 uppercase tracking-[0.2em] italic">
                        Deployment Zones
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3 text-white/40">
                      <Clock size={12} className="text-white/20" />
                      <span className="text-[11px] font-bold italic tracking-wide">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(String(customer._id))}
                        className="h-9 w-9 rounded-sm bg-white/5 border border-white/10 text-white/30 hover:text-gold hover:border-gold/40 hover:bg-gold/10 transition-all shadow-xl"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === customer._id}
                        onClick={() =>
                          handleDelete(String(customer._id), customer.name)
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

      {/* FOOTER PAGINATION */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-sm border border-white/5 bg-charcoal px-8 py-5 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 bg-gold/40 rounded-full shadow-[0_0_10px_rgba(201,162,39,0.3)]" />
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">
            Total Registry Nodes:{" "}
            <span className="text-white font-black ml-2 tabular-nums">
              {totalCustomers || 0}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-10 px-6 rounded-sm bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 hover:border-gold/30 disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={16} className="mr-2" strokeWidth={3} /> Previous Sector
          </Button>

          <div className="px-6 py-2 bg-ink/60 border border-white/10 rounded-sm text-[11px] font-black text-gold uppercase tracking-[0.4em] italic shadow-inner">
            Sector {currentPage} of {totalPages}
          </div>

          <Button
            variant="ghost"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-10 px-6 rounded-sm bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 hover:border-gold/30 disabled:opacity-20 transition-all"
          >
            Next Sector <ChevronRight size={16} className="ml-2" strokeWidth={3} />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-ink">
          <div className="flex flex-col items-center gap-6">
            <div className="h-16 w-16 border-4 border-white/5 border-t-gold rounded-sm animate-spin shadow-2xl shadow-gold/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/40 italic animate-pulse">
              Initializing Intelligence Link...
            </span>
          </div>
        </div>
      }
    >
      <CustomersPageContent />
    </Suspense>
  );
}
