"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "@/lib/store/cart/cartSlice";
import {
  ChevronLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Wallet,
} from "lucide-react";
import { Link } from "@/lib/router";

const CheckoutPage = () => {
  const cart = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBillingDifferent, setIsBillingDifferent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
    "online",
  );
  const [shippingData, setShippingData] = useState<any>(null);
  const [billingData, setBillingData] = useState<any>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getItemImage = (item: any) => {
    if (item.selectedVariant?.image) return item.selectedVariant.image;
    if (item.gallery && item.gallery.length > 0) return item.gallery[0].url;
    return "/placeholder-product.png";
  };

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      const formData = new FormData(e.currentTarget);
      const ship = {
        firstName: formData.get("shippingFirstName"),
        lastName: formData.get("shippingLastName"),
        phone: formData.get("shippingPhone"),
        address1: formData.get("shippingAddress1"),
        address2: formData.get("shippingAddress2"),
        city: formData.get("shippingCity"),
        state: formData.get("shippingState"),
        pincode: formData.get("shippingPincode"),
        country: formData.get("shippingCountry"),
      };
      setShippingData(ship);

      if (isBillingDifferent) {
        const bill = {
          firstName: formData.get("billingFirstName"),
          lastName: formData.get("billingLastName"),
          phone: formData.get("billingPhone"),
          address1: formData.get("billingAddress1"),
          address2: formData.get("billingAddress2"),
          city: formData.get("billingCity"),
          state: formData.get("billingState"),
          pincode: formData.get("billingPincode"),
          country: formData.get("billingCountry"),
        };
        setBillingData(bill);
      } else {
        setBillingData(ship);
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // setIsProcessing(true);

      const tax = cartTotal * 0.18;
      const subtotal = cartTotal;
      const shippingCost = 0; // Free shipping
      const discount = 0;
      const total = subtotal + tax + shippingCost - discount;

      const payload = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          slug: item.slug || item.name.toLowerCase().replace(/ /g, "-"),
          sku:
            item.selectedVariant?.sku ||
            item.sku ||
            `SKU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          quantity: item.quantity,
          price: Number(
            item.selectedVariant?.price ||
              item.price ||
              item.pricing?.price ||
              0,
          ),
          compareAtPrice: Number(
            item.pricing?.compareAtPrice ||
              item.selectedVariant?.price ||
              item.price ||
              0,
          ),
          variantId: item.selectedVariant?._id || null,
          variantTitle: item.selectedVariant?.title || null,
          selectedOptions: item.selectedOptions || {},
          image: getItemImage(item),
        })),
        pricing: {
          subtotal,
          tax,
          shipping: shippingCost,
          discount,
          total,
        },
        shippingAddress: shippingData,
        billingAddress: billingData,
        payment: {
          method: paymentMethod === "cod" ? "cod" : "razorpay",
          ...(paymentMethod === "online"
            ? {
                transactionId:
                  "pay_dummy" + Math.floor(Math.random() * 10000000),
                paymentGatewayResponse: {
                  status: "captured",
                  amount: Math.round(total * 100),
                  currency: "INR",
                },
                paidAt: new Date().toISOString(),
              }
            : {}),
        },
        shipping: {
          method: "standard",
        },
      };

      console.log("FINAL ORDER PAYLOAD:", payload);

      const res = await fetch("/api/ecommerce/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setIsProcessing(false);
        setIsCompleted(true);
        // dispatch(clearCart());
      }

      // setTimeout(() => {
      //   setIsProcessing(false);
      //   // NOTE: Backend integration point for payment gateway
      //   // if (paymentMethod === 'online') {
      //   //   window.location.href = '/api/create-checkout-session'; return;
      //   // }

      //   setIsCompleted(true);
      //   dispatch(clearCart());
      // }, 2000);
    }
  };

  const renderAddressForm = (prefix: "shipping" | "billing") => {
    const data = prefix === "shipping" ? shippingData : billingData;
    return (
      <div className="flex flex-col gap-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
              First Name *
            </label>
            <input
              required
              type="text"
              defaultValue={data?.firstName || ""}
              name={`${prefix}FirstName`}
              className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
              Last Name *
            </label>
            <input
              required
              type="text"
              defaultValue={data?.lastName || ""}
              name={`${prefix}LastName`}
              className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
              Phone *
            </label>
            <input
              required
              type="tel"
              defaultValue={data?.phone || ""}
              name={`${prefix}Phone`}
              className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
              Pincode *
            </label>
            <input
              required
              type="text"
              defaultValue={data?.pincode || ""}
              name={`${prefix}Pincode`}
              className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
            Address Line 1 *
          </label>
          <input
            required
            type="text"
            defaultValue={data?.address1 || ""}
            name={`${prefix}Address1`}
            className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
            Address Line 2
          </label>
          <input
            type="text"
            defaultValue={data?.address2 || ""}
            name={`${prefix}Address2`}
            className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
              City *
            </label>
            <input
              required
              type="text"
              defaultValue={data?.city || ""}
              name={`${prefix}City`}
              className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
              State *
            </label>
            <input
              required
              type="text"
              defaultValue={data?.state || ""}
              name={`${prefix}State`}
              className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
            Country *
          </label>
          <input
            required
            type="text"
            defaultValue={data?.country || "India"}
            name={`${prefix}Country`}
            className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
          />
        </div>
      </div>
    );
  };

  if (isCompleted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-[5%] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-muted font-semibold mb-10">
            Thank you for your purchase. Your order #NC-4921 has been placed and
            is being processed. We've sent a confirmation email to your inbox.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-primary text-white px-10 h-14 rounded-full text-[15px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-all"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-12 px-[5%] max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <Link
          href="/cart"
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-surface transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-[42px] font-bold tracking-tight">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start">
        {/* Checkout Form */}
        <div className="space-y-12">
          {/* Steps Indicator */}
          <div className="flex items-center gap-6">
            {[
              { id: 1, label: "Shipping", icon: Truck },
              { id: 2, label: "Payment", icon: CreditCard },
              { id: 3, label: "Review", icon: ShieldCheck },
            ].map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s.id
                      ? "bg-secondary text-white"
                      : "bg-surface text-muted border border-border"
                  }`}
                >
                  {step > s.id ? <CheckCircle2 size={18} /> : s.id}
                </div>
                <span
                  className={`text-sm font-bold uppercase tracking-wider hidden sm:block ${
                    step >= s.id ? "text-foreground" : "text-muted"
                  }`}
                >
                  {s.label}
                </span>
                {s.id < 3 && (
                  <div className="w-8 h-px bg-border hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleNext} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 uppercase">
                    <MapPin className="text-secondary" size={20} />
                    Shipping Address
                  </h2>

                  {renderAddressForm("shipping")}

                  <div className="flex items-center gap-3 pt-6 pb-2">
                    <button
                      type="button"
                      onClick={() => setIsBillingDifferent(!isBillingDifferent)}
                      className="w-12 h-6 rounded-full bg-surface border-2 border-border relative flex items-center transition-all data-[state=true]:bg-secondary data-[state=true]:border-secondary focus:outline-none"
                      data-state={isBillingDifferent}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-border absolute transition-all ${isBillingDifferent ? "left-[26px] bg-white" : "left-1"}`}
                      />
                    </button>
                    <span className="text-sm font-bold mt-0.5 uppercase tracking-wider text-muted">
                      Billing address is different
                    </span>
                  </div>

                  <AnimatePresence>
                    {isBillingDifferent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-8 border-t border-border mt-2 space-y-6">
                          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 uppercase">
                            <MapPin className="text-secondary" size={20} />
                            Billing Address
                          </h2>
                          {renderAddressForm("billing")}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold tracking-tight mb-6">
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    {/* COD Option */}
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-6 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${paymentMethod === "cod" ? "border-2 border-[#5a6330] bg-primary/5" : "border border-border bg-surface hover:border-primary/50"}`}
                    >
                      <div className="flex items-center gap-4">
                        <Wallet
                          className={
                            paymentMethod === "cod"
                              ? "text-primary"
                              : "text-muted"
                          }
                        />
                        <span className="font-bold">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "cod" ? "border-[#5a6330]" : "border-border"}`}
                      >
                        {paymentMethod === "cod" && (
                          <div className="w-3 h-3 rounded-full bg-olive" />
                        )}
                      </div>
                    </div>

                    {/* Online Option */}
                    <div
                      onClick={() => setPaymentMethod("online")}
                      className={`p-6 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${paymentMethod === "online" ? "border-2 border-[#5a6330] bg-primary/5" : "border border-border bg-surface hover:border-primary/50"}`}
                    >
                      <div className="flex items-center gap-4">
                        <CreditCard
                          className={
                            paymentMethod === "online"
                              ? "text-primary"
                              : "text-muted"
                          }
                        />
                        <span className="font-bold">Online Payment</span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "online" ? "border-[#5a6330]" : "border-border"}`}
                      >
                        {paymentMethod === "online" && (
                          <div className="w-3 h-3 rounded-full bg-olive" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informational UI for Online since redirection is expected */}
                  <AnimatePresence>
                    {paymentMethod === "online" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 text-sm font-semibold text-muted bg-surface/50 p-6 rounded-xl border border-border">
                          You will be redirected to the secure payment gateway
                          after reviewing your order.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-bold tracking-tight mb-6">
                    Review Order
                  </h2>
                  <div className="p-8 rounded-3xl border border-border bg-surface space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[2px] text-muted mb-2">
                          Shipping To
                        </h4>
                        <p className="font-bold">
                          {shippingData?.firstName || "Customer"}{" "}
                          {shippingData?.lastName || ""}
                        </p>
                        <p className="text-sm text-muted font-semibold">
                          {shippingData?.address1 || "Address 1"},{" "}
                          {shippingData?.city || "City"},{" "}
                          {shippingData?.state || "State"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-secondary text-xs font-black uppercase tracking-wider"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[2px] text-muted mb-2">
                          Payment Method
                        </h4>
                        <p className="font-bold">
                          {paymentMethod === "cod"
                            ? "Cash on Delivery (COD)"
                            : "Online Payment"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-secondary text-xs font-black uppercase tracking-wider"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 pt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 h-14 rounded-full border border-border text-foreground font-bold uppercase tracking-wider hover:bg-surface transition-all"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-[2] bg-primary text-white h-14 rounded-full text-[15px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {step === 3
                      ? paymentMethod === "online"
                        ? "Proceed to Payment"
                        : "Complete Order"
                      : "Continue to " + (step === 1 ? "Payment" : "Review")}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-8 sticky top-[140px]">
          <div className="bg-surface border border-border p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6 tracking-tight">Summary</h3>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.cartItemId || item._id} className="flex gap-4">
                  <div className="w-16 h-20 bg-background rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <img
                      src={getItemImage(item)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-bold text-sm line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted font-bold uppercase tracking-wider">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-black text-secondary mt-1">
                      {formatPrice(
                        Number(
                          item.selectedVariant?.price ||
                            item.price ||
                            item.pricing?.price ||
                            0,
                        ),
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-border my-6" />
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-muted font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted font-semibold">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-sm text-muted font-semibold">
                <span>Tax (GST 18%)</span>
                <span>{formatPrice(cartTotal * 0.18)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-black pt-4 border-t border-border">
              <span>Total</span>
              <span className="text-secondary">
                {formatPrice(cartTotal * 1.18)}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4 items-start">
            <ShieldCheck className="text-emerald-600 flex-shrink-0" size={24} />
            <div>
              <p className="text-sm font-bold text-emerald-900">
                Secure Payment
              </p>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Your data is protected by 256-bit SSL encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
