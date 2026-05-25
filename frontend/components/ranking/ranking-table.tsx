'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowDown, ArrowUp, Minus, Search } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { API_URL } from '@/lib/api'
import { faculties } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { eloClass, mockTrend, rankNumberClass } from '@/lib/ranking-display'

interface PlayerRow {
  id: number
  rank: number
  name: string
  faculty: string
  career: string
  elo: number
  wins: number
  draws: number
  losses: number
}

function TrendCell({ index, total }: { index: number; total: number }) {
  const { trend, delta } = mockTrend(index, total)
  if (trend === 'up' && delta != null) {
    return (
      <span className="inline-flex items-center gap-0.5 text-sm font-medium text-chess-green">
        <ArrowUp className="h-3.5 w-3.5" />
        {delta}
      </span>
    )
  }
  if (trend === 'down' && delta != null) {
    return (
      <span className="inline-flex items-center gap-0.5 text-sm font-medium text-chess-red">
        <ArrowDown className="h-3.5 w-3.5" />
        {delta}
      </span>
    )
  }
  return <Minus className="mx-auto h-3.5 w-3.5 text-chess-muted" />
}

export function RankingTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [facultyFilter, setFacultyFilter] = useState<string>('all')
  const [players, setPlayers] = useState<PlayerRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/ranking`)
      .then((response) => response.json())
      .then((data) => {
        const formatted: PlayerRow[] = data.map(
          (player: {
            playerId: number
            position: number
            fullName: string
            faculty: string
            career: string
            eloRating: number
            wins: number
            draws: number
            losses: number
          }) => ({
            id: player.playerId,
            rank: player.position,
            name: player.fullName,
            faculty: player.faculty,
            career: player.career ?? '',
            elo: player.eloRating,
            wins: player.wins,
            draws: player.draws,
            losses: player.losses,
          }),
        )
        setPlayers(formatted)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching ranking:', error)
        setLoading(false)
      })
  }, [])

  const facultyOptions = useMemo(() => {
    const fromData = [...new Set(players.map((p) => p.faculty))]
    return fromData.length > 0 ? fromData : faculties
  }, [players])

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFaculty = facultyFilter === 'all' || player.faculty === facultyFilter
    return matchesSearch && matchesFaculty
  })

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-chess-muted">Cargando ranking oficial...</div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chess-muted" />
          <Input
            placeholder="Buscar jugador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-[var(--chess-border)] bg-chess-navy-light pl-9 text-chess-cream"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFacultyFilter('all')}
            className={cn(
              'rounded-sm px-3 py-1.5 text-xs font-medium transition-colors',
              facultyFilter === 'all' ? 'pill-active' : 'pill-inactive',
            )}
          >
            Todas
          </button>
          {facultyOptions.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFacultyFilter(f)}
              className={cn(
                'rounded-sm px-3 py-1.5 text-xs font-medium transition-colors',
                facultyFilter === f ? 'pill-active' : 'pill-inactive',
              )}
            >
              {f.length > 28 ? `${f.slice(0, 26)}…` : f}
            </button>
          ))}
        </div>
      </div>

      <div className="chess-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ background: 'var(--chess-navy-light)' }}>
            <thead>
              <tr
                className="border-b text-[10px] font-medium uppercase tracking-[1.5px] text-chess-muted"
                style={{
                  background: 'rgba(109, 190, 69, 0.05)',
                  borderColor: 'var(--chess-border)',
                }}
              >
                <th className="w-14 px-4 py-3">#</th>
                <th className="px-4 py-3">Jugador</th>
                <th className="hidden px-4 py-3 md:table-cell">Facultad</th>
                <th className="px-4 py-3 text-right">ELO</th>
                <th className="px-4 py-3 text-center">Tendencia</th>
                <th className="px-4 py-3 text-center">V</th>
                <th className="px-4 py-3 text-center">T</th>
                <th className="px-4 py-3 text-center">D</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player, index) => (
                <motion.tr
                  key={player.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group border-b border-[var(--chess-border)] transition-colors hover:border-l-2 hover:border-l-[rgba(109,190,69,0.5)] hover:bg-[rgba(109,190,69,0.04)]"
                >
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        'font-display text-lg',
                        rankNumberClass(player.rank),
                      )}
                    >
                      {player.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/players/${player.id}`}>
                      <span className="font-medium text-chess-cream group-hover:text-chess-green">
                        {player.name}
                      </span>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3.5 md:table-cell">
                    <span className="block text-sm text-chess-cream">{player.faculty}</span>
                    {player.career && (
                      <span className="block text-xs text-chess-muted">{player.career}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span
                      className={cn(
                        'font-display text-[22px] tracking-[1px]',
                        eloClass(player.rank),
                      )}
                    >
                      {player.elo}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <TrendCell index={index} total={filteredPlayers.length} />
                  </td>
                  <td className="px-4 py-3.5 text-center text-sm font-medium text-chess-green">
                    {player.wins}
                  </td>
                  <td className="px-4 py-3.5 text-center text-sm text-chess-muted">
                    {player.draws}
                  </td>
                  <td className="px-4 py-3.5 text-center text-sm text-chess-red">
                    {player.losses}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPlayers.length === 0 && (
          <p className="p-12 text-center text-sm text-chess-muted">
            No se encontraron jugadores con los criterios seleccionados.
          </p>
        )}
      </div>
    </div>
  )
}
