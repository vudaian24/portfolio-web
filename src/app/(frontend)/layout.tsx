import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

type Props = {
  children: ReactNode;
};

// The <html> and <body> elements live in [locale]/layout.tsx, which sets the
// lang attribute. This layout only passes children through.
export default function RootLayout({ children }: Props) {
  return children;
}
