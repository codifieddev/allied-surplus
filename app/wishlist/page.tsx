"use client";

import React, { useEffect, useState } from "react";
import {
  Heart,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ChevronRight,
  Loader2,
  Sparkles,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchProducts } from "@/lib/store/products/productsThunk";
import { toggleWishlist } from "@/lib/store/auth/authSlice";
import { Link } from "@/lib/router";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ProductFormState } from "@/lib/store/products/productsSlices";
import { toast } from "sonner";
import { updateProfileThunk } from "@/lib/store/auth/authThunks";

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const wishlistIds = user?.wishlist || [];

  const handleRemove = async (product: ProductFormState) => {
    if (!user?._id) return;

    let copiedList = structuredClone(wishlistIds);
    const existingProduct = copiedList.find((prod) => prod._id === product._id);
    if (existingProduct) {
      copiedList = copiedList.filter((prod) => prod._id !== product._id);
    }
    try {
      const res = await dispatch(
        updateProfileThunk({
          userData: {
            wishlist: copiedList,
          },
        }),
      ).unwrap();
      if (res.success) {
        toast.success("Product removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove product from wishlist");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-ink px-6 text-center">
        <div className="w-20 h-20 bg-olive/10 border border-olive/20 rounded-full flex items-center justify-center mb-6">
          <Heart size={32} className="text-olive-lt opacity-50" />
        </div>
        <h1 className="font-head text-[32px] font-extrabold text-white uppercase italic mb-4">
          Access Denied
        </h1>
        <p className="text-white/50 max-w-sm mb-8">
          Please log in to view and manage your tactical wishlist.
        </p>
        <Link
          href="/login"
          className="bg-olive text-white font-head text-[13px] font-bold tracking-widest uppercase px-10 py-4 rounded-[2px] hover:bg-olive-lt transition-all"
        >
          Login to Account
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-root bg-ink min-h-screen pb-24">
      {/* HEADER BREADCRUMBS */}
      <div className="bg-charcoal/50 border-b border-white/5 py-4">
        <div className="container max-w-[1340px] px-6 mx-auto">
          <div className="flex items-center gap-2 font-head text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase italic">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <ChevronRight size={10} />
            <span className="text-gold">Wishlist</span>
          </div>
        </div>
      </div>

      <div className="container max-w-[1340px] px-6 mx-auto pt-16">
        {/* PAGE TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-head text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
              <div className="h-0.5 w-6 bg-gold" /> SAVED FOR MISSION
            </div>
            <h1 className="font-head text-[48px] md:text-[60px] font-extrabold tracking-[0.02em] text-white uppercase italic leading-none">
              Your <span className="text-gold not-italic">Wishlist</span>
            </h1>
            <p className="text-white/40 text-[14px] italic max-w-md">
              Review and manage your selected gear. Items saved here are ready
              for deployment when you are.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="pill bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-gold font-bold">{wishlistIds.length}</span>
              <span className="text-white/40 text-[11px] font-bold uppercase tracking-wider">
                Items Saved
              </span>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-olive-lt hover:text-gold transition-colors uppercase tracking-widest italic"
            >
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>

        {wishlistIds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {wishlistIds.map((product) => (
                <motion.article
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  className="product-card group bg-dark border border-white/6 rounded-[3px] overflow-hidden hover:border-olive/40 transition-all duration-300 shadow-xl"
                >
                  <div className="aspect-[4/5] bg-mid relative overflow-hidden">
                    <Link
                      href={`/product/${product.slug}`}
                      className="block w-full h-full"
                    >
                      <img
                        src={
                          product.gallery?.[0]?.url ||
                          "https://placehold.co/600x800?text=No+Image"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover grayscale-[0.2] brightness-[0.8] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                      />
                    </Link>

                    {/* ABSOLUTE ACTIONS */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={() => handleRemove(product)}
                        className="w-10 h-10 bg-red text-white border border-white/10 rounded-[2px] flex items-center justify-center hover:bg-olive transition-colors shadow-lg group/btn"
                        title="Remove from Wishlist"
                      >
                        <Trash2
                          size={18}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-olive-lt uppercase tracking-widest opacity-60">
                        {product.sku || "Tactical Gear"}
                      </div>
                      <h3 className="font-head text-[18px] font-bold text-white uppercase tracking-[0.02em] leading-tight group-hover:text-gold transition-colors line-clamp-2">
                        <Link href={`/product/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="text-[22px] font-head font-extrabold text-white">
                        ${product.pricing?.price || product.price || "0.00"}
                      </div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="bg-[#c9a227] text-black font-head text-[11px] font-bold tracking-widest uppercase px-5 py-3 rounded-[2px] hover:bg-[#5a6330] hover:text-white transition-all flex items-center gap-2 group/link italic"
                      >
                        View Details
                        <ArrowRight
                          size={14}
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 flex flex-col items-center text-center max-w-lg mx-auto"
          >
            <div className="w-24 h-24 bg-olive/5 border border-olive/10 rounded-full flex items-center justify-center mb-8 relative">
              <ShoppingBag size={40} className="text-white/10" />
              <Heart
                size={20}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold animate-pulse"
              />
            </div>
            <h2 className="font-head text-[32px] font-extrabold text-white uppercase italic mb-4">
              Wishlist is <span className="text-gold">Empty</span>
            </h2>
            <p className="text-white/40 mb-10 leading-relaxed italic">
              Your tactical arsenal is currently empty. Scouts are reporting new
              gear arrivals daily. Explore the shop to save equipment for your
              next mission.
            </p>
            <Link
              href="/shop"
              className="bg-[#c9a227] text-black font-head text-[13px] font-bold tracking-widest uppercase px-12 py-4 rounded-[2px] hover:bg-[#5a6330] hover:text-white transition-all active:translate-y-1 flex items-center gap-3"
            >
              <Search size={18} /> Browse Equipment
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
