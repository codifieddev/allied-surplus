"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  Download,
  Edit,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  ShieldCheck,
  Terminal,
  Truck,
  User,
  Zap,
  CheckCircle2,
  AlertCircle,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { id: "pending", label: "Awaiting Intel", color: "amber-500", icon: Clock },
  { id: "processing", label: "Operational", color: "blue-500", icon: Zap },
  { id: "shipped", label: "In Transit", color: "purple-500", icon: Truck },
  {
    id: "delivered",
    label: "Target Reached",
    color: "emerald-500",
    icon: CheckCircle2,
  },
  { id: "cancelled", label: "Aborted", color: "red-500", icon: AlertCircle },
];

function OrderDetailPageContent() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`/api/ecommerce/orders/${id}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
        setNotes(data.notes || "");
      } catch (err) {
        toast.error("COMMUNICATIONS FAILURE: Hub access denied.");
        router.push("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id, router]);

  const handleUpdate = async () => {
    setUpdating(true);
    const tId = toast.loading("SYNCHRONIZING ORDER STATUS...");
    try {
      const res = await fetch(`/api/ecommerce/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("INTEL UPDATED", { id: tId });
    } catch (err) {
      toast.error("UPDATE TERMINATED", { id: tId });
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic animate-pulse">
          Accessing Secure Manifest...
        </span>
      </div>
    );
  }

  const currentStatus =
    STATUS_OPTIONS.find((s) => s.id === status) || STATUS_OPTIONS[0];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-l-4 border-gold pl-6 py-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/orders")}
              className="text-white/20 hover:text-gold transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
              Order <span className="text-gold">{order.orderNumber}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest italic">
              <Terminal size={12} className="text-gold/50" />
              Manifest Status:
            </div>
            <div
              className={cn(
                "px-3 py-0.5 text-[8px] font-black uppercase tracking-widest bg-ink border",
                `border-${currentStatus.color}/40 text-${currentStatus.color}`,
              )}
            >
              {currentStatus.label}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="h-12 px-8 bg-charcoal border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3 shadow-xl">
            <Download size={16} /> Manifest PDF
          </button>
          <button
            disabled={updating}
            onClick={handleUpdate}
            className="h-12 px-10 bg-olive text-white font-black text-[10px] uppercase tracking-widest hover:bg-olive-lt transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-olive/20"
          >
            {updating ? (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Apply Intel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Order Details & Items */}
        <div className="lg:col-span-8 space-y-8">
          {/* Mission Items */}
          <div className="bg-charcoal border border-white/5 p-8 space-y-6 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-4 border-l-2 border-gold pl-4">
              <Package size={18} className="text-gold" />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Deployment Manifest
              </h3>
            </div>

            <div className="space-y-4">
              {order.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 bg-ink/40 border border-white/5 rounded-none group hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 bg-ink border border-white/10 rounded-none overflow-hidden relative grayscale-[0.5] group-hover:grayscale-0 transition-all">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-0 left-0 bg-gold text-ink text-[10px] font-black px-1.5 py-0.5">
                        x{item.quantity}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase tracking-widest">
                        {item.name}
                      </span>
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">
                        VARIANT: {item.variantTitle || "DEFAULT"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-white tracking-widest">
                      ${item.price * item.quantity}
                    </div>
                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">
                      ${item.price} UNIT
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest px-4">
                <span>Deployment Subtotal</span>
                <span>${order.subtotal || order.total}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest px-4">
                <span>Logistics / Shipping</span>
                <span>${order.shippingCost || 0}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-white uppercase tracking-tighter bg-ink/40 p-6 border border-gold/10">
                <span className="flex items-center gap-3">
                  <ShieldCheck className="text-gold" /> Total Asset Value
                </span>
                <span className="text-gold">${order.total}</span>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-charcoal border border-white/5 p-8 space-y-6 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-4 border-l-2 border-gold pl-4">
              <Terminal size={18} className="text-gold" />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Operational Notes
              </h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 bg-ink border border-white/10 rounded-none p-5 text-xs font-bold text-white uppercase tracking-widest focus:border-gold outline-none resize-none placeholder:text-white/5"
              placeholder="ENTER LOG NOTES FOR POST-MISSION ANALYSIS..."
            />
          </div>
        </div>

        {/* Sidebar: Status & Customer */}
        <div className="lg:col-span-4 space-y-8">
          {/* Status Control */}
          <div className="bg-charcoal border border-white/5 p-8 space-y-6 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-4 border-l-2 border-gold pl-4">
              <Edit size={18} className="text-gold" />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Status Control
              </h3>
            </div>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setStatus(opt.id)}
                  className={cn(
                    "w-full p-4 border rounded-none flex items-center justify-between transition-all group",
                    status === opt.id
                      ? `bg-white/[0.03] border-${opt.color}/40 text-white shadow-xl`
                      : "bg-ink border-white/5 text-white/20 hover:border-white/10 hover:text-white/40",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <opt.icon
                      size={14}
                      className={
                        status === opt.id ? `text-${opt.color}` : "text-current"
                      }
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {opt.label}
                    </span>
                  </div>
                  {status === opt.id && (
                    <Zap size={14} className="text-gold fill-gold" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Personnel Intel */}
          <div className="bg-charcoal border border-white/5 p-8 space-y-6 shadow-2xl shadow-black/40 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-white/5 transform rotate-12 scale-150">
              <User size={120} />
            </div>
            <div className="flex items-center gap-4 border-l-2 border-gold pl-4 relative z-10">
              <User size={18} className="text-gold" />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Personnel Intel
              </h3>
            </div>

            <div className="space-y-5 relative z-10">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] block">
                  Agent Designation
                </span>
                <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Globe size={12} className="text-gold" />{" "}
                  {order.customer?.name}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] block">
                  Secure Comms
                </span>
                <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Mail size={12} className="text-gold" />{" "}
                  {order.customer?.email}
                </span>
                {order.customer?.phone && (
                  <span className="text-[10px] font-bold text-white/40 block mt-1 flex items-center gap-2">
                    <Phone size={10} /> {order.customer.phone}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] block">
                  Drop Zone (Shipping)
                </span>
                <div className="flex items-start gap-2 bg-ink/40 p-4 border border-white/5">
                  <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-white italic uppercase tracking-tight">
                      {order.shippingAddress?.fullName}
                    </span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter leading-tight">
                      {order.shippingAddress?.addressLine1}
                      {order.shippingAddress?.addressLine2 &&
                        `, ${order.shippingAddress.addressLine2}`}
                      <br />
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}{" "}
                      {order.shippingAddress?.zipCode}
                      <br />
                      {order.shippingAddress?.country}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Intel */}
          <div className="bg-charcoal border border-white/5 p-8 space-y-6 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-4 border-l-2 border-gold pl-4">
              <CreditCard size={18} className="text-gold" />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Financial Protocol
              </h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-ink/40 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                  {order.paymentMethod || "SECURE TRANSIT"}
                </span>
              </div>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                ENCRYPTED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen bg-ink">
      <Suspense
        fallback={
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
              Initializing Secure Link...
            </span>
          </div>
        }
      >
        <OrderDetailPageContent />
      </Suspense>
    </div>
  );
}
