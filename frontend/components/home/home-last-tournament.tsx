'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Layers, Trophy } from 'lucide-react'
import { API_URL } from '@/lib/api'
import { SectionHeading } from '@/components/ui/section-heading'

interface Tournament {
  id: number
  name: string
  date: string
  type: string
  rounds: number
  participants?: number
  winner?: string | null
  status?: string
}

export function HomeLastTournament() {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [championElo, setChampionElo] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/tournaments`).then((r) => r.json()),
      fetch(`${API_URL}/ranking`).then((r) => r.json()),
    ])
      .then(([tournaments, ranking]) => {
        if (tournaments.length > 0) {
          const sorted = [...tournaments].sort(
            (a: Tournament, b: Tournament) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          const latest = sorted[0]
          setTournament(latest)
          if (latest.winner) {
            const champ = ranking.find(
              (p: { fullName: string }) => p.fullName === latest.winner,
            )
            if (champ) setChampionElo(champ.eloRating)
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !tournament) return null

  return (
    <section className="border-t border-[var(--chess-border)] px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Último torneo" subtitle="Resultado más reciente" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="chess-card flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-chess-green">
              {tournament.type}
            </p>
            <h3 className="mt-2 font-display text-2xl tracking-[2px] text-chess-cream md:text-3xl">
              {tournament.name}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-chess-muted">
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-chess-green" />
                {new Date(tournament.date).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </li>
              <li className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-chess-green" />
                {tournament.rounds} rondas
                {tournament.participants != null && ` · ${tournament.participants} jugadores`}
              </li>
            </ul>
            <Link
              href={`/tournaments/${tournament.id}`}
              className="btn-chess-ghost mt-6 inline-flex px-4 py-2 text-sm"
            >
              Ver resultados
            </Link>
          </div>

          {tournament.winner && (
            <div
              className="min-w-[200px] rounded-sm border px-6 py-5 text-center md:text-left"
              style={{
                borderColor: 'rgba(212, 160, 23, 0.35)',
                background: 'rgba(212, 160, 23, 0.08)',
              }}
            >
              <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                <Trophy className="h-5 w-5 text-chess-gold" />
                <span className="text-xs font-medium uppercase tracking-wider text-chess-gold">
                  Campeón
                </span>
              </div>
              <p className="text-lg font-semibold text-chess-cream">{tournament.winner}</p>
              {championElo != null && (
                <p className="mt-2 font-display text-3xl tracking-[2px] text-chess-gold">
                  {championElo} <span className="text-sm text-chess-muted">ELO</span>
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
