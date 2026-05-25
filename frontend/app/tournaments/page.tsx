'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Users, Layers, Trophy, Clock, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SectionHeading } from '@/components/ui/section-heading'
import { API_URL } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
    fetch(`${API_URL}/tournaments`)
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
          status: tournament.status || 'completed',
        }))
        setTournaments(formattedTournaments)
      })
      .catch((error) => console.error('Error fetching tournaments:', error))
  }, [])

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter
    const matchesType = typeFilter === 'all' || tournament.type === typeFilter
    return matchesStatus && matchesType
  })

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'border-chess-green/30 text-chess-green bg-chess-green-dim'
      case 'upcoming':
        return 'border-chess-gold/35 text-chess-gold bg-[rgba(212,160,23,0.08)]'
      default:
        return 'border-[var(--chess-border)] text-chess-muted'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BLITZ':
      case 'RAPID':
        return <Clock className="h-4 w-4" />
      default:
        return <Trophy className="h-4 w-4" />
    }
  }

  const tournamentTypes = ['BLITZ', 'RAPID', 'CLASSICAL']

  return (
    <main className="min-h-screen bg-chess-navy pt-[72px]">
      <Navbar />

      <section className="border-b border-[var(--chess-border)] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Torneos"
            subtitle="Calendario y resultados de la Liga UNCUYO"
            center
          />
        </div>
      </section>

      <section className="px-4 py-10 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full border-[var(--chess-border)] bg-chess-navy-light sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4 text-chess-muted" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="upcoming">Próximos</SelectItem>
                <SelectItem value="ongoing">En curso</SelectItem>
                <SelectItem value="completed">Finalizados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 w-full border-[var(--chess-border)] bg-chess-navy-light sm:w-[200px]">
                <Trophy className="mr-2 h-4 w-4 text-chess-muted" />
                <SelectValue placeholder="Tipo" />
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
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTournaments.map((tournament, index) => {
              const isUpcoming = tournament.status === 'upcoming'
              return (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -3 }}
                >
                  <Link href={`/tournaments/${tournament.id}`}>
                    <article
                      className={cn(
                        'chess-card group flex h-full flex-col p-6 transition-colors hover:border-[var(--chess-border-mid)]',
                        isUpcoming &&
                          'border-[rgba(212,160,23,0.35)] bg-gradient-to-br from-[rgba(212,160,23,0.08)] to-transparent',
                      )}
                    >
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <Badge
                          variant="outline"
                          className={cn('font-normal', getStatusStyle(tournament.status))}
                        >
                          {statusLabels[tournament.status] || tournament.status}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-chess-muted">
                          {getTypeIcon(tournament.type)}
                          {tournament.type}
                        </span>
                      </div>

                      <h3 className="font-display text-xl tracking-[1px] text-chess-cream group-hover:text-chess-green">
                        {tournament.name}
                      </h3>

                      <ul className="mt-4 flex-1 space-y-2 text-sm text-chess-muted">
                        <li className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-chess-green" />
                          {new Date(tournament.date).toLocaleDateString('es-AR', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </li>
                        <li className="flex items-center gap-2">
                          <Layers className="h-4 w-4 shrink-0 text-chess-green" />
                          {tournament.rounds} rondas
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="h-4 w-4 shrink-0 text-chess-green" />
                          {tournament.participants} participantes
                        </li>
                      </ul>

                      {tournament.winner && (
                        <div className="mt-4 flex items-center gap-2 border-t border-[var(--chess-border)] pt-4 text-sm">
                          <Trophy className="h-4 w-4 text-chess-gold" />
                          <span className="text-chess-muted">Campeón:</span>
                          <span className="font-medium text-chess-cream">{tournament.winner}</span>
                        </div>
                      )}

                      <span className="btn-chess-ghost mt-5 inline-flex w-fit px-3 py-1.5 text-xs">
                        Ver resultados
                      </span>
                    </article>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {filteredTournaments.length === 0 && (
            <p className="py-16 text-center text-sm text-chess-muted">
              No se encontraron torneos con los criterios seleccionados.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
