'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import {
  ArrowLeft,
  Trophy,
  Target,
  Swords,
  Crown,
} from 'lucide-react'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { API_URL } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{ id: string }>
}

interface Player {
  id: number
  rank: number
  name: string
  faculty: string
  career: string
  elo: number
  wins: number
  losses: number
  draws: number
  gamesPlayed: number
}

export default function PlayerProfilePage({ params }: Props) {
  const { id } = use(params)

  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/ranking`)
      .then((response) => response.json())
      .then((data) => {
        const formattedPlayers = data.map((p: any) => ({
          id: p.playerId,
          rank: p.position,
          name: p.fullName,
          faculty: p.faculty,
          career: p.career,
          elo: p.eloRating,
          wins: p.wins,
          losses: p.losses,
          draws: p.draws,
          gamesPlayed: p.gamesPlayed,
        }))

        const foundPlayer = formattedPlayers.find(
          (p: Player) => p.id.toString() === id
        )

        setPlayer(foundPlayer || null)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching player:', error)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Cargando jugador...
      </main>
    )
  }

  if (!player) {
    notFound()
  }

  const totalGames = player.wins + player.losses + player.draws

  const winRate =
    totalGames > 0
      ? Math.round((player.wins / totalGames) * 100)
      : 0

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-500 text-amber-950'
      case 2:
        return 'bg-slate-400 text-slate-900'
      case 3:
        return 'bg-orange-600 text-orange-950'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 chess-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="max-w-4xl mx-auto relative">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/players">
                <ArrowLeft className="w-4 h-4" />
                Volver a Jugadores
              </Link>
            </Button>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            {player.rank === 1 && (
              <div className="absolute top-6 right-6">
                <Crown className="w-10 h-10 text-amber-500" />
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-secondary flex items-center justify-center text-4xl md:text-5xl font-bold text-muted-foreground">
                  {player.name.charAt(0)}
                </div>

                <div
                  className={cn(
                    'absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold',
                    getRankBadgeStyle(player.rank)
                  )}
                >
                  #{player.rank}
                </div>
              </motion.div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold text-foreground mb-2"
                >
                  {player.name}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="text-lg text-muted-foreground mb-2"
                >
                  {player.faculty}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-md text-muted-foreground mb-6"
                >
                  {player.career}
                </motion.p>

                {/* ELO */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="flex items-center justify-center md:justify-start gap-4"
                >
                  <span className="text-5xl md:text-6xl font-bold text-gold-gradient">
                    {player.elo}
                  </span>

                  <span className="text-muted-foreground text-lg">
                    ELO
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {/* Win Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <Target className="w-8 h-8 text-primary mb-3" />

              <div className="text-3xl font-bold text-foreground mb-1">
                {winRate}%
              </div>

              <div className="text-sm text-muted-foreground">
                Ratio de victorias
              </div>
            </motion.div>

            {/* Games */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="glass rounded-2xl p-6"
            >
              <Swords className="w-8 h-8 text-primary mb-3" />

              <div className="text-3xl font-bold text-foreground mb-1">
                {totalGames}
              </div>

              <div className="text-sm text-muted-foreground">
                Partidas jugadas
              </div>
            </motion.div>

            {/* Wins */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20"
            >
              <Trophy className="w-8 h-8 text-emerald-400 mb-3" />

              <div className="text-3xl font-bold text-emerald-400 mb-1">
                {player.wins}
              </div>

              <div className="text-sm text-muted-foreground">
                Victorias
              </div>
            </motion.div>

            {/* Losses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20"
            >
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
                <span className="text-red-400 font-bold">D</span>
              </div>

              <div className="text-3xl font-bold text-red-400 mb-1">
                {player.losses}
              </div>

              <div className="text-sm text-muted-foreground">
                Derrotas
              </div>
            </motion.div>
          </div>

          {/* Extra Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-foreground mb-6">
              Resumen del jugador
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  #{player.rank}
                </div>

                <div className="text-xs text-muted-foreground">
                  Ranking
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {player.elo}
                </div>

                <div className="text-xs text-muted-foreground">
                  ELO actual
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {player.draws}
                </div>

                <div className="text-xs text-muted-foreground">
                  Empates
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {player.gamesPlayed}
                </div>

                <div className="text-xs text-muted-foreground">
                  Total partidas
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}