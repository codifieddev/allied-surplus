"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchOrders, selectAdminOrders, selectAdminOrdersLoading } from "@/lib/store/features/adminOrdersSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  MoreVertical,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  User,
  Calendar,
  DollarSign,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAdminOrders);
  const loading = useAppSelector(selectAdminOrdersLoading);
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter(o => 
    o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-head font-black text-white uppercase tracking-tighter leading-none">Orders </h1>
           <p className="text-sm text-white/40 font-medium italic flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <Target size={12} className="text-gold" /> Monitoring procurement pipelines and mission fulfillment.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <button className="h-12 px-6 bg-white/5 border border-white/10 text-white/40 font-head font-bold text-xs uppercase tracking-widest rounded-sm hover:text-white hover:border-gold/30 transition-all flex items-center gap-2 group">
              <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Export Data Stream
           </button>
           <button className="h-12 px-8 bg-red text-white hover:bg-red-lt font-head font-bold text-xs uppercase tracking-widest rounded-sm transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-red/20">
              <ShoppingCart size={18} /> Direct Provisioning
           </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Awaiting Logistics", count: orders.filter(o => o.status === 'processing').length, icon: Clock, color: "text-gold", bg: "bg-gold/10", border: "border-gold/30" },
          { label: "Mission Complete", count: orders.filter(o => o.status === 'completed').length, icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
          { label: "Operational Volume", count: `$${orders.reduce((acc, o) => acc + (o.total || 0), 0).toLocaleString()}`, icon: Zap, color: "text-white/40", bg: "bg-white/5", border: "border-white/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-charcoal border border-white/5 p-6 rounded-sm shadow-2xl shadow-black/40 flex items-center gap-6 group hover:border-gold/20 transition-all">
             <div className={cn("h-14 w-14 rounded-sm flex items-center justify-center border ring-1 ring-white/0 group-hover:ring-gold/10 transition-all shadow-inner", stat.bg, stat.color, stat.border)}>
                <stat.icon size={24} strokeWidth={2.5} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 leading-none mb-2 group-hover:text-gold/50 transition-colors uppercase italic">{stat.label}</p>
                <p className="text-3xl font-head font-black text-white tracking-tighter leading-none">{stat.count}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row items-center gap-6 bg-charcoal p-5 rounded-sm border border-white/5 shadow-2xl shadow-black/60">
         <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-gold transition-colors" />
            <input 
               placeholder="INTERCEPT ORDER ID, SUBJECT OR COMMS RELAY..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-12 pr-4 h-12 bg-ink border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-3 w-full lg:w-auto">
            <button className="h-12 px-6 flex-1 lg:flex-none border border-white/10 text-white/40 hover:text-white hover:border-gold/30 font-head font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 italic">
               <Filter size={16} /> Filter Parameters
            </button>
            <div className="h-6 w-px bg-white/5 mx-2 hidden lg:block" />
            <button className="h-12 px-6 border border-white/5 text-white/20 font-black text-[9px] uppercase tracking-[0.3em] hover:text-gold transition-colors italic">
               Archive Hub
            </button>
         </div>
      </div>

      {/* Table Container */}
      <div className="bg-charcoal border border-white/5 rounded-sm overflow-hidden shadow-2xl shadow-black/80">
        <Table>
          <TableHeader className="bg-ink/60 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-white/5 h-16">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 px-8">Mission Unit</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Acquisition Target</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Operational Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Valuation</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Deployment Time</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 text-right px-8">Intel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={6} className="h-64 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic animate-pulse">Syncing Mission Logs...</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={6} className="h-96 text-center p-12">
                   <div className="flex flex-col items-center gap-6 text-white/10 italic">
                      <div className="h-24 w-24 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02] shadow-inner">
                         <ShoppingCart size={48} strokeWidth={1} className="opacity-40" />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-[0.3em] leading-relaxed">No purchase records identified in current sector.</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((ord) => (
                <TableRow key={ord._id} className="group border-white/5 hover:bg-white/[0.02] transition-all duration-300">
                  <TableCell className="px-8 py-8">
                     <div className="flex flex-col space-y-1.5 overflow-hidden">
                        <span className="text-sm font-bold text-white tracking-tight leading-none group-hover:text-gold transition-colors uppercase italic truncate">{ord.orderNumber}</span>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em] italic">Log: 0{ord._id.slice(-4)} // Tactical</span>
                     </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-sm bg-olive/10 border border-olive/30 flex items-center justify-center text-white/30 group-hover:bg-olive group-hover:text-white transition-all ring-1 ring-gold/5">
                          <User size={16} />
                       </div>
                       <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-black text-white leading-tight uppercase truncate">{ord.customer?.name}</span>
                          <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider italic truncate">{ord.customer?.email}</span>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                       "inline-flex items-center gap-2.5 px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest border italic",
                       ord.status === 'processing' 
                         ? "bg-gold/10 text-gold border-gold/30" 
                         : ord.status === 'completed'
                         ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                         : "bg-white/5 text-white/30 border-white/10"
                    )}>
                      <div className={cn("h-1.5 w-1.5 rounded-full ring-2 ring-white/0 group-hover:ring-current/20", ord.status === 'processing' ? "bg-gold animate-pulse" : ord.status === 'completed' ? "bg-emerald-400" : "bg-white/30")} />
                      {ord.status}
                    </div>
                  </TableCell>
                  <TableCell>
                     <span className="text-xl font-head font-black text-white tracking-tighter tabular-nums">${ord.total}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-white/30 italic">
                       <Calendar size={14} className="text-gold/50" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex items-center justify-end gap-2">
                       <button className="h-10 w-10 rounded-sm border border-white/5 bg-white/[0.03] text-white/20 hover:text-white hover:border-gold/30 hover:bg-gold/10 transition-all flex items-center justify-center group/btn shadow-xl" title="Deep View">
                          <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                       </button>
                       <button className="h-10 w-10 rounded-sm border border-white/5 bg-white/[0.03] text-white/20 hover:text-white hover:border-gold/30 hover:bg-gold/10 transition-all flex items-center justify-center group/btn shadow-xl" title="Tactical Options">
                          <MoreVertical size={18} className="group-hover/btn:scale-110 transition-transform" />
                       </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
