'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ChessBoard } from '@/components/chess/chess-board'
import { PulsingDot } from '@/components/ui/pulsing-dot'

const NAV_LOGO =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH5QBZ_gYpMKb2dBacQ274mSNdnx67Bw5bIQ&s'

export function Hero() {
  return (
    <section className="hero-dot-grid relative border-b border-[var(--chess-border)] pt-[72px]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-sm border border-[var(--chess-border-mid)] bg-[var(--chess-green-dim)] px-3 py-1.5 text-sm text-chess-green"
          >
            <PulsingDot />
            Temporada 2026 Activa
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="font-display text-5xl leading-none tracking-[3px] text-chess-cream sm:text-6xl lg:text-7xl"
          >
            RANKING
            <br />
            <span className="text-chess-green">UNCUYO</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-chess-muted"
          >
            Sistema oficial de clasificación ELO de la Liga de Ajedrez Universitaria. Torneos,
            estadísticas y perfiles de todos los competidores de la UNCuyo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link href="/ranking" className="btn-chess-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
              Ver Ranking
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/tournaments" className="btn-chess-ghost inline-flex items-center px-6 py-3 text-sm">
              Explorar Torneos
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.75 }}
            className="mt-12 flex items-center gap-3 border-t border-[var(--chess-border)] pt-8"
          >
            <Image
              src={NAV_LOGO}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded object-cover"
            />
            <div>
              <p className="text-sm font-medium text-chess-cream">Universidad Nacional de Cuyo</p>
              <p className="text-xs text-chess-muted">Club de Ajedrez · Liga Universitaria</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <ChessBoard />
        </motion.div>
      </div>
    </section>
  )
}
