import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { NextUIProvider } from "@nextui-org/react";


import '../styles/globals.css'
import type { Metadata } from 'next'
import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/providers';

const font = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Klickce - Create your own map',
  description: 'Design customized maps, add text, photos, and videos to each spot, and engage your audience. Perfect for bloggers and explorers. Start mapping today with Klickce user- friendly map generator.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={font.className} style={{
          boxSizing: 'border-box',
        }}>
          <Providers>
            <ThemeProvider attribute="class" defaultTheme={'dark'} enableSystem>
              {children}
            </ThemeProvider>
          </Providers>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
