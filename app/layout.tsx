'use client';

import './globals.css';
import Navbar from '@/components/layout/Navbar';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <html lang="fr">
      <body className="antialiased h-screen bg-afrikher-dark">
        {!isAuthPage && <Navbar />}
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
