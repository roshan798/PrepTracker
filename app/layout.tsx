import type { Metadata, Viewport } from 'next';
import './css/globals.css';
import { AppProvider } from '@/lib/store';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'PrepTracker — Job Switch Prep',
  description: 'Track your DSA, LeetCode, and System Design preparation for tech job switches.',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#080F1A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AppProvider>
          {children}
          <Analytics />
        </AppProvider>
      </body>
    </html>
  );
}
