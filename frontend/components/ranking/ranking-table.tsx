'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { API_URL } from '@/lib/api'
import { uncuyoFaculties } from '@/lib/faculties'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

function getTrendMock(index: number, total: number): number {
  if (index === 0) return 3
  if (index === 1) return 2
  if (index === 2) return 1
  if (index >= total - 3) return -(total - index)
  return 0
}

function TrendCell({ trend }: { trend: number }) {
  if (trend > 0) return (
    <span style={{
      color: 'var(--trend-up)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 13,
      fontWeight: 600,
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="3">
        <polyline points="18 15 12 9 6 15" />
      </svg>
      {trend}
    </span>
  )
  if (trend < 0) return (
    <span style={{
      color: 'var(--trend-down)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 13,
      fontWeight: 600,
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="3">
        <polyline points="6 9 12 15 18 9" />
      </svg>
      {Math.abs(trend)}
    </span>
  )
  return <span style={{ color: '#4a5568', fontSize: 13 }}>—</span>
}

export function RankingTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState<string>('Todas')
  const [players, setPlayers] = useState<any[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/ranking`)
      .then((response) => response.json())
      .then((data) => {
        const formattedPlayers = data.map((player: any) => ({
          id: player.playerId,
          rank: player.position,
          name: player.fullName,
          faculty: player.faculty,
          career: player.career,
          elo: player.eloRating,
          wins: player.wins,
          draws: player.draws,
          losses: player.losses,
        }))

        const withTrend = formattedPlayers.map((player: any, index: number) => ({
          ...player,
          trendNum: getTrendMock(index, formattedPlayers.length),
        }))

        setPlayers(withTrend)
      })
      .catch((error) => console.error('Error fetching ranking:', error))
  }, [])

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFaculty = selectedFaculty === 'Todas' || player.faculty === selectedFaculty
    return matchesSearch && matchesFaculty
  })

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-amber-500 text-amber-950'
      case 2: return 'bg-slate-400 text-slate-900'
      case 3: return 'bg-orange-600 text-orange-950'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <div>
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '0 0 260px' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar jugadores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Faculty select */}
        <select
          value={selectedFaculty}
          onChange={e => setSelectedFaculty(e.target.value)}
          style={{
            background: '#1a2335',
            border: '1px solid rgba(109,190,69,0.20)',
            borderRadius: 4,
            padding: '8px 36px 8px 14px',
            color: '#f0ede8',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236DBE45' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            minWidth: 200,
          }}
        >
          <option value="Todas">Todas las facultades</option>
          {uncuyoFaculties.map(faculty => (
            <option key={faculty} value={faculty}>
              {faculty.replace('Facultad de ', '')}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-sm font-semibold text-muted-foreground p-4 w-16">
                  Pos
                </th>
                <th className="text-left text-sm font-semibold text-muted-foreground p-4">
                  Jugador
                </th>
                <th className="text-left text-sm font-semibold text-muted-foreground p-4 hidden sm:table-cell">
                  Facultad
                </th>
                <th className="text-right text-sm font-semibold text-muted-foreground p-4">
                  ELO
                </th>
                <th className="text-center text-sm font-semibold text-muted-foreground p-4 hidden md:table-cell">
                  V/T/D
                </th>
                <th className="text-center text-sm font-semibold text-muted-foreground p-4 w-20">
                  Tendencia
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPlayers.map((player, index) => (
                <motion.tr
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="border-b border-border/30 hover:bg-secondary/50 transition-colors"
                  onMouseEnter={() => setHoveredId(player.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={
                    hoveredId === player.id
                      ? { boxShadow: 'inset 3px 0 0 rgba(109,190,69,0.5)' }
                      : undefined
                  }
                >
                  <td className="p-4">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      getRankStyle(player.rank)
                    )}>
                      {player.rank}
                    </div>
                  </td>

                  <td className="p-4">
                    <Link href={`/players/${player.id}`} className="flex items-center gap-3 group/link">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-muted-foreground">
                        {player.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground group-hover/link:text-primary transition-colors">
                          {player.name}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {player.faculty}
                        </div>
                      </div>
                    </Link>
                  </td>

                  <td className="p-4 hidden sm:table-cell">
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                        {player.faculty}
                      </div>
                      {/* TODO: agregar campo career cuando el backend lo provea */}
                      {player.career && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {player.career}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <span className="text-lg font-bold text-gold-gradient">
                      {player.elo}
                    </span>
                  </td>

                  <td className="p-4 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <span style={{ color: 'var(--trend-up)' }}>{player.wins}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-muted-foreground">{player.draws}</span>
                      <span className="text-muted-foreground">/</span>
                      <span style={{ color: 'var(--trend-down)' }}>{player.losses}</span>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <TrendCell trend={player.trendNum} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPlayers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">
              No se encontraron jugadores con los criterios seleccionados.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
