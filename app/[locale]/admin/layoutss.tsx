import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { cn } from "@/lib/utils";
import { getTenantRegistry } from "@/lib/getPageData";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import GetUser from "@/lib/GetAllDetails/GetUser";
import { ObjectId } from "mongodb";
import { connectTenantDB } from "@/lib/db";
import BrandingInitializer from "@/components/branding/BrandingInitializer";
import StoreProvider from "@/app/StoreProvider";
import { getAuthUser } from "@/lib/getSingleUser";

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
  title: "Admin Dashboard | Allied Surplus",
  description: "Admin management panel.",
};

const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenantRegistry = await getTenantRegistry();
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const db = await connectTenantDB();

  let user: any = await getAuthUser(token || "");
  // let user: any = null;

  console.log("+++++++>>>", user);

  // if (token) {
  //   try {
  //     let check = jwt.verify(token, JWT_SECRET);
  //     if (check) {
  //       let decodedUser: any = jwt.decode(token);
  //       let nonserialise = await db
  //         .collection("users")
  //         .findOne({ _id: new ObjectId(decodedUser!.id) });
  //       user = JSON.parse(JSON.stringify(nonserialise));
  //     }
  //   } catch (e) {
  //     // Not authenticated
  //   }
  // }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", barlow.variable, barlowCondensed.variable)}
    >
      <body className="bg-ink antialiased">
        <StoreProvider>
          <BrandingInitializer initialConfig={tenantRegistry} />
          <Providers>
            <GetUser user={user} />
            <main className="min-h-screen">{children}</main>
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
