import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rebalance Reflexology — Northern Ireland',
  description:
    'Professional reflexology treatments in Northern Ireland. Find your balance, restore your wellbeing. Book your appointment online.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rebalance',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Rebalance Reflexology',
    description: 'Professional reflexology treatments in Northern Ireland. Book online.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a5c4f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="grain-overlay">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
