// Rădăcina aplicației. Arhitectura hibridă (v5, sect. 4): apa video e stratul
// universal, montat o singură dată aici (portal in body). three.js a fost
// scos de aici — ramane izolat, doar pe Azi, cand vine lacrima vie (bloc 5).

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WaterVideoLayer from "./components/water/WaterVideoLayer";
import InteractionLayer from "./components/water/InteractionLayer";
import ServiceWorker from "./components/ServiceWorker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Profil de Aliniere",
  description: "Astrologie, Human Design și numerologie, sintetizate într-un profil personal și un plan de aliniere.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Alignment",
  },
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#14122a",
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var l=localStorage.getItem('app_language');if(l){document.documentElement.lang=l}}catch(e){}",
          }}
        />
        {/* LEGEA 1 — apa e sub tot. UN SINGUR strat, pentru toata aplicatia. */}
        <WaterVideoLayer />
        {/* LEGEA 2 — orice atingere naste o unda, peste tot (pas 5, 2D). */}
        <InteractionLayer />
        <div id="app-surface">{children}</div>
        <ServiceWorker />
      </body>
    </html>
  );
}
