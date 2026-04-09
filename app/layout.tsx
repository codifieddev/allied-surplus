import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";
import StoreProvider from "./StoreProvider";
import { AnnotatorPlugin } from "@/components/annotationPlugin";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { cn } from "@/lib/utils";
import { getTenantRegistry } from "@/lib/getPageData";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-head",
});

export const metadata: Metadata = {
  title: "Allied Surplus | Tactical Gear",
  description:
    "Allied Surplus is a tactical ecommerce experience built with Next.js.",
  icons: {
    icon: "/assets/Image/favicon.ico",
    shortcut: "/assets/Image/favicon.ico",
    apple: "/assets/Image/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tenantRegistry = await getTenantRegistry();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", barlow.variable, barlowCondensed.variable)}
    >
      <body>
        <StoreProvider>
          <Providers>
            <LayoutWrapper brandConfig={tenantRegistry}>
              {children}
            </LayoutWrapper>
            {/* <AnnotatorPlugin /> */}
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
