"use client";

import NextLink from 'next/link';
import { useParams as useNextParams, usePathname, useRouter } from 'next/navigation';
import React from 'react';

export function Link({ href, ...props }: React.ComponentProps<typeof NextLink>) {
  const params = useNextParams();
  const locale = params?.locale as string;

  let localizedHref = href;
  if (
    typeof href === "string" &&
    href.startsWith("/") &&
    !href.startsWith("/api") &&
    locale
  ) {
    if (!href.startsWith(`/${locale}/`) && href !== `/${locale}`) {
      localizedHref = `/${locale}${href === "/" ? "" : href}`;
    }
  }

  return <NextLink {...props} href={localizedHref} />;
}

export function useNavigate() {
  const router = useRouter();
  const params = useNextParams();
  const locale = params?.locale as string;

  return (to: string) => {
    let localizedTo = to;
    if (
      to.startsWith("/") &&
      !to.startsWith("/admin") &&
      !to.startsWith("/api") &&
      locale
    ) {
      if (!to.startsWith(`/${locale}/`) && to !== `/${locale}`) {
        localizedTo = `/${locale}${to === "/" ? "" : to}`;
      }
    }
    router.push(localizedTo);
  };
}

export function useParams<
  T extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
>() {
  return useNextParams() as unknown as T;
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname };
}
