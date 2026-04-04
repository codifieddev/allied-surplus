import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import LayoutWrapper from '@/components/LayoutWrapper';
import StoreProvider from '@/app/StoreProvider';
import { AnnotatorPlugin } from '@/components/annotationPlugin';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import { cn } from '@/lib/utils';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-head',
});

export const metadata: Metadata = {
  title: 'IronForge Surplus | Tactical Gear',
  description: 'IronForge Tactical Surplus is a tactical ecommerce experience built with Next.js.',
  icons: {
    icon: '/assets/Image/favicon.ico',
    shortcut: '/assets/Image/favicon.ico',
    apple: '/assets/Image/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('font-sans', barlow.variable, barlowCondensed.variable)}>
      <body>
        <StoreProvider>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
            {/* <AnnotatorPlugin /> */}
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
