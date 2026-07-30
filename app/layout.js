// Rădăcina aplicației. Arhitectura hibridă (v5, sect. 4): apa video e stratul
// universal, montat o singură dată aici (portal in body). three.js a fost
// scos de aici — ramane izolat, doar pe Azi, cand vine lacrima vie (bloc 5).

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WaterVideoLayer from "./components/water/WaterVideoLayer";
import WaterSoundLoop from "./components/water/WaterSoundLoop";
import InteractionLayer from "./components/water/InteractionLayer";
import ServiceWorker from "./components/ServiceWorker";
import DocumentTitle from "./components/DocumentTitle";
import { APP_NAME } from "../lib/appConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // Punctul 2 (audit 26.07, runda 3): fara title static aici — se ciocnea cu
  // <DocumentTitle/> (React 19 hoisting), care il gestioneaza reactiv, legat
  // de app_language, mai jos.
  description: "Astrologie, Human Design și numerologie, sintetizate într-un profil personal și un plan de aliniere.",
  manifest: "/manifest.webmanifest",
  other: {
    google: "notranslate",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
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
    <html lang="en" translate="no" className="notranslate" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Punctul 5 (audit 26.07, runda 2): curatare o singura data, la incarcarea
            aplicatiei, pentru conturile ramase logate dinainte de migrarea la
            server (runda 1) — cheile astea nu mai sunt sursa de adevar (serverul
            e), dar raman in browserele deschise de atunci. Marcaj de versiune ca
            sa nu ruleze niciodata a doua oara. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!localStorage.getItem('ls_cleanup_v1')){var rm=['profile','my_agreements','account_start_date','seen_morning_sphere'];for(var i=localStorage.length-1;i>=0;i--){var k=localStorage.key(i);if(k&&(k.indexOf(':anon:')!==-1||k.indexOf('gate_committed')===0))rm.push(k)}rm.forEach(function(k){try{localStorage.removeItem(k)}catch(e){}});localStorage.setItem('ls_cleanup_v1','1')}}catch(e){}",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var SUP=['en','ro','es','fr','de','it','pt','nl','pl','hu','ru'];var l=localStorage.getItem('app_language');if(!l){var n=(navigator.language||'en').slice(0,2).toLowerCase();if(SUP.indexOf(n)!==-1)l=n}if(l){document.documentElement.lang=l}}catch(e){}",
          }}
        />
        <DocumentTitle />
        {/* LEGEA 1 — apa e sub tot. UN SINGUR strat, pentru toata aplicatia. */}
        <WaterVideoLayer />
        {/* Sunetul apei (sect. E, 25.07 noapte) — oprit implicit, un singur
            loop global, langa stratul video. */}
        <WaterSoundLoop />
        {/* LEGEA 2 — orice atingere naste o unda, peste tot (pas 5, 2D). */}
        <InteractionLayer />
        <div id="app-surface">{children}</div>
        <ServiceWorker />
      </body>
    </html>
  );
}
