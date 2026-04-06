"use client";

import { useEffect, useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Search,
  ShoppingCart,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Menu,
  X,
  MapPin,
  User,
  Heart,
  Truck,
  Phone,
  Mail,
  Clock,
  Star,
  Terminal,
} from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";

const topbarLocations = [
  { label: "Phoenix", detail: "12450 N 35th Ave — (623) 435-2640" },
  { label: "Mesa", detail: "404 E Broadway Rd — (480) 699-6675" },
];

const navLinks = [
  { label: "Sales", highlight: true, href: "/shop?badge=sale" },
  { label: "Apparel", href: "/category/apparel", hasMega: true },
  { label: "Footwear", href: "/category/footwear" },
  { label: "Tactical", href: "/category/tactical" },
  { label: "Brands", href: "/brands" },
  { label: "Dog Tags", href: "/custom-dog-tags" },
  { label: "What's New", href: "/shop?sort=newest" },
  { label: "Our Blog", href: "/blog" },
];

const defaultCategoryPanel = [
  "Apparel & Uniforms",
  "Footwear",
  "Tactical & Law Enforcement",
  "Backpacks & Bags",
  "Headwear",
  "Emergency Supplies",
  "Custom Dog Tags",
  "Gifts & Novelties",
  "Genuine Military Surplus",
];

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [availableCategories, setAvailableCategories] =
    useState(defaultCategoryPanel);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openCartDrawer = () => {
    window.dispatchEvent(new CustomEvent("surplus-open-cart"));
  };

  const { nestCraftUser } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-ink text-cream flex flex-col font-body selection:bg-gold selection:text-ink overflow-x-hidden">
      {/* MOBILE MENU OVERLAY */}
      <div
        className={cn(
          "fixed inset-0 bg-black/80 z-[1000] transition-opacity duration-500 lg:hidden",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-charcoal border-r border-white/10 z-[1001] transition-transform duration-500 lg:hidden flex flex-col",
          isMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-[72px] border-b border-white/10 flex items-center justify-between px-6 bg-ink">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="h-8 w-8 bg-olive border border-olive-lt rounded-[2px] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 42 42" fill="none">
                <polygon
                  points="21,6 36,34 6,34"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="2.5"
                />
                <circle cx="21" cy="21" r="5" fill="#c9a227" />
              </svg>
            </div>
            <span className="font-head text-lg font-bold text-white tracking-widest uppercase">
              IronForge
            </span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase mb-3 italic">
                Operations
              </p>
              <ul className="space-y-1">
                <li className="border-b border-white/5 last:border-0 py-2">
                  <Link
                    href="/shop?badge=sale"
                    className="text-red font-head text-[15px] font-bold tracking-wider flex items-center gap-2 uppercase italic"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Star size={14} fill="currentColor" /> Sales
                  </Link>
                </li>
                {navLinks
                  .filter((l) => l.label !== "Sales")
                  .map((link) => (
                    <li
                      key={link.label}
                      className="border-b border-white/5 last:border-0 py-3"
                    >
                      <Link
                        href={link.href}
                        className="text-white/80 font-head text-[15px] font-bold tracking-wider uppercase hover:text-gold transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase mb-3 italic">
                Mission Support
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/account"
                  className="flex items-center gap-3 text-white/60 hover:text-gold text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={16} /> My Account
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 text-white/60 hover:text-gold text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={16} /> Wishlist
                </Link>
                <Link
                  href="/order-tracking"
                  className="flex  items-center gap-3 text-white/60 hover:text-gold text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Truck size={16} /> Order Tracking
                </Link>
                {nestCraftUser?.role !== "customer" && (
                  <Link
                    href="/admin"
                    className="flex p-1 border-2 border-gold bg-white text-black items-center gap-1.5  transition-colors"
                  >
                    <Terminal size={16} /> Admin
                  </Link>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex flex-col gap-1">
                <p className="text-[12px] font-bold text-white italic underline underline-offset-4 decoration-gold/50">
                  Need Assistance?
                </p>
                <p className="text-[11px] text-white/40 leading-relaxed italic">
                  Direct line to mission command: Mon-Sat, 9AM-6PM
                </p>
              </div>
              <a
                href="tel:6234352640"
                className="flex items-center gap-3 text-gold hover:text-gold-lt font-head font-bold text-[16px] transition-colors"
              >
                <Phone size={16} /> (623) 435-2640
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 bg-dark border-t border-white/10 flex gap-4">
          {[Facebook, Instagram, Youtube, Twitter].map((Icon, idx) => (
            <a
              key={idx}
              href="#"
              className="w-8 h-8 bg-charcoal border border-white/5 rounded-[2px] flex items-center justify-center text-white/40 hover:text-gold transition-colors"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </aside>

      {/* TOPBAR (Desktop only) */}
      <div className="topbar bg-ink border-b border-white/7 font-body text-[12px] text-white/55 hidden md:block">
        <div className="topbar__inner container flex items-center justify-between h-[36px] max-w-[1340px] px-6 mx-auto">
          <div className="topbar__locations flex gap-6 items-center">
            <div className="topbar__loc flex items-center gap-1.5">
              <MapPin size={12} className="text-gold" />
              <span>Phoenix: 12450 N 35th Ave &mdash; (623) 435-2640</span>
            </div>
            <div className="topbar__loc lg:flex hidden items-center gap-1.5 ">
              <MapPin size={12} className="text-gold" />
              <span>Mesa: 404 E Broadway Rd &mdash; (480) 699-6675</span>
            </div>
          </div>
          <div className="topbar__links flex gap-5 items-center">
            <Link
              href="/account"
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <User size={12} /> My Account
            </Link>
            <span className="topbar__sep text-white/20">|</span>
            <Link
              href="/wishlist"
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Heart size={12} /> Wishlist
            </Link>
            <span className="topbar__sep text-white/20">|</span>
            <Link
              href="/order-tracking"
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Truck size={12} /> Order Tracking
            </Link>
            {nestCraftUser?.role !== "customer" && (
              <Link
                href="/admin"
                className="flex p-1 border-2 border-gold items-center gap-1.5 hover:text-gold transition-colors"
              >
                <Terminal size={12} /> Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="header bg-charcoal border-b-2 border-olive sticky top-0 z-[900] shadow-md">
        <div className="header__inner container flex items-center gap-4 lg:gap-6 h-[72px] max-w-[1340px] px-4 sm:px-6 mx-auto">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden h-10 w-10 px-2 flex items-center justify-center text-white/60 hover:text-gold transition-colors border border-white/10 rounded-[2px]"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="header__logo shrink-0 flex items-center gap-2.5"
          >
            <div className="h-[38px] w-[38px] md:h-[42px] md:w-[42px] bg-olive border border-olive-lt rounded-[3px] flex items-center justify-center">
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                viewBox="0 0 42 42"
                fill="none"
              >
                <polygon
                  points="21,6 36,34 6,34"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="2.5"
                />
                <circle cx="21" cy="21" r="5" fill="#c9a227" />
              </svg>
            </div>
            <div className="logo-text hidden sm:flex flex-col leading-none">
              <span className="font-head text-[18px] md:text-[22px] font-extrabold tracking-[0.06em] text-white uppercase">
                IronForge
              </span>
              <span className="font-head text-[9px] md:text-[11px] font-normal tracking-[0.18em] text-gold uppercase">
                Tactical Surplus
              </span>
            </div>
          </Link>

          {/* Search (Adjusted for mobile) */}
          <div className="header__search  sm:flex flex-1 max-w-[520px] items-stretch border-[1.5px] border-mid rounded-[3px] overflow-hidden transition-all focus-within:border-olive-lt ml-2 lg:ml-4">
            <select className="search-category hidden lg:block bg-mid text-white/75 text-[11px] font-medium tracking-[0.03em] px-3 border-none cursor-pointer outline-none hover:bg-olive hover:text-white transition-all italic">
              <option>All Categories</option>
              <option>Apparel</option>
              <option>Footwear</option>
              <option>Tactical</option>
            </select>
            <input
              type="text"
              placeholder="Search assets..."
              className="flex-1 bg-dark border-none text-white px-3.5 text-[13px] md:text-[14px] outline-none placeholder:text-white/30 italic min-w-0"
            />
            <button className="search-btn bg-olive text-white px-4 flex items-center justify-center hover:bg-olive-lt transition-all">
              <Search size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Actions */}
          <div className="header__actions ml-auto flex items-center gap-1.5 shrink-0">
            <Link
              href="/account"
              className="hdr-action hidden  md:flex flex-col items-center gap-[2px] px-3 py-2 rounded-[3px] text-white/75 text-[10px] tracking-[0.06em] uppercase hover:bg-white/5 hover:text-white transition-all group"
            >
              <User
                size={20}
                className="group-hover:scale-110 transition-transform"
              />{" "}
              Account
            </Link>
            <button
              onClick={openCartDrawer}
              className="hdr-action flex flex-col items-center gap-[2px] px-3 py-2 rounded-[3px] text-white/75 text-[10px] tracking-[0.06em] uppercase hover:bg-white/5 hover:text-white transition-all group relative"
            >
              <ShoppingCart
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="hidden sm:inline">Cart</span>
              <span className="cart-badge absolute top-[5px] right-[8px] bg-red text-white text-[9px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                0
              </span>
            </button>
            <a
              href="tel:6234352640"
              className="header__cta hidden md:flex bg-red text-white font-head text-[13px] font-bold tracking-[0.1em] uppercase px-4 md:px-5 py-2.5 rounded-[3px] hover:bg-red-lt transition-all active:translate-y-[1px] ml-1 sm:ml-2 flex items-center gap-2"
            >
              <Phone size={14} fill="currentColor" />{" "}
              <span className="hidden sm:inline">Call Command</span>
            </a>
          </div>
        </div>

        {/* MOBILE SEARCH BAR (Visible only on very small screens) */}
        <div className="sm:hidden px-4 pb-3 flex">
          <div className="flex-1 flex items-stretch border border-white/10 rounded-[2px] overflow-hidden bg-dark">
            <input
              type="text"
              placeholder="Search operational gear..."
              className="flex-1 bg-transparent px-3 text-[13px] italic text-white outline-none h-10"
            />
            <button className="bg-olive px-3 text-white">
              <Search size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* NAV (Desktop only) */}
      <nav className="nav bg-dark border-b border-white/6 relative z-[800] hidden lg:block">
        <div className="nav__inner container flex items-stretch max-w-[1340px] px-6 h-[48px] mx-auto">
          <button
            className="py-2 me-3 bg-olive flex items-center gap-2.5 px-5 font-head text-[14px] font-bold tracking-[0.1em] uppercase text-white hover:bg-olive-lt transition-all shrink-0 border-none group"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <Menu size={18} strokeWidth={2} />
            Sector Inventory
            <ChevronDown
              size={14}
              strokeWidth={2.5}
              className={cn(
                "transition-transform",
                isCategoryOpen && "rotate-180",
              )}
            />
          </button>

          <ul className="nav__links flex items-stretch flex-1">
            <li className="nav-item flex items-stretch">
              <Link
                href="/shop?badge=sale"
                className="highlight text-red flex items-center gap-1.5 px-4.5 font-head text-[14px] font-bold tracking-[0.08em] uppercase hover:bg-white/5 transition-all"
              >
                <Star size={13} fill="currentColor" /> FIELD SALES
              </Link>
            </li>
            {navLinks
              .filter((l) => l.label !== "Sales")
              .map((link) => (
                <li
                  key={link.label}
                  className="nav-item group flex items-stretch relative"
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 px-[18px] font-head text-[14px] font-bold tracking-[0.08em] uppercase text-white/80 hover:text-gold hover:bg-white/5 transition-all outline-none"
                  >
                    {link.label}
                    {link.hasMega && (
                      <ChevronDown
                        size={10}
                        strokeWidth={2.5}
                        className="group-hover:rotate-180 transition-transform"
                      />
                    )}
                  </Link>
                  {link.hasMega && (
                    <div className="mega-menu absolute top-full left-0 bg-charcoal border border-white/7 border-t-2 border-t-olive shadow-lg min-w-[680px] p-7 grid grid-cols-4 gap-7 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-[900]">
                      <div>
                        <div className="mega-col-title font-head text-[11px] font-bold tracking-[0.14em] uppercase text-gold pb-2.5 border-b border-white/10 mb-2.5">
                          Uniforms
                        </div>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          ACU's
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          BDU's
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          ABU's
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Flight Suits
                        </Link>
                      </div>
                      <div>
                        <div className="mega-col-title font-head text-[11px] font-bold tracking-[0.14em] uppercase text-gold pb-2.5 border-b border-white/10 mb-2.5">
                          Shirts
                        </div>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Tactical Shirts
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Short Sleeve
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Long Sleeve
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Grunt Style
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Erazor Bits
                        </Link>
                      </div>
                      <div>
                        <div className="mega-col-title font-head text-[11px] font-bold tracking-[0.14em] uppercase text-gold pb-2.5 border-b border-white/10 mb-2.5">
                          Bottoms
                        </div>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Tactical Pants
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Shorts
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Belts
                        </Link>
                      </div>
                      <div>
                        <div className="mega-col-title font-head text-[11px] font-bold tracking-[0.14em] uppercase text-gold pb-2.5 border-b border-white/10 mb-2.5">
                          Outerwear
                        </div>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Jackets
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          MA-1 Jackets
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Soft Shells
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Children & Infants
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>

        {/* Category Side Panel */}
        <div
          className={cn(
            "cat-panel absolute top-full left-0 w-[260px] bg-charcoal border border-white/7 border-t-2 border-t-olive shadow-lg z-[850] transition-all duration-200",
            isCategoryOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible translate-y-1",
          )}
        >
          {availableCategories.map((cat) => (
            <div
              key={cat}
              className="cat-panel-item flex items-center justify-between px-[18px] py-2.5 text-[13px] text-white/75 hover:bg-white/5 hover:text-white transition-all cursor-pointer group italic"
            >
              <span>{cat}</span>
              <ChevronRight
                size={12}
                className="opacity-40 group-hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </nav>

      <main className="flex-1 w-full relative z-0">{children}</main>

      {/* FOOTER */}
      <footer className="footer bg-charcoal border-t border-white/8 pt-[60px] pb-[80px] px-6">
        <div className="container max-w-[1340px] mx-auto">
          <div className="footer__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-6">
            {/* Brand */}
            <div className="footer__brand">
              <Link
                href="/"
                className="footer-logo flex items-center gap-2.5 mb-6"
              >
                <div className="h-[36px] w-[36px] bg-olive border border-olive-lt rounded-[3px] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 42 42" fill="none">
                    <polygon
                      points="21,6 36,34 6,34"
                      fill="none"
                      stroke="#c9a227"
                      strokeWidth="2.5"
                    />
                    <circle cx="21" cy="21" r="5" fill="#c9a227" />
                  </svg>
                </div>
                <div className="logo-text flex flex-col leading-none">
                  <span className="font-head text-[18px] font-extrabold tracking-wider text-white uppercase">
                    IronForge
                  </span>
                  <span className="font-head text-[10px] font-normal tracking-widest text-gold uppercase">
                    Tactical Surplus
                  </span>
                </div>
              </Link>
              <p className="text-[15px] text-white/70 leading-relaxed max-w-[320px] mb-6 italic">
                America's trusted source for military surplus, tactical gear,
                and professional-grade equipment since 2001. Serving veterans,
                law enforcement, and outdoor enthusiasts nationwide.
              </p>
              <div className="footer-socials flex gap-3">
                {[Facebook, Instagram, Youtube, Twitter].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="social-btn w-[34px] h-[34px] bg-dark border border-white/10 rounded-[3px] flex items-center justify-center text-white/60 hover:bg-olive hover:text-white hover:border-olive transition-all"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="footer-col-title font-head text-[16px] font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-white/5">
                Top Sectors
              </div>
              <ul className="footer-links flex flex-col gap-2.5 text-[15px] text-white/65">
                <li>
                  <Link
                    href="/shop"
                    className="hover:text-white transition-colors italic"
                  >
                    Apparel & Uniforms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="hover:text-white transition-colors italic"
                  >
                    Tactical Pants & Shirts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="hover:text-white transition-colors italic"
                  >
                    Military Footwear
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="hover:text-white transition-colors italic"
                  >
                    Backpacks & Bags
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="hover:text-white transition-colors italic"
                  >
                    Custom Dog Tags
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mission Support */}
            <div>
              <div className="footer-col-title font-head text-[16px] font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-white/5">
                Mission Support
              </div>
              <ul className="footer-links flex flex-col gap-2.5 text-[15px] text-white/65">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors italic"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors italic"
                  >
                    Customer Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="hover:text-white transition-colors italic"
                  >
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="hover:text-white transition-colors italic"
                  >
                    Returns & Replacement
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors italic"
                  >
                    Contact Command
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Command */}
            <div>
              <div className="footer-col-title font-head text-[16px] font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-white/5">
                Contact Command
              </div>
              <div className="footer-contact flex flex-col gap-6">
                <div className="footer-contact-item flex gap-3 items-start">
                  <MapPin size={16} className="text-gold mt-1 shrink-0" />
                  <div className="footer-contact-text">
                    <h5 className="text-white font-bold text-[14px] italic">
                      Tactical HQ (Phoenix)
                    </h5>
                    <p className="text-[13px] text-white/50 mb-0.5 whitespace-nowrap">
                      12450 N. 35th Ave, Phoenix
                    </p>
                    <a
                      href="tel:6234352640"
                      className="text-[13px] text-gold italic"
                    >
                      (623) 435-2640
                    </a>
                  </div>
                </div>
                <div className="footer-contact-item flex gap-3 items-start">
                  <Mail size={16} className="text-gold mt-1 shrink-0" />
                  <div className="footer-contact-text">
                    <h5 className="text-white font-bold text-[14px] italic">
                      Secure Email
                    </h5>
                    <a
                      href="mailto:info@ironforgesurplus.com"
                      className="text-[14px] text-gold italic"
                    >
                      info@ironforgesurplus.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer__bottom mt-[40px] pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] tracking-[0.2em] font-medium text-white/30 uppercase italic text-center sm:text-left">
            <p className="footer-copy">
              &copy; 2025 IronForge Tactical Surplus. |{" "}
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>{" "}
              |{" "}
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
            </p>
            <div className="footer-payments flex items-center gap-3">
              {["Visa", "MC", "PayPal"].map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 border border-white/10 rounded-[2px] text-[10px] text-white/40"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <button
        className={cn(
          "back-to-top fixed bottom-8 right-8 w-11 h-11 bg-olive text-white rounded-full flex items-center justify-center transition-all duration-500 z-[999] shadow-xl hover:bg-olive-lt shadow-black/50 overflow-hidden group",
          isScrolled
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none",
        )}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp
          size={18}
          className="group-hover:-translate-y-1 transition-transform"
        />
      </button>
    </div>
  );
}
