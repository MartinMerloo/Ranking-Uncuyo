'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Users, Layers, Trophy, Clock, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const statusLabels: Record<string, string> = {
  all: 'Todos los Estados',
  ongoing: 'En curso',
  upcoming: 'Próximo',
  completed: 'Finalizado',
}

export default function TournamentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [tournaments, setTournaments] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:8080/tournaments')
      .then((response) => response.json())
      .then((data) => {
        const formattedTournaments = data.map((tournament: any) => ({
          id: tournament.id,
          name: tournament.name,
          date: tournament.date,
          rounds: tournament.rounds,
          type: tournament.type,
          participants: tournament.participants || 0,
          winner: tournament.winner || null,
          status: tournament.status || 'completed'
        }))

        setTournaments(formattedTournaments)
      })
      .catch((error) => console.error('Error fetching tournaments:', error))
  }, [])

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesStatus =
      statusFilter === 'all' || tournament.status === statusFilter

    const matchesType =
      typeFilter === 'all' || tournament.type === typeFilter

    return matchesStatus && matchesType
  })

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'upcoming':
        return 'bg-primary/20 text-primary border-primary/30'
      case 'completed':
        return 'bg-muted text-muted-foreground border-border'
      default:
        return ''
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BLITZ':
      case 'RAPID':
        return <Clock className="w-4 h-4" />
      default:
        return <Trophy className="w-4 h-4" />
    }
  }

  const tournamentTypes = ['BLITZ', 'RAPID', 'CLASSICAL']

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
              <span className="text-gold-gradient">Torneos</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorá todos los torneos de la Liga de Ajedrez UNCuyo.
              Desde intensas batallas blitz hasta campeonatos clásicos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Todos los Estados" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="upcoming">Próximos</SelectItem>
                <SelectItem value="ongoing">En Curso</SelectItem>
                <SelectItem value="completed">Finalizados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
                <Trophy className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Todos los Tipos" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>

                {tournamentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Tournaments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/tournaments/${tournament.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="glass rounded-2xl p-6 h-full group cursor-pointer hover:border-primary/30 transition-colors relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 chess-pattern opacity-5 -rotate-12 translate-x-8 -translate-y-8" />

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          'capitalize',
                          getStatusStyle(tournament.status)
                        )}
                      >
                        {statusLabels[tournament.status] ||
                          tournament.status}
                      </Badge>

                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getTypeIcon(tournament.type)}

                        <span className="text-sm">
                          {tournament.type}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {tournament.name}
                    </h3>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />

                        <span>
                          {new Date(tournament.date).toLocaleDateString(
                            'es-AR',
                            {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Layers className="w-4 h-4" />

                        <span>{tournament.rounds} rondas</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />

                        <span>{tournament.participants} participantes</span>
                      </div>
                    </div>

                    {/* Winner */}
                    {tournament.winner && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-500" />

                          <span className="text-sm text-muted-foreground">
                            Ganador:
                          </span>

                          <span className="text-sm font-medium text-foreground">
                            {tournament.winner}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredTournaments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">
                No se encontraron torneos con los criterios seleccionados.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}