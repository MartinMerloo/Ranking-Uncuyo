'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SectionHeading } from '@/components/ui/section-heading'
import { API_URL } from '@/lib/api'
import { cn } from '@/lib/utils'
import { eloClass, rankNumberClass } from '@/lib/ranking-display'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [facultyFilter, setFacultyFilter] = useState<string>('all')
  const [players, setPlayers] = useState<any[]>([])
  const [faculties, setFaculties] = useState<string[]>([])

  useEffect(() => {
    fetch(`${API_URL}/ranking`)
      .then((response) => response.json())
      .then((data) => {
        const formattedPlayers = data.map((player: any) => ({
          id: player.playerId,
          rank: player.position,
          name: player.fullName,
          faculty: player.faculty,
          elo: player.eloRating,
          wins: player.wins,
          draws: player.draws,
          losses: player.losses,
        }))

        setPlayers(formattedPlayers)
        setFaculties([...new Set(formattedPlayers.map((p: any) => p.faculty))] as string[])
      })
      .catch((error) => console.error('Error fetching ranking:', error))
  }, [])

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFaculty = facultyFilter === 'all' || player.faculty === facultyFilter
    return matchesSearch && matchesFaculty
  })

  return (
    <main className="min-h-screen bg-chess-navy pt-[72px]">
      <Navbar />

      <section className="border-b border-[var(--chess-border)] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Jugadores"
            subtitle="Directorio de competidores de la liga universitaria"
            center
          />
        </div>
      </section>

      <section className="px-4 py-10 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chess-muted" />
              <Input
                placeholder="Buscar jugadores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 border-[var(--chess-border)] bg-chess-navy-light pl-9"
              />
            </div>
            <Select value={facultyFilter} onValueChange={setFacultyFilter}>
              <SelectTrigger className="h-10 w-full border-[var(--chess-border)] bg-chess-navy-light sm:w-[220px]">
                <Filter className="mr-2 h-4 w-4 text-chess-muted" />
                <SelectValue placeholder="Todas las facultades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las facultades</SelectItem>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty} value={faculty}>
                    {faculty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.04, 0.35) }}
                whileHover={{ y: -3 }}
              >
                <Link href={`/players/${player.id}`}>
                  <article
                    className={cn(
                      'chess-card group flex h-full flex-col p-5 transition-colors hover:border-[var(--chess-border-mid)]',
                      player.rank === 1 && 'border-[rgba(212,160,23,0.35)]',
                    )}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <span
                        className={cn(
                          'font-display text-xl',
                          rankNumberClass(player.rank),
                        )}
                      >
                        #{player.rank}
                      </span>
                    </div>

                    <div
                      className={cn(
                        'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 text-base font-semibold',
                        player.rank === 1
                          ? 'border-chess-gold/50 bg-chess-gold/10 text-chess-gold'
                          : 'border-chess-green/40 bg-chess-green-dim text-chess-green',
                      )}
                    >
                      {getInitials(player.name)}
                    </div>

                    <h3 className="text-center text-base font-semibold text-chess-cream group-hover:text-chess-green">
                      {player.name}
                    </h3>
                    <span
                      className="mx-auto mt-2 block w-fit rounded-sm px-2 py-0.5 text-center text-xs text-chess-muted"
                      style={{ background: 'rgba(109, 190, 69, 0.07)' }}
                    >
                      {player.faculty}
                    </span>

                    <p
                      className={cn(
                        'mt-4 text-center font-display text-3xl tracking-[2px]',
                        eloClass(player.rank),
                      )}
                    >
                      {player.elo}
                    </p>

                    <div className="mt-auto flex justify-center gap-4 border-t border-[var(--chess-border)] pt-4 text-xs">
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
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <p className="py-16 text-center text-sm text-chess-muted">
              No se encontraron jugadores con los criterios seleccionados.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
