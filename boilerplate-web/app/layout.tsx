// layout.tsx
// MyProject - Client - (C) 2024 MyCompany. v0.0.2

import type { Metadata } from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyProject',
  description: 'webapp.',
  metadataBase: new URL('https://webapp.co'),
  openGraph: {
    title: 'MyProject',
    description: 'webapp.',
    url: 'https://webapp.co',
    images: [
      {
        url: 'https://webapp.co/ogmedia.png',
        width: 1200,
        height: 630,
        alt: 'MyProject OG Image',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="MyProject" />
        <meta
          property="og:description"
          content="Global HTS query and logging."
        />
        <meta property="og:image" content="https://webapp.co/ogmedia.png" />
        <meta property="og:url" content="https://webapp.co" />
        <meta property="og:type" content="website" />

        {umamiWebsiteId && (
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={umamiWebsiteId}
          ></script>
        )}

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
