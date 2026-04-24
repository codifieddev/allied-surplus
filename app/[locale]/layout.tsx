// import type { Metadata } from "next";
// import "../globals.css";
// import Providers from "@/components/Providers";
// import LayoutWrapper from "@/components/LayoutWrapper";
// import StoreProvider from "@/app/StoreProvider";
// import { AnnotatorPlugin } from "@/components/annotationPlugin";
// import { Barlow, Barlow_Condensed } from "next/font/google";
// import { cn } from "@/lib/utils";
// import {
//   getBusinessBlueprint,
//   getTenantRegistry,
// } from "@/lib/getPageData";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import GetUser from "@/lib/GetAllDetails/GetUser";
// import { ObjectId } from "mongodb";
// import { connectTenantDB } from "@/lib/db";
// import BrandingInitializer from "@/components/branding/BrandingInitializer";
// import ThemeInitializer from "@/components/theme/ThemeInitializer";
// import { getAuthUser } from "@/lib/getSingleUser";
// import BusinessBlueprintDataInitialiser from "@/components/businessBluePrints/BusinessBlueprintDataInitialiser";

// const barlow = Barlow({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-body",
// });

// const barlowCondensed = Barlow_Condensed({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700", "800"],
//   variable: "--font-head",
// });

// export const metadata: Metadata = {
//   title: "Allied Surplus | Tactical Gear",
//   description:
//     "Allied Surplus is a tactical ecommerce experience built with Next.js.",
//   icons: {
//     icon: "/assets/Image/favicon.ico",
//     shortcut: "/assets/Image/favicon.ico",
//     apple: "/assets/Image/favicon.ico",
//   },
// };

// const JWT_SECRET =
//   process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

// export default async function RootLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;
//   const [tenantRegistry, businessBlueprint] = await Promise.all([
//     getTenantRegistry(),
//     getBusinessBlueprint(),
//   ]);

//   const cookieStore = await cookies();
//   const token = cookieStore.get("auth_token")?.value;

//   let isAuthenticated = false;

//   let user: any = null;

//   if (token) {
//     try {
//       user = await getAuthUser(token);
//       if (user) {
//         isAuthenticated = true;
//       }
//       // let check = jwt.verify(token, JWT_SECRET);
//       // if (check) {
//       //   isAuthenticated = true;
//       //   let decodedUser: any = jwt.decode(token);
//       //   let nonserialise = await db
//       //     .collection("users")
//       //     .findOne({ _id: new ObjectId(decodedUser!.id) });
//       //   user = JSON.parse(JSON.stringify(nonserialise));
//       // }
//     } catch (e) {
//       isAuthenticated = false;
//     }
//   }

//   return (
//     <html
//       lang={locale || "en"}
//       suppressHydrationWarning
//       className={cn("font-sans", barlow.variable, barlowCondensed.variable)}
//     >
//       <body>
//         <StoreProvider>
//           <BrandingInitializer initialConfig={tenantRegistry} />
//           <BusinessBlueprintDataInitialiser
//             businessBlueprint={businessBlueprint}
//           />
//           <ThemeInitializer />
//           <Providers>
//             <GetUser user={user} />
//             <LayoutWrapper brandConfig={tenantRegistry}>
//               {children}
//             </LayoutWrapper>
//             {/* <AnnotatorPlugin /> */}
//           </Providers>
//         </StoreProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "../globals.css";
import Providers from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";
import StoreProvider from "@/app/StoreProvider";
import { AnnotatorPlugin } from "@/components/annotationPlugin";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { cn } from "@/lib/utils";
import { getBusinessBlueprint, getTenantRegistry } from "@/lib/getPageData";
import { cookies } from "next/headers";

import GetUser from "@/lib/GetAllDetails/GetUser";
import BrandingInitializer from "@/components/branding/BrandingInitializer";
import ThemeInitializer from "@/components/theme/ThemeInitializer";
import { getAuthUser } from "@/lib/getSingleUser";
import BusinessBlueprintDataInitialiser from "@/components/businessBluePrints/BusinessBlueprintDataInitialiser";

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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Get token first
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // Fetch all data in parallel
  const [tenantRegistry, businessBlueprint, user] = await Promise.all([
    getTenantRegistry(),
    getBusinessBlueprint(),
    token ? getAuthUser(token).catch(() => null) : Promise.resolve(null),
  ]);

  return (
    <html
      lang={locale || "en"}
      suppressHydrationWarning
      className={cn("font-sans", barlow.variable, barlowCondensed.variable)}
    >
      <body>
        <StoreProvider>
          <BrandingInitializer initialConfig={tenantRegistry} />
          <BusinessBlueprintDataInitialiser
            businessBlueprint={businessBlueprint}
          />
          <ThemeInitializer />
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
