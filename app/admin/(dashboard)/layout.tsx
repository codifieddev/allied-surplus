import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bell, Shield } from "lucide-react";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (e) { }
  }

  if (!isAuthenticated && process.env.NODE_ENV !== "development") {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-ink flex flex-col min-w-0 min-h-screen">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gold/20 bg-charcoal px-6 sticky top-0 z-20 shadow-2xl shadow-black/60">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2 text-white/40 hover:text-gold transition-colors" />
            <Separator orientation="vertical" className="h-4 bg-white/10" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-gold transition-colors italic">
                    Command Console
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/10" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[10px] font-black text-gold uppercase tracking-[0.2em] italic">
                    Tactical Intelligence
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-olive/20 border border-olive/30 px-3 py-1.5 rounded-sm ring-1 ring-gold/5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/40" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Grid Pulse Active</span>
             </div>
             <div className="h-9 w-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all cursor-pointer">
                <Bell size={16} />
             </div>
             <div className="h-9 w-9 rounded-sm bg-olive border border-olive/40 ring-1 ring-gold/10 flex items-center justify-center text-white shadow-xl shadow-olive/20">
                <Shield size={18} strokeWidth={2.5} />
             </div>
          </div>
        </header>
        <div className="flex-1 flex flex-col p-6 md:p-10 w-full animate-in fade-in slide-in-from-bottom-2 duration-1000 overflow-x-hidden relative">
           {/* Subtle Carbon Fiber Pattern Overlay */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.015] pointer-events-none" />
           <div className="relative z-10 flex-1 flex flex-col">
              {children}
           </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
