'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Minus, ChevronRight, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const API_URL = 'http://localhost:8080'

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
  gamesPlayed: number
}

const podiumOrder = [1, 0, 2] // 2nd, 1st, 3rd for visual layout

export function TopPlayersSection() {
  const [topThree, setTopThree] = useState<RankingPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/ranking`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar el ranking')
        return res.json()
      })
      .then((data: RankingPlayer[]) => {
        setTopThree(data.slice(0, 3))
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'from-amber-500/20 to-yellow-500/5 border-amber-500/30'
      case 2: return 'from-slate-400/20 to-slate-500/5 border-slate-400/30'
      case 3: return 'from-orange-600/20 to-orange-700/5 border-orange-600/30'
      default: return 'from-secondary to-secondary/50 border-border'
    }
  }

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-amber-500 text-amber-950'
      case 2: return 'bg-slate-400 text-slate-900'
      case 3: return 'bg-orange-600 text-orange-950'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  if (loading) {
    return (
      <section className="py-24 px-4 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Cargando ranking...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 px-4 flex items-center justify-center">
        <p className="text-red-400">Error: {error}</p>
      </section>
    )
  }

  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Salón de Campeones
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-foreground">
            Mejores Jugadores
          </p>
        </motion.div>

        {/* Podium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end mb-12">
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
                transition={{ duration: 0.6, delay: visualIndex * 0.15 }}
                className={cn(
                  'order-2 md:order-none',
                  visualIndex === 0 && 'md:order-1',
                  visualIndex === 1 && 'md:order-2',
                  visualIndex === 2 && 'md:order-3',
                  isFirst && 'order-1'
                )}
              >
                <Link href={`/players/${player.playerId}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={cn(
                      'relative rounded-2xl border p-6 md:p-8 bg-gradient-to-b overflow-hidden group cursor-pointer',
                      getRankStyle(player.position),
                      isFirst && 'md:scale-110 md:z-10'
                    )}
                  >
                    {/* Crown for #1 */}
                    {isFirst && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                        <Crown className="w-8 h-8 text-amber-500" />
                      </div>
                    )}

                    {/* Rank Badge */}
                    <div className={cn(
                      'absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      getRankBadgeStyle(player.position)
                    )}>
                      {player.position}
                    </div>

                    {/* Avatar */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center text-2xl md:text-3xl font-bold text-muted-foreground">
                      {player.fullName.charAt(0).toUpperCase()}
                    </div>

                    {/* Player Info */}
                    <div className="text-center">
                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {player.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {player.faculty}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mb-4">
                        {player.career}
                      </p>

                      {/* ELO */}
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl md:text-3xl font-bold text-gold-gradient">
                          {player.eloRating}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-emerald-400">{player.wins}</div>
                        <div className="text-xs text-muted-foreground">Victorias</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-muted-foreground">{player.draws}</div>
                        <div className="text-xs text-muted-foreground">Tablas</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-400">{player.losses}</div>
                        <div className="text-xs text-muted-foreground">Derrotas</div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button asChild variant="outline" className="group border-border/50">
            <Link href="/ranking">
              Ver Ranking Completo
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}