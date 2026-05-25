'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { API_URL } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [facultyFilter, setFacultyFilter] = useState<string>('all')
  const [players, setPlayers] = useState<any[]>([])
  const [faculties, setFaculties] = useState<string[]>([])

  useEffect(() => {
    fetch(`${API_URL}/ranking`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const formattedPlayers = data.map((player: any) => ({
          id: player.playerId,
          rank: player.position,
          name: player.fullName,
          faculty: player.faculty,
          elo: player.eloRating,
          wins: player.wins,
          draws: player.draws,
          losses: player.losses,
          trend: 'stable',
          eloChange: 0,
        }))

        setPlayers(formattedPlayers)

        const uniqueFaculties = [
          ...new Set(formattedPlayers.map((p: any) => p.faculty)),
        ] as string[]

        setFaculties(uniqueFaculties)
      })
      .catch((error) => console.error('Error fetching ranking:', error))
  }, [])

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFaculty = facultyFilter === 'all' || player.faculty === facultyFilter
    return matchesSearch && matchesFaculty
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-amber-500/20 to-yellow-500/5 border-amber-500/30'
      case 2:
        return 'from-slate-400/20 to-slate-500/5 border-slate-400/30'
      case 3:
        return 'from-orange-600/20 to-orange-700/5 border-orange-600/30'
      default:
        return 'from-secondary to-secondary/50 border-border/50'
    }
  }

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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 chess-pattern opacity-5" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              <span className="text-gold-gradient">Jugadores</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubrí a todos los ajedrecistas que compiten en la Liga de Ajedrez UNCuyo.
              Explorá perfiles, estadísticas y seguí su camino hacia la cima.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Players Section */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar jugadores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            <Select value={facultyFilter} onValueChange={setFacultyFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-card border-border">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Todas las Facultades" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todas las Facultades</SelectItem>

                {faculties.map((faculty) => (
                  <SelectItem key={faculty} value={faculty}>
                    {faculty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link href={`/players/${player.id}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={cn(
                      'relative rounded-2xl border p-6 bg-gradient-to-b overflow-hidden group cursor-pointer',
                      getRankStyle(player.rank)
                    )}
                  >
                    {/* Rank Badge */}
                    <div
                      className={cn(
                        'absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                        getRankBadgeStyle(player.rank)
                      )}
                    >
                      {player.rank}
                    </div>

                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center text-xl font-bold text-muted-foreground">
                      {player.name.charAt(0)}
                    </div>

                    {/* Player Info */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {player.name}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4">
                        {player.faculty}
                      </p>

                      {/* ELO */}
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-gold-gradient">
                          {player.elo}
                        </span>

                        <div className="flex items-center gap-1">
                          {getTrendIcon(player.trend)}

                          <span
                            className={cn(
                              'text-xs font-medium',
                              player.trend === 'up' && 'text-emerald-400',
                              player.trend === 'down' && 'text-red-400',
                              player.trend === 'stable' && 'text-muted-foreground'
                            )}
                          >
                            {player.eloChange > 0 ? '+' : ''}
                            {player.eloChange}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-sm font-bold text-emerald-400">
                          {player.wins}
                        </div>

                        <div className="text-xs text-muted-foreground">V</div>
                      </div>

                      <div>
                        <div className="text-sm font-bold text-muted-foreground">
                          {player.draws}
                        </div>

                        <div className="text-xs text-muted-foreground">T</div>
                      </div>

                      <div>
                        <div className="text-sm font-bold text-red-400">
                          {player.losses}
                        </div>

                        <div className="text-xs text-muted-foreground">D</div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">
                No se encontraron jugadores con los criterios seleccionados.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}