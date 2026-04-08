"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Search,
  Filter,
  Download,
  Clock,
  AlertCircle,
  Database,
  Terminal,
  Zap,
  Plus,
  X,
  Save,
  Edit2,
  Trash2,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Tag,
  FileText,
  CheckCircle2,
  XCircle,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

// Status Configuration
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: { label: "Awaiting Intel", color: "amber-500", icon: Clock },
  confirmed: { label: "Confirmed", color: "blue-500", icon: CheckCircle2 },
  processing: { label: "Operational", color: "blue-500", icon: Zap },
  shipped: { label: "In Transit", color: "purple-500", icon: Truck },
  delivered: {
    label: "Target Reached",
    color: "emerald-500",
    icon: CheckCircle2,
  },
  cancelled: { label: "Aborted", color: "red-500", icon: AlertCircle },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> =
  {
    pending: { label: "Pending", color: "amber-500" },
    paid: { label: "Paid", color: "emerald-500" },
    failed: { label: "Failed", color: "red-500" },
  };

const FULFILLMENT_STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  unfulfilled: { label: "Unfulfilled", color: "amber-500" },
  fulfilled: { label: "Fulfilled", color: "emerald-500" },
};

// Types
interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  variantId?: string | null;
  variantTitle?: string | null;
  selectedOptions?: Record<string, string>;
  image?: string;
  customization?: Record<string, any>;
}

interface Address {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId?: string | null;
  sessionId: string;
  email: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  shippingAddress: Address;
  billingAddress: Address;
  payment: {
    method: string;
    transactionId?: string | null;
    paymentGatewayResponse?: any;
    paidAt?: string | null;
  };
  shipping: {
    method: string;
    carrier?: string | null;
    trackingNumber?: string | null;
    shippedAt?: string | null;
    deliveredAt?: string | null;
  };
  coupon: {
    code?: string | null;
    discountAmount: number;
  };
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Sample data - replace with API calls
const initialOrders: Order[] = [
  {
    _id: "70a100000000000000000001",
    orderNumber: "ORD-20260408-0001",
    userId: null,
    sessionId: "0c707bc5-09e1-4b7b-b9b7-0baec184d502",
    email: "himanshu@example.com",
    status: "pending",
    paymentStatus: "pending",
    fulfillmentStatus: "unfulfilled",
    items: [
      {
        productId: "69d5f9f729a1675d862e07a2",
        name: "Authentic Military Dog Tags – Ship Free!",
        slug: "authentic-military-dog-tags-ship-free",
        sku: "1003",
        quantity: 1,
        price: 9.3,
        compareAtPrice: 20,
        variantId: null,
        variantTitle: null,
        selectedOptions: {},
        image: "/uploads/products-31sh8jvc9cl.webp",
        customization: {
          firstname: "Himanshu",
          lastname: "Kumawat",
          service_number: "123321",
          blood_group: "O+",
          religious_preference: "Hindu",
        },
      },
    ],
    pricing: {
      subtotal: 9.3,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 9.3,
    },
    shippingAddress: {
      firstName: "Himanshu",
      lastName: "Kumawat",
      phone: "9876543210",
      address1: "House No. 123, Street Name",
      address2: "Near City Park",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      country: "India",
    },
    billingAddress: {
      firstName: "Himanshu",
      lastName: "Kumawat",
      phone: "9876543210",
      address1: "House No. 123, Street Name",
      address2: "Near City Park",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      country: "India",
    },
    payment: {
      method: "cod",
      transactionId: null,
      paymentGatewayResponse: null,
      paidAt: null,
    },
    shipping: {
      method: "standard",
      carrier: null,
      trackingNumber: null,
      shippedAt: null,
      deliveredAt: null,
    },
    coupon: {
      code: null,
      discountAmount: 0,
    },
    createdAt: "2026-04-08T10:10:00.000Z",
    updatedAt: "2026-04-08T10:10:00.000Z",
  },
  {
    _id: "70a100000000000000000002",
    orderNumber: "ORD-20260408-0002",
    userId: "70a0ff000000000000000111",
    sessionId: "b71c9ad1-8c32-4e12-ae4c-112233445566",
    email: "deepak.rai@example.com",
    status: "confirmed",
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
    items: [
      {
        productId: "69d4a18a11eb8d8eac89c40a",
        name: '5.11 Double Duty TDU Belt – 1.5" Wide 59568',
        slug: "5-11-double-duty-tdu-belt-1-5-wide-59568",
        sku: "59568-L-BLK-COY",
        quantity: 2,
        price: 2799,
        compareAtPrice: 3399,
        variantId: "69d4a18b11eb8d8eac89c40d",
        variantTitle: "Large / Black-Coyote",
        selectedOptions: {
          size: "Large",
          color: "Black/Coyote",
        },
        image:
          "https://alliedsurplus.com/wp-content/uploads/2015/02/products-59568_190_alternate1-600x600.jpg",
      },
    ],
    pricing: {
      subtotal: 5598,
      tax: 0,
      shipping: 100,
      discount: 200,
      total: 5498,
    },
    shippingAddress: {
      firstName: "Deepak",
      lastName: "Rai",
      phone: "9123456789",
      address1: "Plot 45, Sector 10",
      address2: "Near Metro Station",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
    billingAddress: {
      firstName: "Deepak",
      lastName: "Rai",
      phone: "9123456789",
      address1: "Plot 45, Sector 10",
      address2: "Near Metro Station",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
    payment: {
      method: "razorpay",
      transactionId: "pay_ABC123XYZ",
      paymentGatewayResponse: {
        status: "captured",
        amount: 549800,
        currency: "INR",
      },
      paidAt: "2026-04-08T10:20:00.000Z",
    },
    shipping: {
      method: "express",
      carrier: "Delhivery",
      trackingNumber: "DLV123456789",
      shippedAt: null,
      deliveredAt: null,
    },
    coupon: {
      code: "WELCOME200",
      discountAmount: 200,
    },
    createdAt: "2026-04-08T10:18:00.000Z",
    updatedAt: "2026-04-08T10:20:00.000Z",
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"list" | "create" | "edit" | "view">("list");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { allProducts } = useSelector(
    (state: RootState) => state.adminProducts,
  );

  console.log(allProducts);

  // Filter orders
  const filteredOrders = orders.filter(
    (ord) =>
      ord.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.shippingAddress?.firstName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      ord.shippingAddress?.lastName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Handle view order
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setView("view");
  };

  // Handle edit order
  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setView("edit");
  };

  // Handle delete order
  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((o) => o._id !== orderId));
    }
  };

  // Handle create new order
  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setView("create");
  };

  // Handle save order (create or update)
  const handleSaveOrder = (order: Order) => {
    if (order._id) {
      // Update existing
      setOrders(orders.map((o) => (o._id === order._id ? order : o)));
    } else {
      // Create new
      const newOrder = {
        ...order,
        _id: `70a10000000000000000${String(orders.length + 1).padStart(4, "0")}`,
        orderNumber: `ORD-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${String(orders.length + 1).padStart(4, "0")}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setOrders([...orders, newOrder]);
    }
    setView("list");
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-ink">
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Tactical Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
              Logistics <span className="text-amber-500">Operations</span>
            </h1>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] italic flex items-center gap-2">
              <Database size={12} className="text-amber-500" /> Real-time
              tracking of supply chain deployment and acquisition.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {view === "list" && (
              <>
                <button
                  onClick={handleCreateOrder}
                  className="h-12 px-8 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-black text-[10px] uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center gap-3"
                >
                  <Plus size={16} /> New Mission
                </button>
                <button className="h-12 px-8 bg-zinc-900 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3">
                  <Download size={16} /> Export manifest
                </button>
              </>
            )}
            {view !== "list" && (
              <button
                onClick={() => setView("list")}
                className="h-12 px-8 bg-zinc-900 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3"
              >
                <X size={16} /> Close
              </button>
            )}
          </div>
        </div>

        {/* Views */}
        {view === "list" && (
          <>
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-zinc-900 p-5 rounded-none border border-white/5 shadow-2xl shadow-black/40">
              <div className="relative w-full sm:w-[400px] group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors"
                  size={16}
                />
                <input
                  placeholder="IDENTIFY ORDER BY SERIAL OR AGENT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-12 pr-4 bg-black border border-white/10 rounded-sm text-xs font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:border-amber-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                  <Filter size={14} /> Filter Logic Active
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                  <Zap size={14} fill="currentColor" /> {filteredOrders.length}{" "}
                  TRANSMISSIONS
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-zinc-900 border border-white/5 rounded-none overflow-hidden shadow-2xl shadow-black/80">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/60 border-b border-white/5">
                    <tr className="h-16">
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.25em] text-white/20 px-8">
                        Order Designation
                      </th>
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.25em] text-white/20">
                        Operational Agent
                      </th>
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.25em] text-white/20">
                        Mission Status
                      </th>
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.25em] text-white/20">
                        Payment
                      </th>
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.25em] text-white/20">
                        Asset Value
                      </th>
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.25em] text-white/20">
                        Timestamp
                      </th>
                      <th className="text-right text-[10px] font-black uppercase tracking-[0.25em] text-white/20 px-8">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr className="border-none">
                        <td colSpan={7} className="h-64 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="h-8 w-8 border-2 border-white/5 border-t-amber-500 rounded-full animate-spin shadow-lg shadow-amber-500/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic animate-pulse">
                              Syncing Mission Data...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr className="border-none">
                        <td colSpan={7} className="h-64 text-center">
                          <div className="flex flex-col items-center gap-6 opacity-10 italic">
                            <AlertCircle size={48} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                              No Operational Logs Detected
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const status =
                          STATUS_CONFIG[ord.status] || STATUS_CONFIG["pending"];
                        const paymentStatus =
                          PAYMENT_STATUS_CONFIG[ord.paymentStatus] ||
                          PAYMENT_STATUS_CONFIG["pending"];

                        return (
                          <tr
                            key={ord._id}
                            className="border-t border-white/5 hover:bg-white/[0.02] transition-all duration-300 group"
                          >
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-white uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                                  {ord.orderNumber}
                                </span>
                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">
                                  ID: {ord._id.slice(-8)}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">
                                  {ord.shippingAddress?.firstName}{" "}
                                  {ord.shippingAddress?.lastName}
                                </span>
                                <span className="text-[9px] font-bold text-white/20 lowercase tracking-widest">
                                  {ord.email}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <status.icon
                                  size={12}
                                  className={cn(
                                    "text-current opacity-60",
                                    `text-${status.color}`,
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-none shadow-lg",
                                    `border-${status.color}/30 bg-${status.color}/5 text-${status.color}`,
                                  )}
                                >
                                  {status.label}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span
                                className={cn(
                                  "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-none",
                                  `border-${paymentStatus.color}/30 bg-${paymentStatus.color}/5 text-${paymentStatus.color}`,
                                )}
                              >
                                {paymentStatus.label}
                              </span>
                            </td>
                            <td>
                              <span className="text-sm font-black text-white tracking-widest">
                                ₹{ord.pricing.total}
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-2 text-white/40">
                                <Clock size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                  {new Date(ord.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="text-right px-8">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleViewOrder(ord)}
                                  className="h-9 px-4 bg-black border border-white/10 text-white/20 hover:text-amber-500 hover:border-amber-500/30 transition-all flex items-center justify-center gap-2"
                                  title="View"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => handleEditOrder(ord)}
                                  className="h-9 px-4 bg-black border border-white/10 text-white/20 hover:text-blue-500 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2"
                                  title="Edit"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(ord._id)}
                                  className="h-9 px-4 bg-black border border-white/10 text-white/20 hover:text-red-500 hover:border-red-500/30 transition-all flex items-center justify-center gap-2"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Intel */}
            <div className="flex items-center gap-3 opacity-40">
              <Terminal size={14} className="text-amber-500" />
              <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">
                Logistics Terminal: Secure Link | Stream Encryption: AES-256
              </span>
            </div>
          </>
        )}

        {view === "view" && selectedOrder && (
          <OrderViewComponent
            order={selectedOrder}
            onClose={() => setView("list")}
            onEdit={() => setView("edit")}
          />
        )}

        {(view === "create" || view === "edit") && (
          <OrderFormComponent
            order={selectedOrder}
            onSave={handleSaveOrder}
            onCancel={() => setView("list")}
            isEdit={view === "edit"}
          />
        )}
      </div>
    </div>
  );
}

// Order View Component
function OrderViewComponent({
  order,
  onClose,
  onEdit,
}: {
  order: Order;
  onClose: () => void;
  onEdit: () => void;
}) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG["pending"];
  const paymentStatus = PAYMENT_STATUS_CONFIG[order.paymentStatus];
  const fulfillmentStatus = FULFILLMENT_STATUS_CONFIG[order.fulfillmentStatus];

  return (
    <div className="space-y-8">
      {/* Order Header */}
      <div className="bg-zinc-900 border border-white/5 p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {order.orderNumber}
            </h2>
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-none flex items-center gap-2",
                  `border-${status.color}/30 bg-${status.color}/5 text-${status.color}`,
                )}
              >
                <status.icon size={12} />
                {status.label}
              </span>
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-none",
                  `border-${paymentStatus.color}/30 bg-${paymentStatus.color}/5 text-${paymentStatus.color}`,
                )}
              >
                {paymentStatus.label}
              </span>
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-none",
                  `border-${fulfillmentStatus.color}/30 bg-${fulfillmentStatus.color}/5 text-${fulfillmentStatus.color}`,
                )}
              >
                {fulfillmentStatus.label}
              </span>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="h-11 px-6 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-black text-[10px] uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center gap-2"
          >
            <Edit2 size={14} /> Edit Order
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
              <Clock size={12} /> Created
            </div>
            <div className="text-white font-bold">
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
              <User size={12} /> Customer
            </div>
            <div className="text-white font-bold">{order.email}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
              <CreditCard size={12} /> Total
            </div>
            <div className="text-white font-black text-2xl">
              ₹{order.pricing.total}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-zinc-900 border border-white/5 p-8">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
          <Package size={18} className="text-amber-500" /> Order Items
        </h3>
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-6 p-4 bg-black/40 border border-white/5"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover border border-white/10"
                />
              )}
              <div className="flex-1 space-y-2">
                <div className="font-black text-white uppercase text-sm">
                  {item.name}
                </div>
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  SKU: {item.sku}
                </div>
                {item.variantTitle && (
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    Variant: {item.variantTitle}
                  </div>
                )}
                {item.customization &&
                  Object.keys(item.customization).length > 0 && (
                    <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">
                      Customized:{" "}
                      {Object.entries(item.customization)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")}
                    </div>
                  )}
              </div>
              <div className="text-right space-y-1">
                <div className="text-white font-black">
                  ₹{item.price} × {item.quantity}
                </div>
                <div className="text-amber-500 font-black text-lg">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
          <div className="flex justify-between text-white/60">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Subtotal
            </span>
            <span className="font-bold">₹{order.pricing.subtotal}</span>
          </div>
          {order.pricing.discount > 0 && (
            <div className="flex justify-between text-emerald-500">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Discount
              </span>
              <span className="font-bold">-₹{order.pricing.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-white/60">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Shipping
            </span>
            <span className="font-bold">₹{order.pricing.shipping}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Tax
            </span>
            <span className="font-bold">₹{order.pricing.tax}</span>
          </div>
          <div className="flex justify-between text-white font-black text-xl pt-3 border-t border-white/5">
            <span className="text-[12px] uppercase tracking-widest">Total</span>
            <span>₹{order.pricing.total}</span>
          </div>
        </div>
      </div>

      {/* Addresses & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-zinc-900 border border-white/5 p-8">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
            <MapPin size={18} className="text-amber-500" /> Shipping Address
          </h3>
          <div className="space-y-2 text-white/80">
            <div className="font-bold">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </div>
            <div className="text-sm">{order.shippingAddress.address1}</div>
            {order.shippingAddress.address2 && (
              <div className="text-sm">{order.shippingAddress.address2}</div>
            )}
            <div className="text-sm">
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.pincode}
            </div>
            <div className="text-sm">{order.shippingAddress.country}</div>
            <div className="text-sm font-bold">
              Phone: {order.shippingAddress.phone}
            </div>
          </div>
        </div>

        {/* Payment & Shipping Info */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-white/5 p-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
              <CreditCard size={18} className="text-amber-500" /> Payment
            </h3>
            <div className="space-y-2 text-white/80">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Method
              </div>
              <div className="font-bold uppercase">{order.payment.method}</div>
              {order.payment.transactionId && (
                <>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-3">
                    Transaction ID
                  </div>
                  <div className="font-mono text-sm">
                    {order.payment.transactionId}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/5 p-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
              <Truck size={18} className="text-amber-500" /> Shipping
            </h3>
            <div className="space-y-2 text-white/80">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Method
              </div>
              <div className="font-bold uppercase">{order.shipping.method}</div>
              {order.shipping.carrier && (
                <>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-3">
                    Carrier
                  </div>
                  <div className="font-bold">{order.shipping.carrier}</div>
                </>
              )}
              {order.shipping.trackingNumber && (
                <>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-3">
                    Tracking
                  </div>
                  <div className="font-mono text-sm">
                    {order.shipping.trackingNumber}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Form Component (Create/Edit)
// function OrderFormComponent({
//   order,
//   onSave,
//   onCancel,
//   isEdit,
// }: {
//   order: Order | null;
//   onSave: (order: Order) => void;
//   onCancel: () => void;
//   isEdit: boolean;
// }) {
//   const [formData, setFormData] = useState<Partial<Order>>(
//     order || {
//       email: "",
//       status: "pending",
//       paymentStatus: "pending",
//       fulfillmentStatus: "unfulfilled",
//       items: [],
//       pricing: {
//         subtotal: 0,
//         tax: 0,
//         shipping: 0,
//         discount: 0,
//         total: 0,
//       },
//       shippingAddress: {
//         firstName: "",
//         lastName: "",
//         phone: "",
//         address1: "",
//         address2: "",
//         city: "",
//         state: "",
//         pincode: "",
//         country: "India",
//       },
//       billingAddress: {
//         firstName: "",
//         lastName: "",
//         phone: "",
//         address1: "",
//         address2: "",
//         city: "",
//         state: "",
//         pincode: "",
//         country: "India",
//       },
//       payment: {
//         method: "cod",
//       },
//       shipping: {
//         method: "standard",
//       },
//       coupon: {
//         discountAmount: 0,
//       },
//       sessionId: "",
//     },
//   );

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData as Order);
//   };

//   const updateField = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const updateNestedField = (parent: string, field: string, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       [parent]: {
//         ...(prev[parent as keyof typeof prev] as any),
//         [field]: value,
//       },
//     }));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-8">
//       {/* Form Header */}
//       <div className="bg-zinc-900 border border-white/5 p-8">
//         <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
//           {isEdit ? "Edit Order" : "Create New Order"}
//         </h2>
//         <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
//           {isEdit
//             ? `Modifying ${formData.orderNumber}`
//             : "Initialize new mission parameters"}
//         </p>
//       </div>

//       {/* Basic Info */}
//       <div className="bg-zinc-900 border border-white/5 p-8">
//         <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
//           <FileText size={18} className="text-amber-500" /> Basic Information
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Email *
//             </label>
//             <input
//               type="email"
//               required
//               value={formData.email}
//               onChange={(e) => updateField("email", e.target.value)}
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//               placeholder="customer@example.com"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Session ID
//             </label>
//             <input
//               type="text"
//               value={formData.sessionId}
//               onChange={(e) => updateField("sessionId", e.target.value)}
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//               placeholder="Auto-generated"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Order Status *
//             </label>
//             <select
//               required
//               value={formData.status}
//               onChange={(e) => updateField("status", e.target.value)}
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
//             >
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Payment Status *
//             </label>
//             <select
//               required
//               value={formData.paymentStatus}
//               onChange={(e) => updateField("paymentStatus", e.target.value)}
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
//             >
//               <option value="pending">Pending</option>
//               <option value="paid">Paid</option>
//               <option value="failed">Failed</option>
//             </select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Fulfillment Status *
//             </label>
//             <select
//               required
//               value={formData.fulfillmentStatus}
//               onChange={(e) => updateField("fulfillmentStatus", e.target.value)}
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
//             >
//               <option value="unfulfilled">Unfulfilled</option>
//               <option value="fulfilled">Fulfilled</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Shipping Address */}
//       <div className="bg-zinc-900 border border-white/5 p-8">
//         <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
//           <MapPin size={18} className="text-amber-500" /> Shipping Address
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               First Name *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.firstName}
//               onChange={(e) =>
//                 updateNestedField(
//                   "shippingAddress",
//                   "firstName",
//                   e.target.value,
//                 )
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Last Name *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.lastName}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "lastName", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Phone *
//             </label>
//             <input
//               type="tel"
//               required
//               value={formData.shippingAddress?.phone}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "phone", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Pincode *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.pincode}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "pincode", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2 md:col-span-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Address Line 1 *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.address1}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "address1", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2 md:col-span-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Address Line 2
//             </label>
//             <input
//               type="text"
//               value={formData.shippingAddress?.address2}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "address2", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               City *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.city}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "city", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               State *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.state}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "state", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Country *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.country}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "country", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Payment & Shipping */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-zinc-900 border border-white/5 p-8">
//           <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
//             <CreditCard size={18} className="text-amber-500" /> Payment
//           </h3>
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//                 Method *
//               </label>
//               <select
//                 required
//                 value={formData.payment?.method}
//                 onChange={(e) =>
//                   updateNestedField("payment", "method", e.target.value)
//                 }
//                 className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
//               >
//                 <option value="cod">Cash on Delivery</option>
//                 <option value="razorpay">Razorpay</option>
//                 <option value="stripe">Stripe</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//                 Transaction ID
//               </label>
//               <input
//                 type="text"
//                 value={formData.payment?.transactionId || ""}
//                 onChange={(e) =>
//                   updateNestedField("payment", "transactionId", e.target.value)
//                 }
//                 className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="bg-zinc-900 border border-white/5 p-8">
//           <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
//             <Truck size={18} className="text-amber-500" /> Shipping
//           </h3>
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//                 Method *
//               </label>
//               <select
//                 required
//                 value={formData.shipping?.method}
//                 onChange={(e) =>
//                   updateNestedField("shipping", "method", e.target.value)
//                 }
//                 className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
//               >
//                 <option value="standard">Standard</option>
//                 <option value="express">Express</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//                 Carrier
//               </label>
//               <input
//                 type="text"
//                 value={formData.shipping?.carrier || ""}
//                 onChange={(e) =>
//                   updateNestedField("shipping", "carrier", e.target.value)
//                 }
//                 className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//                 placeholder="e.g., Delhivery"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//                 Tracking Number
//               </label>
//               <input
//                 type="text"
//                 value={formData.shipping?.trackingNumber || ""}
//                 onChange={(e) =>
//                   updateNestedField(
//                     "shipping",
//                     "trackingNumber",
//                     e.target.value,
//                   )
//                 }
//                 className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pricing */}
//       <div className="bg-zinc-900 border border-white/5 p-8">
//         <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
//           <Tag size={18} className="text-amber-500" /> Pricing
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Subtotal *
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               required
//               value={formData.pricing?.subtotal}
//               onChange={(e) =>
//                 updateNestedField(
//                   "pricing",
//                   "subtotal",
//                   parseFloat(e.target.value),
//                 )
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Tax
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.pricing?.tax}
//               onChange={(e) =>
//                 updateNestedField("pricing", "tax", parseFloat(e.target.value))
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Shipping
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.pricing?.shipping}
//               onChange={(e) =>
//                 updateNestedField(
//                   "pricing",
//                   "shipping",
//                   parseFloat(e.target.value),
//                 )
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Discount
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.pricing?.discount}
//               onChange={(e) =>
//                 updateNestedField(
//                   "pricing",
//                   "discount",
//                   parseFloat(e.target.value),
//                 )
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//         </div>
//         <div className="mt-6 pt-6 border-t border-white/5">
//           <div className="flex items-center justify-between">
//             <span className="text-[12px] font-black uppercase tracking-widest text-white/40">
//               Total Amount
//             </span>
//             <span className="text-2xl font-black text-amber-500">
//               ₹
//               {(
//                 (formData.pricing?.subtotal || 0) +
//                 (formData.pricing?.tax || 0) +
//                 (formData.pricing?.shipping || 0) -
//                 (formData.pricing?.discount || 0)
//               ).toFixed(2)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-4 justify-end">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="h-12 px-8 bg-zinc-900 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3"
//         >
//           <X size={16} /> Cancel
//         </button>
//         <button
//           type="submit"
//           className="h-12 px-8 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-black text-[10px] uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center gap-3"
//         >
//           <Save size={16} /> {isEdit ? "Update Order" : "Create Order"}
//         </button>
//       </div>
//     </form>
//   );
// }

function OrderFormComponent({
  order,
  onSave,
  onCancel,
  isEdit,
}: {
  order: Order | null;
  onSave: (order: Order) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const { allProducts } = useSelector(
    (state: RootState) => state.adminProducts,
  );

  const [formData, setFormData] = useState<Partial<Order>>(
    order || {
      email: "",
      status: "pending",
      paymentStatus: "pending",
      fulfillmentStatus: "unfulfilled",
      items: [],
      pricing: {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0,
      },
      shippingAddress: {
        firstName: "",
        lastName: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      billingAddress: {
        firstName: "",
        lastName: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      payment: {
        method: "cod",
      },
      shipping: {
        method: "standard",
      },
      coupon: {
        discountAmount: 0,
      },
      sessionId: "",
    },
  );

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [itemQty, setItemQty] = useState(1);

  const selectedProduct = allProducts?.find(
    (p: any) => p._id === selectedProductId,
  );

  const selectedVariant = selectedProduct?.variants?.find(
    (v: any) => v._id === selectedVariantId,
  );

  const getPrimaryImage = (product: any) => {
    if (!product?.gallery?.length) return "";
    const primary =
      product.gallery.find((img: any) => img.id === product.primaryImageId) ||
      product.gallery[0];
    return primary?.url || "";
  };

  const recalculatePricing = (
    items: OrderItem[],
    prevPricing?: Order["pricing"],
  ) => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0,
    );

    const tax = Number(prevPricing?.tax || 0);
    const shipping = Number(prevPricing?.shipping || 0);
    const discount = Number(prevPricing?.discount || 0);

    return {
      subtotal,
      tax,
      shipping,
      discount,
      total: subtotal + tax + shipping - discount,
    };
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [field]: value,
        },
      };

      if (parent === "pricing") {
        const subtotal = Number(updated.pricing?.subtotal || 0);
        const tax = Number(updated.pricing?.tax || 0);
        const shipping = Number(updated.pricing?.shipping || 0);
        const discount = Number(updated.pricing?.discount || 0);

        updated.pricing = {
          subtotal,
          tax,
          shipping,
          discount,
          total: subtotal + tax + shipping - discount,
        };
      }

      return updated;
    });
  };

  const addItemToOrder = () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    if (selectedProduct?.variants?.length > 0 && !selectedVariant) {
      alert("Please select a variant.");
      return;
    }

    const price =
      Number(selectedVariant?.price) ||
      Number(selectedProduct?.pricing?.price) ||
      Number(selectedProduct?.price) ||
      0;

    const compareAtPrice =
      Number(selectedProduct?.pricing?.compareAtPrice) ||
      Number(selectedProduct?.price) ||
      undefined;

    const orderItem: OrderItem = {
      productId: String(selectedProduct._id),
      name: selectedProduct.name,
      slug: selectedProduct.slug,
      sku: selectedVariant?.sku || selectedProduct.sku,
      quantity: itemQty,
      price,
      compareAtPrice,
      variantId: selectedVariant?._id || null,
      variantTitle: selectedVariant?.title || null,
      selectedOptions: selectedVariant?.optionValues || {},
      image: getPrimaryImage(selectedProduct),
      customization: {},
    };

    const updatedItems = [...(formData.items || []), orderItem];
    const updatedPricing = recalculatePricing(
      updatedItems,
      formData.pricing as Order["pricing"],
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      pricing: updatedPricing,
    }));

    setSelectedProductId("");
    setSelectedVariantId("");
    setItemQty(1);
  };

  const removeItemFromOrder = (index: number) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems.splice(index, 1);

    const updatedPricing = recalculatePricing(
      updatedItems,
      formData.pricing as Order["pricing"],
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      pricing: updatedPricing,
    }));
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: quantity < 1 ? 1 : quantity,
    };

    const updatedPricing = recalculatePricing(
      updatedItems,
      formData.pricing as Order["pricing"],
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      pricing: updatedPricing,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.items || formData.items.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    onSave(formData as Order);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Form Header */}
      <div className="bg-zinc-900 border border-white/5 p-8">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
          {isEdit ? "Edit Order" : "Create New Order"}
        </h2>
        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
          {isEdit
            ? `Modifying ${formData.orderNumber}`
            : "Initialize new mission parameters"}
        </p>
      </div>

      {/* Basic Info */}
      <div className="bg-zinc-900 border border-white/5 p-8">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
          <FileText size={18} className="text-amber-500" /> Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
              placeholder="customer@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Session ID
            </label>
            <input
              type="text"
              value={formData.sessionId}
              onChange={(e) => updateField("sessionId", e.target.value)}
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
              placeholder="Auto-generated"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Order Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Payment Status *
            </label>
            <select
              required
              value={formData.paymentStatus}
              onChange={(e) => updateField("paymentStatus", e.target.value)}
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Fulfillment Status *
            </label>
            <select
              required
              value={formData.fulfillmentStatus}
              onChange={(e) => updateField("fulfillmentStatus", e.target.value)}
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            >
              <option value="unfulfilled">Unfulfilled</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
        </div>
      </div>

      {/* ORDER ITEMS */}
      <div className="bg-zinc-900 border border-white/5 p-8">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
          <Package size={18} className="text-amber-500" /> Order Items
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Select Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setSelectedVariantId("");
              }}
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            >
              <option value="">Choose product</option>
              {allProducts?.map((product: any) => (
                <option key={product._id} value={product._id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Select Variant
            </label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              disabled={!selectedProduct || !selectedProduct?.variants?.length}
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none disabled:opacity-50"
            >
              <option value="">
                {selectedProduct?.variants?.length
                  ? "Choose variant"
                  : "No variants"}
              </option>
              {selectedProduct?.variants?.map((variant: any) => (
                <option key={variant._id} value={variant._id}>
                  {variant.title} | ₹{variant.price} | Stock: {variant.stock}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Qty
            </label>
            <input
              type="number"
              min={1}
              value={itemQty}
              onChange={(e) => setItemQty(Number(e.target.value) || 1)}
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              type="button"
              onClick={addItemToOrder}
              className="w-full h-11 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-black text-[10px] uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {selectedProduct && (
          <div className="mt-4 p-4 bg-black/40 border border-white/5">
            <div className="text-white font-bold">{selectedProduct.name}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
              SKU: {selectedProduct.sku} | Base Price: ₹
              {selectedProduct?.pricing?.price || selectedProduct?.price || 0} |
              {/* Stock: {selectedProduct?.totalStock ?? 0} */}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {(formData.items || []).length === 0 ? (
            <div className="border border-dashed border-white/10 p-6 text-center text-white/30 text-sm">
              No items added yet
            </div>
          ) : (
            (formData.items || []).map((item, index) => (
              <div
                key={`${item.productId}-${item.variantId || "base"}-${index}`}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-black/40 border border-white/5"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-16 h-16 border border-white/10 bg-black flex items-center justify-center text-white/20">
                    <Package size={18} />
                  </div>
                )}

                <div className="flex-1">
                  <div className="text-white font-black text-sm">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">
                    SKU: {item.sku}
                  </div>
                  {item.variantTitle && (
                    <div className="text-[10px] text-amber-500 uppercase tracking-widest">
                      Variant: {item.variantTitle}
                    </div>
                  )}
                </div>

                <div className="w-full md:w-28">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItemQuantity(index, Number(e.target.value) || 1)
                    }
                    className="w-full h-10 px-3 bg-zinc-900 border border-white/10 text-white text-sm focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="w-full md:w-32 text-white font-bold">
                  ₹{item.price}
                </div>

                <div className="w-full md:w-36 text-amber-500 font-black">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  type="button"
                  onClick={() => removeItemFromOrder(index)}
                  className="h-10 px-4 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-zinc-900 border border-white/5 p-8">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
          <MapPin size={18} className="text-amber-500" /> Shipping Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.firstName}
              onChange={(e) =>
                updateNestedField(
                  "shippingAddress",
                  "firstName",
                  e.target.value,
                )
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.lastName}
              onChange={(e) =>
                updateNestedField("shippingAddress", "lastName", e.target.value)
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Phone *
            </label>
            <input
              type="tel"
              required
              value={formData.shippingAddress?.phone}
              onChange={(e) =>
                updateNestedField("shippingAddress", "phone", e.target.value)
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Pincode *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.pincode}
              onChange={(e) =>
                updateNestedField("shippingAddress", "pincode", e.target.value)
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Address Line 1 *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.address1}
              onChange={(e) =>
                updateNestedField("shippingAddress", "address1", e.target.value)
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Address Line 2
            </label>
            <input
              type="text"
              value={formData.shippingAddress?.address2}
              onChange={(e) =>
                updateNestedField("shippingAddress", "address2", e.target.value)
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              City *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.city}
              onChange={(e) =>
                updateNestedField("shippingAddress", "city", e.target.value)
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              State *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.state}
              onChange={(e) =>
                updateNestedField("shippingAddress", "state", e.target.value)
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Country *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.country}
              onChange={(e) =>
                updateNestedField("shippingAddress", "country", e.target.value)
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Payment & Shipping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-white/5 p-8">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
            <CreditCard size={18} className="text-amber-500" /> Payment
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Method *
              </label>
              <select
                required
                value={formData.payment?.method}
                onChange={(e) =>
                  updateNestedField("payment", "method", e.target.value)
                }
                className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="razorpay">Razorpay</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Transaction ID
              </label>
              <input
                type="text"
                value={formData.payment?.transactionId || ""}
                onChange={(e) =>
                  updateNestedField("payment", "transactionId", e.target.value)
                }
                className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-8">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
            <Truck size={18} className="text-amber-500" /> Shipping
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Method *
              </label>
              <select
                required
                value={formData.shipping?.method}
                onChange={(e) =>
                  updateNestedField("shipping", "method", e.target.value)
                }
                className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
              >
                <option value="standard">Standard</option>
                <option value="express">Express</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Carrier
              </label>
              <input
                type="text"
                value={formData.shipping?.carrier || ""}
                onChange={(e) =>
                  updateNestedField("shipping", "carrier", e.target.value)
                }
                className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
                placeholder="e.g., Delhivery"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Tracking Number
              </label>
              <input
                type="text"
                value={formData.shipping?.trackingNumber || ""}
                onChange={(e) =>
                  updateNestedField(
                    "shipping",
                    "trackingNumber",
                    e.target.value,
                  )
                }
                className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-zinc-900 border border-white/5 p-8">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
          <Tag size={18} className="text-amber-500" /> Pricing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Subtotal
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricing?.subtotal || 0}
              readOnly
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white/70 outline-none cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Tax
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricing?.tax || 0}
              onChange={(e) =>
                updateNestedField(
                  "pricing",
                  "tax",
                  parseFloat(e.target.value) || 0,
                )
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Shipping
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricing?.shipping || 0}
              onChange={(e) =>
                updateNestedField(
                  "pricing",
                  "shipping",
                  parseFloat(e.target.value) || 0,
                )
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Discount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricing?.discount || 0}
              onChange={(e) =>
                updateNestedField(
                  "pricing",
                  "discount",
                  parseFloat(e.target.value) || 0,
                )
              }
              className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-black uppercase tracking-widest text-white/40">
              Total Amount
            </span>
            <span className="text-2xl font-black text-amber-500">
              ₹{Number(formData.pricing?.total || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-12 px-8 bg-zinc-900 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3"
        >
          <X size={16} /> Cancel
        </button>

        <button
          type="submit"
          className="h-12 px-8 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-black text-[10px] uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center gap-3"
        >
          <Save size={16} /> {isEdit ? "Update Order" : "Create Order"}
        </button>
      </div>
    </form>
  );
}
