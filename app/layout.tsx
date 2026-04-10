import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";
import StoreProvider from "./StoreProvider";
import { AnnotatorPlugin } from "@/components/annotationPlugin";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { cn } from "@/lib/utils";
import { getTenantRegistry } from "@/lib/getPageData";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import GetUser from "@/lib/GetAllDetails/GetUser";

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

const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tenantRegistry = await getTenantRegistry();
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let isAuthenticated = false;

  let user: any = null;

  if (token) {
    try {
      let check = jwt.verify(token, JWT_SECRET);
      if (check) {
        isAuthenticated = true;
        user = jwt.decode(token);
      }
    } catch (e) {
      isAuthenticated = false;
    }
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", barlow.variable, barlowCondensed.variable)}
    >
      <body>
        <StoreProvider>
          <Providers>
            <GetUser user={user} />
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
