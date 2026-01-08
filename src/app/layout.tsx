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
  title: "Life Calendar - Visualisez votre vie",
  description: "Une perspective unique sur votre temps. Marquez vos événements marquants, suivez vos périodes de vie.",
};

import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";

import RootStructure from "./RootStructure";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR}>
      <RootStructure
        lang="fr"
        bodyClassName={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </RootStructure>
    </ClerkProvider>
  );
}
