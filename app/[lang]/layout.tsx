import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AZT Medikal",
  description: "Enterprise Medical Solutions",
};

import { ContactProvider } from "@/context/ContactContext";
import ContactModal from "@/components/ui/ContactModal";

export default async function LocalizedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  
  return (
    <ContactProvider>
      {children}
      <ContactModal lang={lang} />
    </ContactProvider>
  );
}
