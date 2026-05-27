'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Clock,
  Layers,
  MapPin,
  Swords,
  Trophy,
  Users,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { API_URL, type ApiMatch } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: Promise<{ id: string }>
}

// ── Player stats computation ─────────────────────────────────────────────────

type PlayerStat = {
  id: number
  name: string
  wins: number
  draws: number
  losses: number
}

function computePlayerStats(matches: ApiMatch[]): PlayerStat[] {
  const map = new Map<number, PlayerStat>()
  const ensure = (id: number, name: string) => {
    if (!map.has(id)) map.set(id, { id, name, wins: 0, draws: 0, losses: 0 })
    return map.get(id)!
  }
  for (const m of matches) {
    const w = ensure(m.whitePlayerId, m.whitePlayerName)
    const b = ensure(m.blackPlayerId, m.blackPlayerName)
    if (m.result === 'WHITE_WIN') { w.wins++; b.losses++ }
    else if (m.result === 'BLACK_WIN') { b.wins++; w.losses++ }
    else { w.draws++; b.draws++ }
  }
  return Array.from(map.values()).sort(
    (a, b) => (b.wins + b.draws * 0.5) - (a.wins + a.draws * 0.5)
  )
}

// ── Podium config ────────────────────────────────────────────────────────────

const PODIUM_CONFIG = [
  { label: '1°', bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400' },
  { label: '2°', bg: 'bg-slate-400/10',  border: 'border-slate-400/30',  text: 'text-slate-300' },
  { label: '3°', bg: 'bg-orange-800/10', border: 'border-orange-700/30', text: 'text-orange-500' },
]

// ── Match result display ─────────────────────────────────────────────────────

function MatchResultDisplay({ result }: { result: ApiMatch['result'] }) {
  if (result === 'WHITE_WIN') {
    return (
      <span className="font-mono text-sm font-bold">
        <span style={{ color: 'var(--primary)' }}>1</span>
        <span className="text-muted-foreground mx-1">–</span>
        <span style={{ color: 'var(--trend-down)' }}>0</span>
      </span>
    )
  }
  if (result === 'BLACK_WIN') {
    return (
      <span className="font-mono text-sm font-bold">
        <span style={{ color: 'var(--trend-down)' }}>0</span>
        <span className="text-muted-foreground mx-1">–</span>
        <span style={{ color: 'var(--primary)' }}>1</span>
      </span>
    )
  }
  return <span className="font-mono text-sm font-bold text-muted-foreground">½ – ½</span>
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TournamentDetailPage({ params }: Props) {
  const { id } = use(params)

  const [tournament, setTournament] = useState<any>(null)
  const [matches, setMatches] = useState<ApiMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/tournaments/${id}`).then((r) => r.json()),
      fetch(`${API_URL}/matches/tournament/${id}`).then((r) => r.json()),
    ])
      .then(([t, m]) => {
        setTournament(t)
        setMatches(Array.isArray(m) ? m : [])
      })
      .catch((err) => console.error('Error fetching tournament:', err))
      .finally(() => setLoading(false))
  }, [id])

  const playerStats = useMemo(() => computePlayerStats(matches), [matches])

  const totalDraws = matches.filter((m) => m.result === 'DRAW').length
  const drawsPct = matches.length > 0 ? Math.round((totalDraws / matches.length) * 100) : 0

  const matchesByRound = useMemo(() => {
    const map = new Map<number, ApiMatch[]>()
    for (const m of matches) {
      if (!map.has(m.round)) map.set(m.round, [])
      map.get(m.round)!.push(m)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b)
  }, [matches])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ongoing':  return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'upcoming': return 'bg-primary/20 text-primary border-primary/30'
      case 'completed': return 'bg-muted text-muted-foreground border-border'
      default: return ''
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Blitz':
      case 'Rapid': return <Clock className="w-5 h-5" />
      default: return <Trophy className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Cargando torneo...
      </main>
    )
  }

  if (!tournament) {
    notFound()
  }

  const statsItems = [
    { icon: Swords,     label: 'Partidas',   value: matches.length,     suffix: '' },
    { icon: Users,      label: 'Jugadores',  value: playerStats.length, suffix: '' },
    { icon: Layers,     label: 'Rondas',     value: tournament.rounds,  suffix: '' },
    { icon: BarChart3,  label: 'Tablas',     value: drawsPct,           suffix: '%' },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 chess-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/tournaments">
                <ArrowLeft className="w-4 h-4" />
                Volver a Torneos
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 chess-pattern opacity-5 -rotate-12 translate-x-16 -translate-y-16" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge
                  variant="outline"
                  className={cn('capitalize text-sm', getStatusStyle(tournament.status))}
                >
                  {tournament.status}
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getTypeIcon(tournament.type)}
                  <span className="font-medium">{tournament.type}</span>
                </div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              >
                {tournament.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Fecha</div>
                    <div className="font-medium text-foreground">
                      {new Date(tournament.date).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Rondas</div>
                    <div className="font-medium text-foreground">{tournament.rounds}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Participantes</div>
                    <div className="font-medium text-foreground">{tournament.participants}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Ubicación</div>
                    <div className="font-medium text-foreground">UNCuyo</div>
                  </div>
                </div>
              </motion.div>

              {tournament.winner && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8 pt-8 border-t border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Campeón del torneo</div>
                      <div className="text-2xl font-bold text-gold-gradient">{tournament.winner}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {matches.length > 0 && (
        <>
          {/* ── Section A — Stats strip ──────────────────────────────────── */}
          <section
            className="py-12 px-4"
            style={{
              background: 'var(--surface)',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statsItems.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="glass rounded-2xl p-5 flex flex-col gap-2"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Section B — Top 3 podium ─────────────────────────────────── */}
          {playerStats.length >= 1 && (
            <section className="py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-bold text-foreground">Podio del Torneo</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Top 3 jugadores por puntuación
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {playerStats.slice(0, 3).map((player, i) => {
                    const cfg = PODIUM_CONFIG[i]
                    const score = player.wins + player.draws * 0.5
                    return (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={cn('glass rounded-2xl border p-6', cfg.bg, cfg.border)}
                      >
                        <div className={cn('text-3xl font-bold mb-3', cfg.text)}>{cfg.label}</div>
                        <div className="font-semibold text-foreground text-lg leading-tight mb-1 truncate">
                          {player.name}
                        </div>
                        <div className={cn('text-2xl font-bold mb-4', cfg.text)}>
                          {score % 1 === 0 ? score : score.toFixed(1)}{' '}
                          <span className="text-base font-normal text-muted-foreground">pts</span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span>
                            <span className="font-bold" style={{ color: 'var(--primary)' }}>
                              {player.wins}
                            </span>{' '}
                            <span className="text-muted-foreground">V</span>
                          </span>
                          <span>
                            <span className="font-bold text-foreground">{player.draws}</span>{' '}
                            <span className="text-muted-foreground">T</span>
                          </span>
                          <span>
                            <span className="font-bold" style={{ color: 'var(--trend-down)' }}>
                              {player.losses}
                            </span>{' '}
                            <span className="text-muted-foreground">D</span>
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ── Section C — Round by round ───────────────────────────────── */}
          <section
            className="py-16 px-4"
            style={{
              background: 'var(--surface)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-xl font-bold text-foreground">Ronda por Ronda</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Todas las partidas del torneo
                </p>
              </motion.div>

              <div className="space-y-6">
                {matchesByRound.map(([round, roundMatches], i) => (
                  <motion.div
                    key={round}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                    className="glass rounded-2xl border border-border/50 overflow-hidden"
                  >
                    <div className="px-5 py-3 border-b border-border/50 flex items-center gap-3"
                      style={{ background: 'rgba(109,190,69,0.05)' }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{round}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        Ronda {round}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {roundMatches.length} partida{roundMatches.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="divide-y divide-border/30">
                      {roundMatches.map((match) => (
                        <div key={match.id} className="px-5 py-3 flex items-center gap-2 md:gap-4">
                          <span
                            className={cn(
                              'flex-1 text-sm text-right truncate',
                              match.result === 'WHITE_WIN'
                                ? 'font-semibold text-foreground'
                                : 'text-muted-foreground'
                            )}
                          >
                            {match.whitePlayerName}
                          </span>

                          <div className="flex-shrink-0 w-16 md:w-20 text-center">
                            <MatchResultDisplay result={match.result} />
                          </div>

                          <span
                            className={cn(
                              'flex-1 text-sm text-left truncate',
                              match.result === 'BLACK_WIN'
                                ? 'font-semibold text-foreground'
                                : 'text-muted-foreground'
                            )}
                          >
                            {match.blackPlayerName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Section D — ELO changes */}
          {/* TODO: requires eloAfter/eloBefore fields in MatchResponse or PlayerResponse */}
        </>
      )}

      <Footer />
    </main>
  )
}
