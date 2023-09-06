import '../styles/globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from '@/components/theme-provider'

import { Analytics } from '@vercel/analytics/react'
import TrpcProvider from '@/lib/trpc/Provider';

const font = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Klikce - Create your own map',
  description: 'Design customized maps, add text, photos, and videos to each spot, and engage your audience. Perfect for bloggers and explorers. Start mapping today with Klikce user- friendly map generator.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={font.className}>
          <ThemeProvider attribute="class" defaultTheme={'dark'} enableSystem>
            <TrpcProvider>
              {children}
            </TrpcProvider>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
