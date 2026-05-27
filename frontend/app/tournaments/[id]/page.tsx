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

// ── Standings ────────────────────────────────────────────────────────────────

interface PlayerScore {
  id: number
  name: string
  points: number
  wins: number
  draws: number
  losses: number
  gamesPlayed: number
}

function calculateStandings(matches: ApiMatch[]): PlayerScore[] {
  const scores: Record<number, PlayerScore> = {}

  matches.forEach((m) => {
    if (!scores[m.whitePlayerId]) {
      scores[m.whitePlayerId] = {
        id: m.whitePlayerId, name: m.whitePlayerName,
        points: 0, wins: 0, draws: 0, losses: 0, gamesPlayed: 0,
      }
    }
    if (!scores[m.blackPlayerId]) {
      scores[m.blackPlayerId] = {
        id: m.blackPlayerId, name: m.blackPlayerName,
        points: 0, wins: 0, draws: 0, losses: 0, gamesPlayed: 0,
      }
    }

    if (m.result === 'WHITE_WIN') {
      scores[m.whitePlayerId].points += 1
      scores[m.whitePlayerId].wins += 1
      scores[m.whitePlayerId].gamesPlayed += 1
      scores[m.blackPlayerId].losses += 1
      scores[m.blackPlayerId].gamesPlayed += 1
    } else if (m.result === 'BLACK_WIN') {
      scores[m.blackPlayerId].points += 1
      scores[m.blackPlayerId].wins += 1
      scores[m.blackPlayerId].gamesPlayed += 1
      scores[m.whitePlayerId].losses += 1
      scores[m.whitePlayerId].gamesPlayed += 1
    } else {
      scores[m.whitePlayerId].points += 0.5
      scores[m.whitePlayerId].draws += 1
      scores[m.whitePlayerId].gamesPlayed += 1
      scores[m.blackPlayerId].points += 0.5
      scores[m.blackPlayerId].draws += 1
      scores[m.blackPlayerId].gamesPlayed += 1
    }
  })

  return Object.values(scores).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return b.wins - a.wins
  })
}

function fmtPts(pts: number) {
  return pts % 1 === 0 ? String(pts) : pts.toFixed(1)
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

// ── ResultDisplay ────────────────────────────────────────────────────────────

function ResultDisplay({ match }: { match: ApiMatch }) {
  const { result, whitePlayerName, blackPlayerName } = match
  if (result === 'WHITE_WIN') {
    return (
      <div className="flex items-center justify-between gap-4">
        <span className="flex-1 text-sm font-semibold text-right truncate" style={{ color: 'var(--primary)' }}>
          {whitePlayerName}
        </span>
        <span
          className="flex-shrink-0 font-mono text-sm px-3 py-1 rounded-lg"
          style={{ background: 'rgba(109,190,69,0.12)', color: 'var(--primary)' }}
        >
          1 – 0
        </span>
        <span className="flex-1 text-sm text-muted-foreground truncate">{blackPlayerName}</span>
      </div>
    )
  }
  if (result === 'BLACK_WIN') {
    return (
      <div className="flex items-center justify-between gap-4">
        <span className="flex-1 text-sm text-muted-foreground text-right truncate">{whitePlayerName}</span>
        <span
          className="flex-shrink-0 font-mono text-sm px-3 py-1 rounded-lg"
          style={{ background: 'rgba(224,92,92,0.12)', color: '#e05c5c' }}
        >
          0 – 1
        </span>
        <span className="flex-1 text-sm font-semibold truncate" style={{ color: 'var(--primary)' }}>
          {blackPlayerName}
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex-1 text-sm text-muted-foreground text-right truncate">{whitePlayerName}</span>
      <span
        className="flex-shrink-0 font-mono text-sm px-3 py-1 rounded-lg"
        style={{ background: 'rgba(138,155,176,0.12)', color: 'var(--text-secondary)' }}
      >
        ½ – ½
      </span>
      <span className="flex-1 text-sm text-muted-foreground truncate">{blackPlayerName}</span>
    </div>
  )
}

// ── PodiumCard ────────────────────────────────────────────────────────────────

function PodiumCard({ player, rank }: { player: PlayerScore; rank: 1 | 2 | 3 }) {
  const cfg = {
    1: {
      badge: 'bg-amber-500 text-black',
      avatar: 'border-amber-500/50 bg-amber-500/10',
      initialsColor: 'text-amber-400',
      points: 'text-amber-400',
      label: 'Campeón',
      scale: 'md:scale-105',
      border: 'border-amber-500/30',
    },
    2: {
      badge: 'bg-slate-400 text-black',
      avatar: 'border-slate-400/40 bg-slate-400/10',
      initialsColor: 'text-slate-300',
      points: 'text-slate-300',
      label: '2° Lugar',
      scale: '',
      border: 'border-border/50',
    },
    3: {
      badge: 'bg-amber-700 text-white',
      avatar: 'border-amber-700/40 bg-amber-700/10',
      initialsColor: 'text-amber-700',
      points: 'text-amber-700',
      label: '3° Lugar',
      scale: '',
      border: 'border-border/50',
    },
  }[rank]

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: rank === 1 ? 0.1 : rank === 2 ? 0 : 0.2 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={cn(
        'glass rounded-2xl p-6 flex flex-col items-center text-center relative border shadow-lg',
        cfg.border,
        cfg.scale
      )}
    >
      {/* Rank badge */}
      <div
        className={cn(
          'absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
          cfg.badge
        )}
      >
        {rank}
      </div>

      {/* Label */}
      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-4 mt-1">
        {cfg.label}
      </div>

      {/* Avatar */}
      <div
        className={cn(
          'w-16 h-16 rounded-full border-2 flex items-center justify-center font-display text-xl mb-3',
          cfg.avatar,
          cfg.initialsColor
        )}
      >
        {initials(player.name)}
      </div>

      {/* Name */}
      <div className="font-semibold text-foreground text-sm leading-tight mb-1 max-w-full truncate px-2">
        {player.name}
      </div>

      {/* Points */}
      <div className={cn('font-display text-4xl leading-none my-3', cfg.points)}>
        {fmtPts(player.points)}
        <span className="text-sm font-sans text-muted-foreground ml-1">pts</span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border/50 my-3" />

      {/* W/D/L */}
      <div className="flex gap-4 text-sm">
        <span>
          <span className="font-bold" style={{ color: 'var(--primary)' }}>{player.wins}</span>
          <span className="text-muted-foreground text-xs ml-1">V</span>
        </span>
        <span>
          <span className="font-bold text-muted-foreground">{player.draws}</span>
          <span className="text-muted-foreground text-xs ml-1">T</span>
        </span>
        <span>
          <span className="font-bold" style={{ color: '#e05c5c' }}>{player.losses}</span>
          <span className="text-muted-foreground text-xs ml-1">D</span>
        </span>
      </div>
    </motion.div>
  )
}

// ── RoundsTab ─────────────────────────────────────────────────────────────────

function RoundsTab({ matches }: { matches: ApiMatch[] }) {
  const totalRounds = matches.length > 0 ? Math.max(...matches.map((m) => m.round)) : 0
  const rounds = Array.from({ length: totalRounds }, (_, i) => ({
    round: i + 1,
    matches: matches.filter((m) => m.round === i + 1),
  }))

  return (
    <div className="space-y-4">
      {rounds.map(({ round, matches: roundMatches }) => (
        <motion.div
          key={round}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: Math.min(round * 0.05, 0.25) }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--primary)', color: '#0a1a08',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                }}
              >
                {round}
              </div>
              <span className="font-semibold text-foreground">Ronda {round}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {roundMatches.length} partida{roundMatches.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-border/30">
            {roundMatches.map((match) => (
              <div key={match.id} className="px-6 py-3">
                <ResultDisplay match={match} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── FinalTableTab ─────────────────────────────────────────────────────────────

function FinalTableTab({ standings }: { standings: PlayerScore[] }) {
  const medalColor = (index: number) => {
    if (index === 0) return '#d4a017'
    if (index === 1) return '#8a9bb0'
    if (index === 2) return '#8b5e3c'
    return 'var(--text-secondary)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                background: 'rgba(109,190,69,0.05)',
                borderBottom: '1px solid rgba(109,190,69,0.10)',
              }}
            >
              {['Pos', 'Jugador', 'Pts', 'V', 'T', 'D', 'PJ'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: h === 'Jugador' ? 'left' : 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((player, index) => (
              <tr
                key={player.id}
                style={{ borderBottom: '1px solid rgba(109,190,69,0.06)', transition: 'background 0.15s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(109,190,69,0.04)'
                  e.currentTarget.style.borderLeft = '2px solid rgba(109,190,69,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderLeft = 'none'
                }}
              >
                {/* Position */}
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display, sans-serif)',
                      fontSize: 18,
                      color: medalColor(index),
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </span>
                </td>

                {/* Player name */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: index === 0 ? 'rgba(212,160,23,0.12)' : 'rgba(109,190,69,0.08)',
                        border: `1px solid ${index === 0 ? 'rgba(212,160,23,0.3)' : 'rgba(109,190,69,0.2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, flexShrink: 0,
                        color: index === 0 ? '#d4a017' : 'var(--primary)',
                        fontFamily: 'var(--font-display, sans-serif)',
                      }}
                    >
                      {initials(player.name)}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {player.name}
                    </span>
                  </div>
                </td>

                {/* Points */}
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display, sans-serif)',
                      fontSize: 20,
                      color: index === 0 ? '#d4a017' : 'var(--text-primary)',
                    }}
                  >
                    {fmtPts(player.points)}
                  </span>
                </td>

                {/* Wins */}
                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>
                    {player.wins}
                  </span>
                </td>

                {/* Draws */}
                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    {player.draws}
                  </span>
                </td>

                {/* Losses */}
                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e05c5c' }}>
                    {player.losses}
                  </span>
                </td>

                {/* Games played */}
                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {player.gamesPlayed}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TournamentDetailPage({ params }: Props) {
  const { id } = use(params)

  const [tournament, setTournament] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<ApiMatch[]>([])
  const [matchesLoading, setMatchesLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'rounds' | 'table'>('rounds')

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

  const standings = useMemo(() => calculateStandings(matches), [matches])
  const top3 = standings.slice(0, 3)

  const totalMatches = matches.length
  const uniquePlayers = standings.length
  const totalRounds = totalMatches > 0 ? Math.max(...matches.map((m) => m.round)) : 0
  const draws = matches.filter((m) => m.result === 'DRAW').length
  const drawPct = totalMatches > 0 ? Math.round((draws / totalMatches) * 100) : 0

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

      {matchesLoading && (
        <div className="text-center text-muted-foreground py-12">Cargando partidas...</div>
      )}

      {!matchesLoading && totalMatches > 0 && (
        <>
          {/* ── Stats strip ───────────────────────────────────────────────── */}
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

          {/* ── TOP 3 podium ──────────────────────────────────────────────── */}
          {top3.length >= 3 && (
            <section className="py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}
                >
                  <div
                    style={{ width: 3, height: 28, background: 'var(--primary)', borderRadius: 2 }}
                  />
                  <h2 className="font-display text-2xl tracking-widest text-foreground">TOP 3</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {/* 2nd place — left, pushed down */}
                  <div className="md:mt-10 md:order-1">
                    <PodiumCard player={top3[1]} rank={2} />
                  </div>
                  {/* 1st place — center */}
                  <div className="md:order-2">
                    <PodiumCard player={top3[0]} rank={1} />
                  </div>
                  {/* 3rd place — right, pushed down */}
                  <div className="md:mt-10 md:order-3">
                    <PodiumCard player={top3[2]} rank={3} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── Tabs ──────────────────────────────────────────────────────── */}
          <section
            className="pb-24"
            style={{
              background: 'var(--surface)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {/* Tab header */}
            <div className="max-w-4xl mx-auto px-4 pt-10 mb-6">
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  background: 'var(--background)',
                  border: '1px solid rgba(109,190,69,0.12)',
                  borderRadius: 8,
                  padding: 4,
                  width: 'fit-content',
                }}
              >
                {[
                  { key: 'rounds' as const, label: 'Ronda por Ronda' },
                  { key: 'table'  as const, label: 'Tabla Final' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      transition: 'all 0.15s',
                      background: activeTab === tab.key ? 'var(--primary)' : 'transparent',
                      color: activeTab === tab.key ? '#0a1a08' : 'var(--text-secondary)',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="max-w-4xl mx-auto px-4">
              {activeTab === 'rounds' && <RoundsTab matches={matches} />}
              {activeTab === 'table'  && <FinalTableTab standings={standings} />}
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
