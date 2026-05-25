'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { API_URL } from '@/lib/api'
import { cn } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/section-heading'
import { eloClass, rankNumberClass } from '@/lib/ranking-display'

interface RankingPlayer {
  position: number
  playerId: number
  fullName: string
  faculty: string
  career: string
  eloRating: number
  wins: number
  losses: number
  draws: number
}

const podiumOrder = [1, 0, 2]
const delays = [0, 0.15, 0.3]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TopPlayersSection() {
  const [topThree, setTopThree] = useState<RankingPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/ranking`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar el ranking')
        return res.json()
      })
      .then((data: RankingPlayer[]) => {
        setTopThree(data.slice(0, 3))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="flex items-center justify-center px-4 py-20">
        <p className="text-sm text-chess-muted">Cargando ranking...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="flex items-center justify-center px-4 py-20">
        <p className="text-sm text-chess-red">Error: {error}</p>
      </section>
    )
  }

  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Top 3" subtitle="Salón de campeones" />

        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3 md:gap-5">
          {podiumOrder.map((playerIndex, visualIndex) => {
            const player = topThree[playerIndex]
            if (!player) return null
            const isFirst = player.position === 1

            return (
              <motion.div
                key={player.playerId}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: delays[visualIndex] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={cn(
                  'order-2 md:order-none',
                  visualIndex === 0 && 'md:order-1 md:mb-4',
                  visualIndex === 1 && 'order-1 md:order-2',
                  visualIndex === 2 && 'md:order-3 md:mb-4',
                )}
              >
                <Link href={`/players/${player.playerId}`}>
                  <article
                    className={cn(
                      'chess-card flex flex-col p-6 transition-colors md:p-7',
                      isFirst && 'border-[rgba(212,160,23,0.35)] bg-[rgba(212,160,23,0.06)] md:-mt-4 md:pb-10',
                    )}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={cn(
                          'font-display text-2xl',
                          rankNumberClass(player.position),
                        )}
                      >
                        #{player.position}
                      </span>
                      {isFirst && (
                        <span className="text-xs font-medium text-chess-gold">Campeón</span>
                      )}
                    </div>

                    <div
                      className={cn(
                        'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 text-lg font-semibold',
                        isFirst
                          ? 'border-chess-gold/50 bg-chess-gold/10 text-chess-gold'
                          : 'border-chess-green/40 bg-chess-green-dim text-chess-green',
                      )}
                    >
                      {getInitials(player.fullName)}
                    </div>

                    <h3 className="text-center text-base font-semibold text-chess-cream">
                      {player.fullName}
                    </h3>
                    <p className="mt-1 text-center text-xs text-chess-muted line-clamp-2">
                      {player.faculty}
                    </p>

                    <p
                      className={cn(
                        'mt-5 text-center font-display text-4xl tracking-[2px]',
                        eloClass(player.position),
                      )}
                    >
                      {player.eloRating}
                    </p>
                    <p className="text-center text-[10px] uppercase tracking-wider text-chess-muted">
                      ELO
                    </p>

                    <div className="mt-5 flex justify-center gap-4 border-t border-[var(--chess-border)] pt-4 text-xs">
                      <span>
                        <span className="font-semibold text-chess-green">{player.wins}</span> V
                      </span>
                      <span>
                        <span className="font-semibold text-chess-muted">{player.draws}</span> T
                      </span>
                      <span>
                        <span className="font-semibold text-chess-red">{player.losses}</span> D
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/ranking"
            className="btn-chess-ghost inline-flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            Ver ranking completo
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
