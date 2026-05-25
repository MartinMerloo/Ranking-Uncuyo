'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Crown, TrendingUp, Swords, Target, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { API_URL } from '@/lib/api'
import { Button } from '@/components/ui/button'

export function FeaturedPlayerSection() {
  const [featuredPlayer, setFeaturedPlayer] = useState<any>(null)

  useEffect(() => {
    fetch(`${API_URL}/ranking`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const topPlayer = {
            id: data[0].playerId,
            rank: data[0].position,
            name: data[0].fullName,
            faculty: data[0].faculty,
            elo: data[0].elo,
            wins: data[0].wins,
            losses: data[0].losses,
            draws: data[0].draws,
            eloChange: data[0].eloChange || 0,
          }

          setFeaturedPlayer(topPlayer)
        }
      })
      .catch((error) => console.error('Error fetching featured player:', error))
  }, [])

  if (!featuredPlayer) {
    return null
  }

  const winRate = Math.round(
    (featuredPlayer.wins /
      (featuredPlayer.wins +
        featuredPlayer.losses +
        featuredPlayer.draws)) *
      100
  )

  return (
    <section className="py-24 px-4 relative">
      {/* Background Gradient */}
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
            Destacado
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-foreground">
            Campeón Reinante
          </p>
        </motion.div>

        {/* Featured Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Link href={`/players/${featuredPlayer.id}`}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative glass rounded-3xl overflow-hidden group cursor-pointer"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 chess-pattern opacity-5" />
              
              {/* Gold Gradient Overlay */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />

              <div className="relative p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Side - Player Info */}
                <div>
                  {/* Crown Badge */}
                  <motion.div
                    initial={{ rotate: -10 }}
                    whileInView={{ rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 mb-6"
                  >
                    <Crown className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-bold text-amber-500">
                      Jugador #1 del Ranking
                    </span>
                  </motion.div>

                  {/* Name */}
                  <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {featuredPlayer.name}
                  </h3>

                  <p className="text-lg text-muted-foreground mb-6">
                    {featuredPlayer.faculty}
                  </p>

                  {/* ELO Display */}
                  <div className="flex items-baseline gap-4 mb-8">
                    <span className="text-6xl md:text-7xl font-bold text-gold-gradient">
                      {featuredPlayer.elo}
                    </span>

                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />

                      <span className="text-lg font-medium text-emerald-400">
                        +{featuredPlayer.eloChange}
                      </span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Button className="group/btn">
                    Ver Perfil Completo
                    <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Right Side - Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Win Rate */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-secondary/50 rounded-2xl p-6"
                  >
                    <Target className="w-8 h-8 text-primary mb-3" />

                    <div className="text-3xl font-bold text-foreground mb-1">
                      {winRate}%
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Tasa de Victoria
                    </div>
                  </motion.div>

                  {/* Total Games */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-secondary/50 rounded-2xl p-6"
                  >
                    <Swords className="w-8 h-8 text-primary mb-3" />

                    <div className="text-3xl font-bold text-foreground mb-1">
                      {featuredPlayer.wins +
                        featuredPlayer.losses +
                        featuredPlayer.draws}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Partidas Totales
                    </div>
                  </motion.div>

                  {/* Wins */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20"
                  >
                    <div className="text-3xl font-bold text-emerald-400 mb-1">
                      {featuredPlayer.wins}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Victorias
                    </div>
                  </motion.div>

                  {/* Losses */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20"
                  >
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      {featuredPlayer.losses}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Derrotas
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}