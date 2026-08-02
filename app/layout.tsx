import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Cinzel, Poppins } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anuja & Mayuresh — Engagement Invitation",
  description:
    "Join Anuja Wasnik and Mayuresh Saindane as we celebrate our engagement together — 13th September, Rathode Lawn.",
  openGraph: {
    title: "Anuja & Mayuresh — Engagement Invitation",
    description:
      "Join Anuja Wasnik and Mayuresh Saindane as we celebrate our engagement together — 13th September, Rathode Lawn.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFDF7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${cinzel.variable} ${poppins.variable}`}>
      <body className="font-body bg-ivory text-ink antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
