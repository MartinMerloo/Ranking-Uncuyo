'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PulsingDot } from '@/components/ui/pulsing-dot'

const NAV_LOGO =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH5QBZ_gYpMKb2dBacQ274mSNdnx67Bw5bIQ&s'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/ranking', label: 'Ranking' },
  { href: '/tournaments', label: 'Torneos' },
  { href: '/players', label: 'Jugadores' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--chess-border)]"
      style={{
        background: 'rgba(17, 24, 39, 0.97)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src={NAV_LOGO}
            alt="UNCuyo Ajedrez"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded object-cover"
            priority
          />
          <div className="hidden min-w-0 leading-tight sm:block">
            <span className="font-display text-xl tracking-[2px] text-chess-cream">
              RANKING UNCUYO
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-sm px-3.5 py-2 text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-[var(--chess-green-dim)] text-chess-green'
                  : 'text-chess-muted hover:text-chess-cream',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-2 rounded-sm border border-[var(--chess-border)] px-3 py-1.5 text-xs text-chess-muted">
            <PulsingDot />
            <span>Temporada 2026</span>
          </div>
          <Link
            href="/admin"
            className="btn-chess-ghost inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium"
          >
            <Lock className="h-3.5 w-3.5" />
            Admin
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="rounded-sm p-2 text-chess-cream md:hidden"
          aria-label="Menú"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--chess-border)] md:hidden"
            style={{ background: 'rgba(17, 24, 39, 0.97)' }}
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'rounded-sm px-3 py-2.5 text-sm font-medium',
                    pathname === link.href
                      ? 'bg-[var(--chess-green-dim)] text-chess-green'
                      : 'text-chess-muted',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-chess-ghost mt-2 inline-flex items-center justify-center gap-2 px-3 py-2.5 text-sm"
              >
                <Lock className="h-4 w-4" />
                Admin
              </Link>
              <div className="mt-2 flex items-center gap-2 px-3 py-2 text-xs text-chess-muted">
                <PulsingDot />
                Temporada 2026
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
