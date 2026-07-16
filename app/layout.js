// Rădăcina aplicației. Aici se montează cele două lucruri care fac apa
// universală: stratul de ripple (legea 2) și corpul de apă din globals.css
// (legea 1). Orice ecran nou intră automat în apă.

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RippleLayer from "./components/water/RippleLayer";
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
  themeColor: "#0b0e2a",
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
        {children}
        <RippleLayer />
        <ServiceWorker />
      </body>
    </html>
  );
}
