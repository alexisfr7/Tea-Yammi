import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TeaYammi — Salon de thé & bubble tea, Paris",
  description: "Salon de thé taïwanais au cœur de Paris. Bubble tea préparé à la commande, pâtisseries maison et douceurs de saison.",
  authors: [{ name: "TeaYammi" }],
  openGraph: {
    title: "TeaYammi — Salon de thé & bubble tea, Paris",
    description: "Bubble tea taïwanais, pâtisseries maison et douceurs de saison, servis rue des Moulins.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
