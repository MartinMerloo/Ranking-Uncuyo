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

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
      <div
        style={{ width: 3, height: 28, background: 'var(--primary)', borderRadius: 2, flexShrink: 0 }}
      />
      <h2 className="font-display text-2xl tracking-widest text-foreground">{children}</h2>
    </div>
  )
}

function ResultDisplay({
  result,
  whitePlayerName,
  blackPlayerName,
}: {
  result: ApiMatch['result']
  whitePlayerName: string
  blackPlayerName: string
}) {
  if (result === 'WHITE_WIN') {
    return (
      <div className="flex items-center justify-between gap-4 py-3">
        <span
          className="flex-1 text-sm font-semibold text-right truncate"
          style={{ color: 'var(--primary)' }}
        >
          {whitePlayerName}
        </span>
        <span
          className="flex-shrink-0 font-mono text-sm px-3 py-1 rounded-lg"
          style={{ background: 'rgba(109,190,69,0.12)', color: 'var(--primary)' }}
        >
          1 – 0
        </span>
        <span className="flex-1 text-sm text-muted-foreground truncate">
          {blackPlayerName}
        </span>
      </div>
    )
  }
  if (result === 'BLACK_WIN') {
    return (
      <div className="flex items-center justify-between gap-4 py-3">
        <span className="flex-1 text-sm text-muted-foreground text-right truncate">
          {whitePlayerName}
        </span>
        <span
          className="flex-shrink-0 font-mono text-sm px-3 py-1 rounded-lg"
          style={{ background: 'rgba(224,92,92,0.12)', color: '#e05c5c' }}
        >
          0 – 1
        </span>
        <span
          className="flex-1 text-sm font-semibold truncate"
          style={{ color: 'var(--primary)' }}
        >
          {blackPlayerName}
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="flex-1 text-sm text-muted-foreground text-right truncate">
        {whitePlayerName}
      </span>
      <span
        className="flex-shrink-0 font-mono text-sm px-3 py-1 rounded-lg"
        style={{ background: 'rgba(138,155,176,0.12)', color: 'var(--text-secondary)' }}
      >
        ½ – ½
      </span>
      <span className="flex-1 text-sm text-muted-foreground truncate">
        {blackPlayerName}
      </span>
    </div>
  )
}

// ── Podium config: 1st center, 2nd left, 3rd right ───────────────────────────

const PODIUM = [
  { label: '1°', bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400', order: 'md:order-2', mt: 'md:mt-0' },
  { label: '2°', bg: 'bg-slate-400/10',  border: 'border-slate-400/30',  text: 'text-slate-300',  order: 'md:order-1', mt: 'md:mt-8' },
  { label: '3°', bg: 'bg-orange-800/10', border: 'border-orange-700/30', text: 'text-orange-500', order: 'md:order-3', mt: 'md:mt-8' },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TournamentDetailPage({ params }: Props) {
  const { id } = use(params)

  const [tournament, setTournament] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<ApiMatch[]>([])
  const [matchesLoading, setMatchesLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/tournaments/${id}`)
      .then((r) => r.json())
      .then((data) => setTournament(data))
      .catch((err) => console.error('Error fetching tournament:', err))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    fetch(`${API_URL}/matches/tournament/${id}`)
      .then((r) => r.json())
      .then((data: ApiMatch[]) => setMatches(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setMatchesLoading(false))
  }, [id])

  // ── Computed stats ───────────────────────────────────────────────────────

  const totalMatches = matches.length
  const uniquePlayers = useMemo(
    () =>
      new Set([
        ...matches.map((m) => m.whitePlayerId),
        ...matches.map((m) => m.blackPlayerId),
      ]).size,
    [matches]
  )
  const totalRounds = totalMatches > 0 ? Math.max(...matches.map((m) => m.round)) : 0
  const draws = matches.filter((m) => m.result === 'DRAW').length
  const drawPct = totalMatches > 0 ? Math.round((draws / totalMatches) * 100) : 0

  // ── Player scores ────────────────────────────────────────────────────────

  const top3 = useMemo(() => {
    const scores: Record<
      number,
      { id: number; name: string; points: number; wins: number; draws: number; losses: number }
    > = {}

    const ensure = (pid: number, name: string) => {
      if (!scores[pid]) scores[pid] = { id: pid, name, points: 0, wins: 0, draws: 0, losses: 0 }
    }

    for (const m of matches) {
      ensure(m.whitePlayerId, m.whitePlayerName)
      ensure(m.blackPlayerId, m.blackPlayerName)
      if (m.result === 'WHITE_WIN') {
        scores[m.whitePlayerId].points += 1
        scores[m.whitePlayerId].wins += 1
        scores[m.blackPlayerId].losses += 1
      } else if (m.result === 'BLACK_WIN') {
        scores[m.blackPlayerId].points += 1
        scores[m.blackPlayerId].wins += 1
        scores[m.whitePlayerId].losses += 1
      } else {
        scores[m.whitePlayerId].points += 0.5
        scores[m.whitePlayerId].draws += 1
        scores[m.blackPlayerId].points += 0.5
        scores[m.blackPlayerId].draws += 1
      }
    }

    return Object.values(scores)
      .sort((a, b) => b.points - a.points)
      .slice(0, 3)
  }, [matches])

  // ── Rounds ───────────────────────────────────────────────────────────────

  const rounds = useMemo(
    () =>
      Array.from({ length: totalRounds }, (_, i) => ({
        round: i + 1,
        matches: matches.filter((m) => m.round === i + 1),
      })),
    [matches, totalRounds]
  )

  // ── Status/type helpers ──────────────────────────────────────────────────

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ongoing':   return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'upcoming':  return 'bg-primary/20 text-primary border-primary/30'
      case 'completed': return 'bg-muted text-muted-foreground border-border'
      default:          return ''
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Blitz':
      case 'Rapid': return <Clock className="w-5 h-5" />
      default:       return <Trophy className="w-5 h-5" />
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

      {/* ── Matches loading ───────────────────────────────────────────────── */}
      {matchesLoading && (
        <div className="text-center text-muted-foreground py-12">
          Cargando partidas...
        </div>
      )}

      {!matchesLoading && totalMatches > 0 && (
        <>
          {/* ── Section A — Stats strip ────────────────────────────────── */}
          <section
            className="py-12 px-4"
            style={{
              background: 'var(--surface)',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Swords,    label: 'Partidas',  value: totalMatches },
                { icon: Users,     label: 'Jugadores', value: uniquePlayers },
                { icon: Layers,    label: 'Rondas',    value: totalRounds },
                { icon: BarChart3, label: '% Tablas',  value: `${drawPct}%` },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="font-display text-3xl text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Section B — Top 3 podium ──────────────────────────────── */}
          {top3.length >= 1 && (
            <section className="py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <SectionTitle>TOP 3</SectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  {top3.map((player, i) => {
                    const cfg = PODIUM[i]
                    return (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: i * 0.15 }}
                        whileHover={{ y: -4 }}
                        className={cn(
                          'glass rounded-2xl border p-6 cursor-default',
                          cfg.bg,
                          cfg.border,
                          cfg.order,
                          cfg.mt
                        )}
                      >
                        {/* Rank + initials avatar */}
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
                              cfg.bg,
                              cfg.text
                            )}
                            style={{ border: '1px solid currentColor' }}
                          >
                            {cfg.label}
                          </div>
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-foreground"
                            style={{ background: 'rgba(255,255,255,0.07)' }}
                          >
                            {getInitials(player.name)}
                          </div>
                        </div>

                        {/* Name */}
                        <div className="font-semibold text-foreground text-base leading-tight mb-1 truncate">
                          {player.name}
                        </div>

                        {/* Score */}
                        <div className={cn('font-display text-3xl mb-4', cfg.text)}>
                          {player.points % 1 === 0
                            ? player.points
                            : player.points.toFixed(1)}{' '}
                          <span className="text-base font-sans font-normal text-muted-foreground">
                            pts
                          </span>
                        </div>

                        {/* W / D / L */}
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
                            <span
                              className="font-bold"
                              style={{ color: 'var(--trend-down)' }}
                            >
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

          {/* ── Section C — Round by round ────────────────────────────── */}
          <section
            className="py-16 px-4"
            style={{
              background: 'var(--surface)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div className="max-w-4xl mx-auto">
              <SectionTitle>RONDA POR RONDA</SectionTitle>

              <div className="space-y-5">
                {rounds.map(({ round, matches: roundMatches }, i) => (
                  <motion.div
                    key={round}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}
                    className="glass rounded-2xl border border-border/50 overflow-hidden"
                  >
                    <div
                      className="px-5 py-3 border-b border-border/50 flex items-center gap-3"
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

                    <div className="divide-y divide-border/30 px-5">
                      {roundMatches.map((match) => (
                        <ResultDisplay
                          key={match.id}
                          result={match.result}
                          whitePlayerName={match.whitePlayerName}
                          blackPlayerName={match.blackPlayerName}
                        />
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
