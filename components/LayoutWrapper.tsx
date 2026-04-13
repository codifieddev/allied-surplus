"use client";
import { usePathname } from "next/navigation";
import SiteChrome from "./SiteChrome";

export default function LayoutWrapper({
  children,
  brandConfig,
}: {
  children: React.ReactNode;
  brandConfig: any;
}) {
  const pathname = usePathname();

  // If we are anywhere inside the admin panel, or on the login/signup pages, do not render the storefront header and footer
  const segments = pathname?.split("/") || [];
  const isExcluded = segments.some(
    (s) => s === "admin" || s === "login" || s === "signup",
  );

  if (isExcluded) {
    return <>{children}</>;
  }

  // Otherwise, wrap children in the standard NestCraft header and footer
  return <SiteChrome brandConfig={brandConfig}>{children}</SiteChrome>;
}
