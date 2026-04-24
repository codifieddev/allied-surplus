"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Layers,
  ChevronUp,
  User2,
  Settings,
  Bell,
  Sparkles,
  Search,
  HelpCircle,
  Component,
  ChevronRight,
  Database,
  Tags,
  ListTree,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  ChevronDown,
  User,
  Shield,
  Zap,
  Activity,
  Cpu,
  BarChart3,
  Server,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInput,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/store/auth/authSlice";
import { logoutThunk } from "@/lib/store/auth/authThunks";
import { AppDispatch } from "@/lib/store/store";
import Image from "next/image";

const NAV_ITEMS = [
  {
    group: "Strategic Overview",
    items: [
      {
        label: " Dashboard",
        href: "/admin",
        icon: BarChart3,
        exact: true,
        badge: null,
      },
      {
        label: " Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        exact: false,
        // badge: "3",
      },
      {
        label: "Branding",
        href: "/admin/branding",
        icon: Sparkles,
        exact: false,
        badge: null,
      },
      {
        label: "Theme",
        href: "/admin/theme",
        icon: Palette,
        exact: false,
        badge: null,
      },
    ],
  },
  {
    group: "Logistics Control",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        exact: false,
        badge: null,
      },
      {
        label: " Categories",
        href: "/admin/categories",
        icon: Layers,
        exact: false,
        badge: null,
      },
      {
        label: " Attributes",
        href: "/admin/attributes",
        icon: Tags,
        exact: false,
        badge: null,
      },
      // { label: " Variants", href: "/admin/variants", icon: ListTree, exact: false, badge: null },
    ],
  },
  {
    group: "Communications Hub",
    items: [
      {
        label: " Pages",
        href: "/admin/pages",
        icon: FileText,
        exact: false,
        badge: null,
      },
      {
        label: " Media",
        href: "/admin/media",
        icon: ImageIcon,
        exact: false,
        badge: null,
      },
      {
        label: " Engine",
        href: "/admin/sync",
        icon: Cpu,
        exact: false,
        badge: "Live",
      },
    ],
  },
  {
    group: "Personnel Intelligence",
    items: [
      {
        label: "Personnel",
        href: "/admin/customers",
        icon: User,
        exact: false,
        badge: null,
      },
      {
        label: "Command Staff",
        href: "/admin/users",
        icon: Shield,
        exact: false,
        badge: "Admin",
      },
    ],
  },
  {
    group: "Field Intelligence",
    items: [
      {
        label: "Form Matrix",
        href: "/admin/forms",
        icon: Zap,
        exact: false,
        badge: null,
      },
      {
        label: "Captured Data",
        href: "/admin/form-submissions",
        icon: Database,
        exact: false,
        badge: "New",
      },
    ],
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    dispatch(logoutThunk());
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <Sidebar variant="sidebar" className="border-r border-white/5 bg-ink">
      {/* Header - Sync with Storefront Olive/Gold accent */}
      <SidebarHeader className="p-0 bg-olive border-b-2 border-gold shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="h-20 flex px-4 items-center justify-start gap-3 relative z-10">
          <div className="object-contain flex items-center justify-center rounded-sm bg-ink/30 border border-gold/40 shadow-2xl ring-1 ring-gold/20">
            <Image
              src="/assets/Image/footer-logo-2.webp"
              alt="Footer Logo"
              width={80}
              height={60}
              className=""
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-head font-black tracking-widest text-white uppercase leading-none italic">
              Allied Surplus
            </h2>
            <span className="text-[9px] font-black text-ink uppercase tracking-[0.4em] italic mt-0.5">
              Admin Console
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-6 scrollbar-none space-y-10 bg-ink flex flex-col">
        {NAV_ITEMS.map((group) => (
          <SidebarGroup key={group.group} className="px-0">
            <SidebarGroupLabel className="px-2 text-[9px] font-black uppercase tracking-[0.4em] text-white mb-6 flex items-center gap-3">
              <span className="w-4 h-px bg-white/5" /> {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label} className="px-0">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href, !!item.exact)}
                      className={cn(
                        "h-14 px-4 rounded-sm transition-all duration-300 group flex items-center justify-between border border-transparent shadow-inner",
                        isActive(item.href, !!item.exact)
                          ? "bg-olive/10 border-olive/30 text-gold shadow-2xl shadow-gold/5"
                          : "text-white/40 hover:text-white hover:bg-white/5 hover:border-white/5",
                      )}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-4 w-full relative group"
                      >
                        {isActive(item.href, !!item.exact) && (
                          <div className="absolute -left-2 top-1/4 bottom-1/4 w-1 bg-gold rounded-full shadow-[0_0_15px_rgba(201,162,39,0.8)]" />
                        )}
                        <item.icon
                          size={18}
                          className={cn(
                            "transition-transform group-hover:scale-110",
                            isActive(item.href, !!item.exact)
                              ? "text-gold"
                              : "text-white/20 group-hover:text-white",
                          )}
                        />
                        <span className="text-[13px] font-bold tracking-wider truncate italic text-left flex-1">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={cn(
                              "ml-auto flex h-5 px-2 items-center justify-center rounded-sm text-[9px] font-black uppercase tracking-widest shadow-lg",
                              item.badge === "Live"
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                : "bg-gold/10 text-gold border border-gold/30",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-0 border-t border-white/5 bg-charcoal">
        <div className="flex flex-col p-3 space-y-4">
          <Link
            href="/admin/account-settings"
            className="flex items-center justify-between p-2 rounded-sm border border-white/5 bg-ink/40 shadow-xl group hover:border-gold/30 hover:bg-ink/60 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-sm bg-olive/10 border border-olive/30 flex items-center justify-center text-olive-lt shadow-inner ring-1 ring-gold/5 group-hover:border-gold/30 transition-colors">
                <User size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.1em] leading-none group-hover:text-gold transition-colors">
                  Command Admin
                </span>
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest italic mt-1">
                  Status: Primary
                </span>
              </div>
            </div>
            <ChevronUp
              size={14}
              className="text-white/20 group-hover:text-gold transition-colors"
            />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="flex-1 h-11 rounded-sm bg-ink border border-white/10 text-white/30 text-[9px] font-black uppercase tracking-widest hover:bg-red hover:text-white hover:border-red transition-all flex items-center justify-center gap-2 drop-shadow-2xl active:scale-95"
            >
              <LogOut size={14} /> Terminate
            </button>
            <button className="w-11 h-11 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
