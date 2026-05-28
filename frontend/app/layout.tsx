import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Ranking UNCuyo | Liga de Ajedrez Universitaria',
  description: 'Ranking oficial de la Liga de Ajedrez Universitaria de la Universidad Nacional de Cuyo. Consultá las posiciones, estadísticas y perfiles de los jugadores.',
  metadataBase: new URL('https://ranking-uncuyo.vercel.app'),
  keywords: ['chess', 'ranking', 'UNCuyo', 'university', 'tournament', 'ELO'],
  openGraph: {
    title: 'Ranking UNCuyo | Liga de Ajedrez Universitaria',
    description: 'Ranking oficial de la Liga de Ajedrez Universitaria de la Universidad Nacional de Cuyo.',
    url: 'https://ranking-uncuyo.vercel.app',
    siteName: 'Ranking UNCuyo',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ranking UNCuyo | Liga de Ajedrez Universitaria',
    description: 'Ranking oficial de la Liga de Ajedrez Universitaria de la UNCuyo.',
  },
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
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster theme="dark" richColors position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
