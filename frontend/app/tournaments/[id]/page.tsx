'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use, useEffect, useState } from 'react'
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
import { API_URL, type ApiMatch, type ApiStandingEntry } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: Promise<{ id: string }>
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const LICHESS = 'https://lichess1.org/assets/piece/cburnett/'

function fmtPts(pts: number) {
  return pts % 1 === 0 ? String(pts) : pts.toFixed(1)
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

// ── ResultDisplay ─────────────────────────────────────────────────────────────

function ResultDisplay({ match }: { match: ApiMatch }) {
  const { result, whitePlayerName, blackPlayerName } = match
  if (result === 'WHITE_WIN') {
    return (
      <div className="flex items-center justify-between gap-4">
        <span className="flex-1 text-sm font-semibold text-right truncate" style={{ color: 'var(--primary)' }}>
          {whitePlayerName}
        </span>
        <span className="flex-shrink-0 font-mono text-sm px-3 py-1 rounded-lg"
          style={{ background: 'rgba(109,190,69,0.12)', color: 'var(--primary)' }}>
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
        <span className="flex-shrink-0 font-mono text-sm px-3 py-1 rounded-lg"
          style={{ background: 'rgba(224,92,92,0.12)', color: '#e05c5c' }}>
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
      <span className="flex-shrink-0 font-mono text-sm px-3 py-1 rounded-lg"
        style={{ background: 'rgba(138,155,176,0.12)', color: 'var(--text-secondary)' }}>
        ½ – ½
      </span>
      <span className="flex-1 text-sm text-muted-foreground truncate">{blackPlayerName}</span>
    </div>
  )
}

// ── PodiumPlatform ────────────────────────────────────────────────────────────

function PodiumPlatform() {
  return (
    <svg
      viewBox="0 0 600 160"
      style={{ width: '100%', maxWidth: 600, display: 'block', margin: '0 auto' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Step 2 — left, height 80 */}
      <rect x="20" y="80" width="175" height="80" rx="6"
        fill="#2a3a52" stroke="rgba(138,155,176,0.3)" strokeWidth="1.5" />
      <text x="107" y="128" textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontSize="36" fontWeight="700" fill="rgba(138,155,176,0.5)">
        2
      </text>

      {/* Step 1 — center, height 120 (tallest) */}
      <rect x="210" y="40" width="180" height="120" rx="6"
        fill="#2a3a52" stroke="rgba(212,160,23,0.45)" strokeWidth="1.5" />
      {/* Gold glow */}
      <rect x="210" y="40" width="180" height="120" rx="6"
        fill="url(#goldGlow)" opacity="0.15" />
      <text x="300" y="115" textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontSize="40" fontWeight="700" fill="rgba(212,160,23,0.5)">
        1
      </text>

      {/* Step 3 — right, height 60 */}
      <rect x="405" y="100" width="175" height="60" rx="6"
        fill="#2a3a52" stroke="rgba(139,94,60,0.3)" strokeWidth="1.5" />
      <text x="492" y="138" textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontSize="32" fontWeight="700" fill="rgba(139,94,60,0.5)">
        3
      </text>

      <defs>
        <linearGradient id="goldGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a017" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── PodiumPlayerCard ──────────────────────────────────────────────────────────

function PodiumPlayerCard({
  player,
  rank,
}: {
  player: ApiStandingEntry
  rank: 1 | 2 | 3
}) {
  const cfg = {
    1: {
      border: 'rgba(212,160,23,0.35)',
      avatarBorder: 'rgba(212,160,23,0.5)',
      avatarBg: 'rgba(212,160,23,0.12)',
      avatarColor: '#d4a017',
      pointsColor: '#d4a017',
      delay: 0.2,
    },
    2: {
      border: 'rgba(138,155,176,0.25)',
      avatarBorder: 'rgba(138,155,176,0.4)',
      avatarBg: 'rgba(138,155,176,0.10)',
      avatarColor: '#8a9bb0',
      pointsColor: '#c0ccd8',
      delay: 0.1,
    },
    3: {
      border: 'rgba(139,94,60,0.25)',
      avatarBorder: 'rgba(139,94,60,0.4)',
      avatarBg: 'rgba(139,94,60,0.10)',
      avatarColor: '#c4845a',
      pointsColor: '#c4845a',
      delay: 0.3,
    },
  }[rank]

  const inits = player.playerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: cfg.delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${cfg.border}`,
        borderRadius: 10,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'default',
        position: 'relative',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: cfg.avatarBg,
        border: `2px solid ${cfg.avatarBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display), sans-serif',
        fontSize: 16, color: cfg.avatarColor,
        marginBottom: '0.5rem',
      }}>{inits}</div>

      {/* Name */}
      <div style={{
        fontWeight: 600, fontSize: 13,
        color: 'var(--text-primary)',
        lineHeight: 1.3, marginBottom: '0.4rem',
        maxWidth: '100%',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{player.playerName}</div>

      {/* Points */}
      <div style={{
        fontFamily: 'var(--font-display), sans-serif',
        fontSize: 30, color: cfg.pointsColor,
        lineHeight: 1, marginBottom: 2,
      }}>
        {player.points % 1 === 0 ? player.points : player.points.toFixed(1)}
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 3 }}>pts</span>
      </div>

      {/* W/T/D */}
      <div style={{ display: 'flex', gap: 10, fontSize: 12, marginTop: 6 }}>
        <span>
          <strong style={{ color: 'var(--accent)' }}>{player.wins}</strong>
          <span style={{ color: 'var(--text-secondary)', fontSize: 10, marginLeft: 2 }}>V</span>
        </span>
        <span>
          <strong style={{ color: 'var(--text-secondary)' }}>{player.draws}</strong>
          <span style={{ color: 'var(--text-secondary)', fontSize: 10, marginLeft: 2 }}>T</span>
        </span>
        <span>
          <strong style={{ color: '#e05c5c' }}>{player.losses}</strong>
          <span style={{ color: 'var(--text-secondary)', fontSize: 10, marginLeft: 2 }}>D</span>
        </span>
        {player.byes > 0 && (
          <span>
            <strong style={{ color: 'var(--text-secondary)' }}>{player.byes}</strong>
            <span style={{ color: 'var(--text-secondary)', fontSize: 10, marginLeft: 2 }}>BYE</span>
          </span>
        )}
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
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--primary)', color: '#0a1a08',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
              }}>{round}</div>
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

function FinalTableTab({ standings }: { standings: ApiStandingEntry[] }) {
  const hasByes = standings.some((s) => s.byes > 0)

  const medalColor = (i: number) => {
    if (i === 0) return '#d4a017'
    if (i === 1) return '#8a9bb0'
    if (i === 2) return '#8b5e3c'
    return 'var(--text-secondary)'
  }

  const headers = ['Pos', 'Jugador', 'Pts', 'V', 'T', 'D', ...(hasByes ? ['BYE'] : []), 'PJ']

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
            <tr style={{ background: 'rgba(109,190,69,0.05)', borderBottom: '1px solid rgba(109,190,69,0.10)' }}>
              {headers.map((h) => (
                <th key={h} style={{
                  padding: '12px 16px',
                  textAlign: h === 'Jugador' ? 'left' : 'center',
                  fontSize: 10, fontWeight: 700,
                  color: 'var(--text-secondary)',
                  letterSpacing: '1.5px', textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((player, index) => (
              <tr
                key={player.playerId}
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
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 18, color: medalColor(index), fontWeight: 700 }}>
                    {index + 1}
                  </span>
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: index === 0 ? 'rgba(212,160,23,0.12)' : 'rgba(109,190,69,0.08)',
                      border: `1px solid ${index === 0 ? 'rgba(212,160,23,0.3)' : 'rgba(109,190,69,0.2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                      color: index === 0 ? '#d4a017' : 'var(--primary)',
                      fontFamily: 'var(--font-display, sans-serif)',
                    }}>{initials(player.playerName)}</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {player.playerName}
                    </span>
                  </div>
                </td>

                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 20, color: index === 0 ? '#d4a017' : 'var(--text-primary)' }}>
                    {fmtPts(player.points)}
                  </span>
                </td>

                {player.gamesPlayed === 0 ? (
                  <td colSpan={hasByes ? 5 : 4} style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: 11, color: 'var(--text-secondary)',
                      background: 'rgba(138,155,176,0.1)',
                      border: '1px solid rgba(138,155,176,0.2)',
                      borderRadius: 4, padding: '2px 8px',
                      letterSpacing: '1px', textTransform: 'uppercase',
                    }}>Ausente</span>
                  </td>
                ) : (
                  <>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>{player.wins}</span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{player.draws}</span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#e05c5c' }}>{player.losses}</span>
                    </td>

                    {hasByes && (
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{player.byes}</span>
                      </td>
                    )}

                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{player.gamesPlayed}</span>
                    </td>
                  </>
                )}
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
  const [standings, setStandings] = useState<ApiStandingEntry[]>([])
  const [standingsLoading, setStandingsLoading] = useState(true)
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

  useEffect(() => {
    fetch(`${API_URL}/tournaments/${id}/standings`)
      .then((r) => r.json())
      .then((data: ApiStandingEntry[]) => setStandings(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setStandingsLoading(false))
  }, [id])

  const top3 = standings.slice(0, 3)

  const totalMatches = matches.length
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

  const dataReady = !matchesLoading && !standingsLoading

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
                <Badge variant="outline" className={cn('capitalize text-sm', getStatusStyle(tournament.status))}>
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
                {[
                  { icon: Calendar, label: 'Fecha', value: new Date(tournament.date).toLocaleDateString('es-AR') },
                  { icon: Layers,   label: 'Rondas', value: tournament.rounds },
                  { icon: Users,    label: 'Participantes', value: tournament.participants },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="font-medium text-foreground">{value}</div>
                    </div>
                  </div>
                ))}
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

      {!dataReady && (
        <div className="text-center text-muted-foreground py-12">Cargando partidas...</div>
      )}

      {dataReady && totalMatches > 0 && (
        <>
          {/* ── Stats strip ──────────────────────────────────────────────── */}
          <section className="py-12 px-4" style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Swords,    label: 'Partidas',  value: totalMatches },
                { icon: Users,     label: 'Jugadores', value: standings.length },
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
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── TOP 3 podium ─────────────────────────────────────────────── */}
          {top3.length >= 3 && (
            <section className="py-12 px-4">
              <div className="max-w-4xl mx-auto">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
                  <div style={{ width: 3, height: 28, background: 'var(--accent)', borderRadius: 2 }} />
                  <h2 className="font-display text-2xl tracking-widest text-foreground">TOP 3</h2>
                </div>

                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                  {/* Trophy above #1 */}
                  <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}
                  >
                    <Trophy className="w-8 h-8 text-amber-400" style={{ filter: 'drop-shadow(0 0 8px rgba(212,160,23,0.5))' }} />
                  </motion.div>

                  {/* Cards row — 2nd left | 1st center | 3rd right */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 12,
                    alignItems: 'flex-end',
                    marginBottom: 0,
                  }}>
                    {/* 2nd — aligned to bottom of grid */}
                    <div style={{ paddingBottom: 40 }}>
                      <PodiumPlayerCard player={top3[1]} rank={2} />
                    </div>
                    {/* 1st — tallest, no padding */}
                    <div>
                      <PodiumPlayerCard player={top3[0]} rank={1} />
                    </div>
                    {/* 3rd — lower than 2nd */}
                    <div style={{ paddingBottom: 60 }}>
                      <PodiumPlayerCard player={top3[2]} rank={3} />
                    </div>
                  </div>

                  {/* SVG Platform below cards */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0.8 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                  >
                    <PodiumPlatform />
                  </motion.div>
                </div>
              </div>
            </section>
          )}

          {/* ── Tabs ─────────────────────────────────────────────────────── */}
          <section className="pb-24" style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <div className="max-w-4xl mx-auto px-4 pt-10 mb-6">
              <div style={{
                display: 'flex', gap: 4,
                background: 'var(--background)',
                border: '1px solid rgba(109,190,69,0.12)',
                borderRadius: 8, padding: 4,
                width: 'fit-content',
              }}>
                {([
                  { key: 'rounds' as const, label: 'Ronda por Ronda' },
                  { key: 'table'  as const, label: 'Tabla Final' },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '8px 20px', borderRadius: 6, border: 'none',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      letterSpacing: '0.5px', transition: 'all 0.15s',
                      background: activeTab === tab.key ? 'var(--primary)' : 'transparent',
                      color: activeTab === tab.key ? '#0a1a08' : 'var(--text-secondary)',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

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
