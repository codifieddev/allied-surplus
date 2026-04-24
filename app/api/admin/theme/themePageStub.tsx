import ThemeManager from "@/app/[locale]/admin/(dashboard)/theme/ThemeManager";
import React from "react";

export const metadata = {
  title: "Theme Command Center | Allied Surplus",
  description: "Customize site aesthetics and typography settings.",
};

export default function ThemePage() {
  return <ThemeManager />;
}
