import type { Metadata, Viewport } from 'next';
import './css/globals.css';
import { AppProvider } from '@/lib/store';
import { Analytics } from '@vercel/analytics/next';
import LocationPersistence from '@/components/LocationPersistence';
import RouteProgressBar from '@/components/RouteProgressBar';
import { DM_Sans, JetBrains_Mono, Syne } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PrepTracker — Job Switch Prep',
  description: 'Track your DSA, LeetCode, and System Design preparation for tech job switches.',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#111513',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${dmSans.variable} ${jetBrainsMono.variable} ${syne.variable}`} data-scroll-behavior="smooth">
      <body>
        <AppProvider>
          <RouteProgressBar />
          <LocationPersistence />
          {children}
          <Analytics />
        </AppProvider>
      </body>
    </html>
  );
}
