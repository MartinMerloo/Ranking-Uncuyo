'use client'

import Image from 'next/image'
import Link from 'next/link'

const NAV_LOGO =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH5QBZ_gYpMKb2dBacQ274mSNdnx67Bw5bIQ&s'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Ranking', href: '/ranking' },
    { label: 'Torneos', href: '/tournaments' },
    { label: 'Jugadores', href: '/players' },
  ]

  return (
    <footer className="border-t border-[var(--chess-border)]" style={{ background: 'var(--chess-navy-light)' }}>
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="mb-4 inline-flex items-center gap-3">
              <Image
                src={NAV_LOGO}
                alt="UNCuyo"
                width={36}
                height={36}
                className="h-9 w-9 rounded object-cover"
              />
              <span className="font-display text-xl tracking-[2px] text-chess-cream">
                RANKING UNCUYO
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-chess-muted">
              Sistema oficial de clasificación de ajedrez de la Universidad Nacional de Cuyo.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-chess-cream">Navegación</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-chess-muted transition-colors hover:text-chess-green"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--chess-border)] pt-8 text-xs text-chess-muted md:flex-row md:justify-between">
          <p>© {currentYear} Ranking UNCUYO. Todos los derechos reservados.</p>
          <p className="text-chess-green/80">Liga de Ajedrez Universitaria</p>
        </div>
      </div>
    </footer>
  )
}
