"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from '@/lib/router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  ShieldCheck,
  Info,
  Check
} from 'lucide-react';
import { products, categories } from '../../data/products';
import { useAppDispatch } from '../../lib/store/hooks';
import { addToCart } from '../../lib/store/features/cartSlice';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');
  const [isAdded, setIsAdded] = useState(false);
  const dispatch = useAppDispatch();

  const product = useMemo(() => {
    return products.find(p => p.id === Number(id));
  }, [id]);

  const currentCategory = useMemo(() => {
    if (!product) return null;
    return categories.find(c => c.name.toLowerCase() === product.category.toLowerCase());
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto px-[5%] py-32 text-center">
        <h1 className="text-4xl font-black mb-4">Product Not Found</h1>
        <p className="text-muted font-bold mb-8">The product you are looking for does not exist or has been moved.</p>
        <Link href="/shop" className="bg-primary text-white px-8 py-4 rounded-full font-black uppercase tracking-wider">
          Back to Shop
        </Link>
      </div>
    );
  }

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className=" mx-auto px-[5%] pb-20">
      {/* Breadcrumbs */}
      <div className="crumbs">
        <Link href="/">Home</Link> <span>›</span>
        <Link href="/shop">Shop</Link> <span>›</span>
        {currentCategory && (
          <>
            <Link href={`/category/${currentCategory.id}`}>{product.category}</Link> <span>›</span>
          </>
        )}
        <strong>{product.title}</strong>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 items-start">
        {/* LEFT: GALLERY */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-border bg-muted/5">
            <div className="badge absolute top-6 left-6 z-10 dark:bg-surface/62 dark:border-secondary/18">{product.badge}</div>
            <img 
              src={product.img} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[product.img, product.img, product.img, product.img].map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-secondary shadow-md' : 'border-border hover:border-secondary/40'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: INFO */}
        <div className="lg:sticky lg:top-[128px] space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <small className="text-secondary tracking-[3px] uppercase text-[10px] font-black mb-2 block">{product.category}</small>
                <h1 className="text-[48px] font-black leading-[1.05] tracking-tight">{product.title}</h1>
              </div>
              <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted/10 transition-all shrink-0">
                <Heart size={20} />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-[32px] font-black text-foreground/90">{product.price}</div>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-secondary fill-secondary" : "text-border"} />
                  ))}
                </div>
                <span className="text-[11px] font-black uppercase tracking-[1px] text-muted">{product.rating.toFixed(1)} ({product.reviews} Reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-muted font-bold leading-relaxed text-[15px]">
            {product.description}
          </p>

          {/* Options */}
          <div className="space-y-6 py-6 border-y border-border/60">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[2px] text-foreground/70">Select Color</label>
              <div className="flex gap-3">
                {['#0D6533', '#98C45F', '#0B1610', '#55685B'].map((color, i) => (
                  <button 
                    key={i} 
                    className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${i === 0 ? 'border-secondary scale-110' : 'border-transparent hover:scale-105'}`}
                  >
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[2px] text-foreground/70">Select Size</label>
              <div className="flex flex-wrap gap-2.5">
                {['Small', 'Medium', 'Large', 'Extra Large'].map((size, i) => (
                  <button 
                    key={size} 
                    className={`h-11 px-6 rounded-xl border font-black text-[13px] transition-all ${i === 1 ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border hover:border-secondary/40'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <div className="flex items-center h-14 rounded-full border border-border bg-surface px-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/10 transition-all"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-black text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/10 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className={`flex-1 h-14 rounded-full text-xs font-black uppercase tracking-[2px] shadow-lg transition-all flex items-center justify-center gap-2 ${
                isAdded 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                  : 'bg-primary text-white shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={18} /> Added to Bag
                </>
              ) : (
                <>Add to Bag — {product.price}</>
              )}
            </button>
          </div>

          {/* Accordions */}
          <div className="space-y-px bg-border rounded-2xl overflow-hidden border border-border">
            {[
              { id: 'details', title: 'Product Details', icon: <Info size={18} />, content: 'Handcrafted with precision using sustainable materials. Features a durable frame and premium upholstery designed for long-lasting comfort.' },
              { id: 'shipping', title: 'Shipping Info', icon: <Truck size={18} />, content: 'Free standard shipping on all orders over $500. Delivered within 5-7 business days with real-time tracking.' },
              { id: 'returns', title: 'Returns & Warranty', icon: <RotateCcw size={18} />, content: '30-day hassle-free returns and a 2-year comprehensive warranty on all structural components.' }
            ].map((item) => (
              <div key={item.id} className="bg-surface">
                <button 
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 flex items-center justify-between gap-4 hover:bg-muted/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-secondary">{item.icon}</span>
                    <span className="text-[13px] font-black uppercase tracking-[1px]">{item.title}</span>
                  </div>
                  {openAccordion === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <AnimatePresence>
                  {openAccordion === item.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-[0_20px_20px_52px] text-[14px] text-muted font-bold leading-relaxed">
                        {item.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <section className="mt-24">
        <div className="flex border-b border-border mb-10 overflow-x-auto no-scrollbar">
          {['overview', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-[11px] font-black uppercase tracking-[2px] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-secondary' : 'text-muted hover:text-foreground'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-[42px] font-black leading-[1.1]">Crafted for Modern Living</h2>
                <p className="text-muted font-bold text-lg leading-relaxed">
                  Our {product.title} is more than just a piece of furniture; it's a statement of style and a commitment to quality. Every detail has been carefully considered to provide you with the best possible experience.
                </p>
                <ul className="space-y-4">
                  {['Sustainable Materials', 'Ergonomic Design', 'Hand-Finished Details', 'Easy Assembly'].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 font-bold text-foreground/80">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[32px] overflow-hidden aspect-video border border-border">
                <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200" alt="Detail" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { label: 'Dimensions', value: '80cm x 75cm x 85cm' },
                { label: 'Weight', value: '12kg' },
                { label: 'Material', value: 'Solid Oak, Premium Suede' },
                { label: 'Assembly', value: 'Partial Assembly Required' },
                { label: 'Origin', value: 'Handcrafted in India' }
              ].map((spec) => (
                <div key={spec.label} className="flex justify-between p-4 border-b border-border/50">
                  <span className="text-[11px] font-black uppercase tracking-[2px] text-muted">{spec.label}</span>
                  <span className="font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12">
              <div className="space-y-6">
                <div className="p-8 rounded-3xl border border-border bg-surface text-center space-y-2">
                  <div className="text-[64px] font-black leading-none">{product.rating.toFixed(1)}</div>
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className={i < Math.floor(product.rating) ? "text-secondary fill-secondary" : "text-border"} />
                    ))}
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[2px] text-muted">Based on {product.reviews} reviews</p>
                </div>
                <button className="w-full h-14 rounded-full border border-secondary text-secondary font-black text-xs uppercase tracking-[2px] hover:bg-secondary hover:text-white transition-all">
                  Write a Review
                </button>
              </div>
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4 pb-8 border-b border-border/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted/10 flex items-center justify-center font-black text-xs">JD</div>
                        <div>
                          <div className="font-bold text-sm">John Doe</div>
                          <div className="text-[10px] uppercase tracking-[1px] text-muted">Verified Buyer</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="text-secondary fill-secondary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted font-bold leading-relaxed">
                      Absolutely love this chair! The quality is outstanding and it looks even better in person. Extremely comfortable and fits perfectly in my living room.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      <section className="mt-32">
        <div className="flex justify-between items-end mb-10">
          <div>
            <small className="text-secondary tracking-[3px] uppercase text-[10px] font-black mb-2 block">Curated for you</small>
            <h2 className="text-[42px] font-black leading-[1.1]">Related Products</h2>
          </div>
          <Link href="/categories" className="text-[11px] font-black uppercase tracking-[2px] text-secondary border-b border-secondary pb-1 hover:opacity-70 transition-all">
            View All
          </Link>
        </div>
          {relatedProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} className="product-card group">
                  <div className="badge dark:bg-surface/62 dark:border-secondary/18">{p.badge}</div>
                  <div className="img-wrap">
                    <img src={p.img} alt={p.title} />
                  </div>
                  <div className="card-body">
                    <div className="font-heading text-[26px] font-black leading-[1.05] mb-2.5 text-foreground/92">{p.title}</div>
                    <div className="flex justify-between items-center gap-2.5 flex-wrap font-black tracking-[1px] text-foreground/75">
                      <span className="text-muted/92 text-[13px] uppercase tracking-[2px]">{p.price}</span>
                      <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-muted/92 whitespace-nowrap">
                        <Star size={12} className="text-secondary fill-secondary" /> {p.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </section>
    </div>
  );
};

export default ProductDetailPage;
