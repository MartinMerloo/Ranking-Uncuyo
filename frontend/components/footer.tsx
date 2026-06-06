'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Crown, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Ranking', href: '/ranking' },
    { label: 'Torneos', href: '/tournaments' },
    { label: 'Jugadores', href: '/players' },
  ]

  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center"
              >
                <Crown className="w-5 h-5 text-primary" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Ranking
                </span>
                <span className="text-xs text-primary font-medium -mt-1">
                  UNCuyo
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Sistema oficial de clasificación de ajedrez de la Universidad Nacional de Cuyo. 
              Seguí partidas competitivas, explorá torneos y descubrí a los mejores jugadores.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Navegación</h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Conectar</h4>
            <div className="flex gap-3">
              <motion.a
                whileHover={{ y: -2 }}
                href="https://www.instagram.com/clubuncuyoajedrez/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="mailto:martinmerlo360@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Ranking UNCuyo. Todos los derechos reservados. Creado por alumnos de FING
          </p>
          <p className="text-xs text-muted-foreground">
            Club de Ajedrez - Universidad Nacional de Cuyo
          </p>
        </div>
      </div>
    </footer>
  )
}
