import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist'
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'Ranking UnCuyo | Liga de Ajedrez Universitaria',
  description: 'Ranking oficial de la Liga de Ajedrez Universitaria de la Universidad Nacional de Cuyo. Consulta las posiciones, estadísticas y perfiles de los jugadores que compiten en esta apasionante liga de ajedrez.',
  generator: 'v0.app',
  keywords: ['chess', 'ranking', 'UnCuyo', 'university', 'tournament', 'ELO'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster theme="dark" richColors position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
