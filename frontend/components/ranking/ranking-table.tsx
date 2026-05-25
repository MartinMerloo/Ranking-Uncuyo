'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { API_URL } from '@/lib/api'
import { uncuyoFaculties } from '@/lib/faculties'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

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
          eloChange: 0,
          trend: 'stable',
        }))

        setPlayers(formattedPlayers)
      })
      .catch((error) => console.error('Error fetching ranking:', error))
  }, [])

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFaculty = selectedFaculty === 'Todas' || player.faculty === selectedFaculty
    return matchesSearch && matchesFaculty
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" style={{ color: 'var(--trend-up)' }} />
      case 'down':
        return <TrendingDown className="w-4 h-4" style={{ color: 'var(--trend-down)' }} />
      default:
        return <Minus className="w-4 h-4" style={{ color: 'var(--trend-neutral)' }} />
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-500 text-amber-950'
      case 2:
        return 'bg-slate-400 text-slate-900'
      case 3:
        return 'bg-orange-600 text-orange-950'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <div>
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar jugadores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Faculty pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFaculty('Todas')}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              selectedFaculty === 'Todas'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            )}
          >
            Todas
          </button>
          {uncuyoFaculties.map((faculty) => (
            <button
              key={faculty}
              onClick={() => setSelectedFaculty(faculty)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                selectedFaculty === faculty
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              {faculty}
            </button>
          ))}
        </div>
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
                  className="border-b border-border/30 hover:bg-secondary/50 transition-colors group"
                  onMouseEnter={() => setHoveredId(player.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={
                    hoveredId === player.id
                      ? { boxShadow: 'inset 3px 0 0 rgba(109,190,69,0.5)' }
                      : undefined
                  }
                >
                  <td className="p-4">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                        getRankStyle(player.rank)
                      )}
                    >
                      {player.rank}
                    </div>
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/players/${player.id}`}
                      className="flex items-center gap-3 group/link"
                    >
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

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(player.trend)}
                      <span
                        className="text-xs font-medium"
                        style={{
                          color:
                            player.trend === 'up'
                              ? 'var(--trend-up)'
                              : player.trend === 'down'
                              ? 'var(--trend-down)'
                              : 'var(--trend-neutral)',
                        }}
                      >
                        {player.eloChange > 0 ? '+' : ''}
                        {player.eloChange}
                      </span>
                    </div>
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
