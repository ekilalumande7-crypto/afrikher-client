import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "AFRIKHER | L'élégance hors du commun. Le Business au féminin.",
  description: "Magazine premium pour les femmes entrepreneures africaines et la diaspora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="antialiased" suppressHydrationWarning style={{ backgroundColor: "#0A0A0A", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
