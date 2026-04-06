"use client";
import { usePathname } from "next/navigation";
import SiteChrome from "./SiteChrome";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // If we are anywhere inside the admin panel, or on the login/signup pages, do not render the storefront header and footer
  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/signup") {
    return <>{children}</>;
  }

  // Otherwise, wrap children in the standard NestCraft header and footer
  return <SiteChrome>{children}</SiteChrome>;
}
