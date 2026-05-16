'use client'

import { motion } from 'framer-motion'
import { Users, Trophy, Swords, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export function StatsSection() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activeTournaments: 0,
    matchesPlayed: 0,
    highestElo: 0,
  })

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/ranking').then((res) => res.json()),
      fetch('http://localhost:8080/tournaments').then((res) => res.json()),
    ])
      .then(([playersData, tournamentsData]) => {
        const totalPlayers = playersData.length

        const activeTournaments = tournamentsData.filter(
          (t: any) => t.status === 'ongoing'
        ).length

        const matchesPlayed = playersData.reduce(
          (acc: number, player: any) =>
            acc + player.wins + player.losses + player.draws,
          0
        )

        const highestElo =
          playersData.length > 0
            ? Math.max(...playersData.map((p: any) => p.elo))
            : 0

        setStats({
          totalPlayers,
          activeTournaments,
          matchesPlayed,
          highestElo,
        })
      })
      .catch((error) => console.error('Error fetching stats:', error))
  }, [])

  const statItems = [
    {
      label: 'Jugadores Totales',
      value: stats.totalPlayers,
      icon: Users,
      suffix: '',
    },
    {
      label: 'Torneos Activos',
      value: stats.activeTournaments,
      icon: Trophy,
      suffix: '',
    },
    {
      label: 'Partidas Jugadas',
      value: stats.matchesPlayed,
      icon: Swords,
      suffix: '+',
    },
    {
      label: 'ELO Más Alto',
      value: stats.highestElo,
      icon: TrendingUp,
      suffix: '',
    },
  ]

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            La Escena Competitiva
          </h2>

          <p className="text-3xl md:text-4xl font-bold text-foreground">
            Comunidad de Campeones en Crecimiento
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="glass rounded-2xl p-6 md:p-8 h-full group hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>

                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </div>

                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}