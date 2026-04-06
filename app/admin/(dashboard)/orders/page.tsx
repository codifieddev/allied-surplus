"use client";

import { useEffect, useState, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchOrders } from "@/lib/store/features/adminOrdersSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Database,
  Terminal,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RootState } from "@/lib/store/store";

const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  'pending': { label: 'Awaiting Intel', color: 'amber-500', icon: Clock },
  'processing': { label: 'Operational', color: 'blue-500', icon: Zap },
  'shipped': { label: 'In Transit', color: 'purple-500', icon: Truck },
  'delivered': { label: 'Target Reached', color: 'emerald-500', icon: CheckCircle2 },
  'cancelled': { label: 'Aborted', color: 'red-500', icon: AlertCircle },
};

function OrdersPageContent() {
  const dispatch = useAppDispatch();
  const { items: orders, loading } = useAppSelector((state: RootState) => state.adminOrders);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((ord: any) => 
    ord.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ord.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ord.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Tactical Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Logistics <span className="text-gold">Operations</span></h1>
           <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] italic flex items-center gap-2">
              <Database size={12} className="text-gold" /> Real-time tracking of supply chain deployment and acquisition.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <button className="h-12 px-8 bg-charcoal border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3">
              <Download size={16} /> Export manifest
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-charcoal p-5 rounded-none border border-white/5 shadow-2xl shadow-black/40">
         <div className="relative w-full sm:w-[400px] group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={16} />
           <input
             placeholder="IDENTIFY ORDER BY SERIAL OR AGENT..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full h-11 pl-12 pr-4 bg-ink border border-white/10 rounded-sm text-xs font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:border-gold outline-none"
           />
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
               <Filter size={14} /> Filter Logic Active
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] font-black text-gold uppercase tracking-widest">
               <Zap size={14} fill="currentColor" /> {filteredOrders.length} TRANSMISSIONS
            </div>
         </div>
      </div>

      {/* Orders Table */}
      <div className="bg-charcoal border border-white/5 rounded-none overflow-hidden shadow-2xl shadow-black/80">
        <Table>
          <TableHeader className="bg-ink/60 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-none h-16">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 px-8">Order Designation</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Operational Agent</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Mission Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Asset Value</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">Timestamp</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.25em] text-white/20 px-8">Intelligence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                 <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic animate-pulse">Syncing Mission Data...</span>
                    </div>
                 </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                 <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-10 italic">
                       <AlertCircle size={48} />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em]">No Operational Logs Detected</span>
                    </div>
                 </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((ord: any) => {
                const status = STATUS_CONFIG[ord.status] || STATUS_CONFIG['pending'];
                return (
                  <TableRow key={ord._id} className="border-white/5 hover:bg-white/[0.02] transition-all duration-300 group">
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col">
                         <span className="text-sm font-black text-white uppercase tracking-tight group-hover:text-gold transition-colors">{ord.orderNumber}</span>
                         <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">ID: {ord._id.slice(-8)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">{ord.customer?.name}</span>
                        <span className="text-[9px] font-bold text-white/20 lowercase tracking-widest">{ord.customer?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <status.icon size={12} className={cn("text-current opacity-60", `text-${status.color}`)} />
                         <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-none shadow-lg items-center gap-2", 
                            `border-${status.color}/30 bg-${status.color}/5 text-${status.color}`
                         )}>
                            {status.label}
                         </span>
                      </div>
                    </TableCell>
                    <TableCell>
                       <span className="text-sm font-black text-white tracking-widest">${ord.total}</span>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 text-white/40">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(ord.createdAt).toLocaleDateString()}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                       <Link href={`/admin/orders/${ord._id}`}>
                          <button className="h-10 px-6 bg-ink border border-white/10 text-white/20 hover:text-gold hover:border-gold/30 transition-all flex items-center justify-center gap-2 group/btn">
                             <Eye size={16} />
                             <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">Analyze</span>
                          </button>
                       </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Intel */}
      <div className="flex items-center gap-3 opacity-40">
         <Terminal size={14} className="text-gold" />
         <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">Logistics Terminal: Secure Link | Stream Encryption: AES-256</span>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen bg-ink">
       <Suspense fallback={
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
             <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Initializing Tactical Hub...</span>
          </div>
       }>
          <OrdersPageContent />
       </Suspense>
    </div>
  );
}
