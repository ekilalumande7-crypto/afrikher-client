import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'AFRIKHER - L\'élégance hors du commun. Le Business au féminin.',
  description: 'Magazine premium dédié aux femmes entrepreneures africaines et de la diaspora. Découvrez nos articles inspirants, notre boutique exclusive et nos abonnements.',
  keywords: ['afrikher', 'entrepreneuriat', 'femmes africaines', 'magazine', 'business', 'diaspora'],
  authors: [{ name: 'AFRIKHER' }],
  openGraph: {
    title: 'AFRIKHER - Magazine Premium',
    description: 'L\'élégance hors du commun. Le Business au féminin.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased h-screen bg-afrikher-dark">
        <Navbar />
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
