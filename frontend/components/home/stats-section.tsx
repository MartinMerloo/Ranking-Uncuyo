'use client'

import { Users, Trophy, Swords, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { API_URL } from '@/lib/api'
import { useCounter } from '@/hooks/use-counter'

function StatItem({
  label,
  value,
  icon: Icon,
  suffix = '',
}: {
  label: string
  value: number
  icon: typeof Users
  suffix?: string
}) {
  const { count, ref } = useCounter(value, 1500)

  return (
    <div ref={ref} className="flex flex-1 flex-col items-center px-4 py-8 text-center sm:px-6">
      <Icon className="mb-3 h-5 w-5 text-chess-green" />
      <p className="font-display text-4xl tracking-[2px] text-chess-cream md:text-5xl">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-xs font-medium text-chess-muted">{label}</p>
    </div>
  )
}

export function StatsSection() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activeTournaments: 0,
    matchesPlayed: 0,
    highestElo: 0,
  })

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/ranking`).then((res) => res.json()),
      fetch(`${API_URL}/tournaments`).then((res) => res.json()),
    ])
      .then(([playersData, tournamentsData]) => {
        setStats({
          totalPlayers: playersData.length,
          activeTournaments: tournamentsData.filter(
            (t: { status?: string }) => t.status === 'ongoing',
          ).length,
          matchesPlayed: playersData.reduce(
            (acc: number, p: { wins: number; losses: number; draws: number }) =>
              acc + p.wins + p.losses + p.draws,
            0,
          ),
          highestElo:
            playersData.length > 0
              ? Math.max(...playersData.map((p: { eloRating: number }) => p.eloRating))
              : 0,
        })
      })
      .catch((error) => console.error('Error fetching stats:', error))
  }, [])

  return (
    <section
      className="border-y border-[var(--chess-border)]"
      style={{ background: 'var(--chess-navy-light)' }}
    >
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row">
        <StatItem label="Jugadores" value={stats.totalPlayers} icon={Users} />
        <StatItem label="Torneos activos" value={stats.activeTournaments} icon={Trophy} />
        <StatItem label="Partidas jugadas" value={stats.matchesPlayed} icon={Swords} suffix="+" />
        <StatItem label="ELO más alto" value={stats.highestElo} icon={TrendingUp} />
      </div>
    </section>
  )
}
