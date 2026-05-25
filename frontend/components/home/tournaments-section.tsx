'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Layers, ChevronRight, Trophy, Clock } from 'lucide-react'
import { API_URL } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Tournament {
  id: number
  name: string
  date: string
  type: string
  rounds: number
  status?: string
  participants?: number
  winner?: string
}

export function TournamentsSection() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/tournaments`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar los torneos')
        return res.json()
      })
      .then((data: Tournament[]) => {
        setTournaments(data.slice(0, 4))
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'upcoming':
        return 'bg-primary/20 text-primary border-primary/30'
      case 'completed':
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'ongoing': return 'En curso'
      case 'upcoming': return 'Próximo'
      default: return 'Finalizado'
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

  if (loading) {
    return (
      <section className="py-24 px-4 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Cargando torneos...</p>
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
            Competí y Conquistá
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-foreground">
            Torneos Destacados
          </p>
        </motion.div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/tournaments/${tournament.id}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="glass rounded-2xl p-6 h-full group cursor-pointer hover:border-primary/30 transition-colors relative overflow-hidden"
                >
                  {/* Chess Pattern Overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 chess-pattern opacity-5 -rotate-12 translate-x-8 -translate-y-8" />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      variant="outline"
                      className={cn('capitalize', getStatusStyle(tournament.status))}
                    >
                      {getStatusLabel(tournament.status)}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {getTypeIcon(tournament.type)}
                      <span className="text-sm">{tournament.type}</span>
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
                        {new Date(tournament.date).toLocaleDateString('es-AR', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Layers className="w-4 h-4" />
                      <span>{tournament.rounds} rondas</span>
                    </div>
                    {tournament.participants && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{tournament.participants} participantes</span>
                      </div>
                    )}
                  </div>

                  {/* Winner Badge */}
                  {tournament.winner && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-muted-foreground">Ganador:</span>
                        <span className="text-sm font-medium text-foreground">{tournament.winner}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          ))}
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
            <Link href="/tournaments">
              Ver Todos los Torneos
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}