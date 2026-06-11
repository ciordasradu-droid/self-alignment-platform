// Destinație: app/layout.js  (ÎNLOCUIEȘTE COMPLET)
// Schimbare: un mic script setează atributul lang al paginii din limba
// salvată în localStorage, ca browserul/screen-readerele să știe limba reală.

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

export const metadata = {
  title: "Profil de Aliniere",
  description: "Astrologie, Human Design și numerologie, sintetizate într-un profil personal și un plan de aliniere.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
      </body>
    </html>
  );
}