'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { API_URL } from '@/lib/api'
import { SectionHeading } from '@/components/ui/section-heading'
import { cn } from '@/lib/utils'
import { eloClass, mockTrend, rankNumberClass } from '@/lib/ranking-display'

interface Row {
  playerId: number
  position: number
  fullName: string
  faculty: string
  career: string
  eloRating: number
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
  return (
    <span className="inline-flex items-center text-chess-muted">
      <Minus className="h-3.5 w-3.5" />
    </span>
  )
}

export function HomeRankingPreview() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/ranking`)
      .then((res) => res.json())
      .then((data: Row[]) => {
        setRows(data.slice(0, 5))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="border-t border-[var(--chess-border)] px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title="Ranking" subtitle="Top 5 jugadores" className="mb-0" />
          <Link href="/ranking" className="text-sm font-medium text-chess-green hover:underline">
            Ver tabla completa →
          </Link>
        </div>

        <div className="chess-card overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-sm text-chess-muted">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr
                    className="border-b text-[10px] font-medium uppercase tracking-[1.5px] text-chess-muted"
                    style={{
                      background: 'rgba(109, 190, 69, 0.05)',
                      borderColor: 'var(--chess-border)',
                    }}
                  >
                    <th className="w-12 px-4 py-3">#</th>
                    <th className="px-4 py-3">Jugador</th>
                    <th className="hidden px-4 py-3 sm:table-cell">Facultad</th>
                    <th className="px-4 py-3 text-right">ELO</th>
                    <th className="hidden px-4 py-3 text-center md:table-cell">Tend.</th>
                    <th className="px-4 py-3 text-center">V</th>
                    <th className="px-4 py-3 text-center">T</th>
                    <th className="px-4 py-3 text-center">D</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <motion.tr
                      key={row.playerId}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="group border-b border-[var(--chess-border)] transition-colors hover:border-l-2 hover:border-l-chess-green hover:bg-[rgba(109,190,69,0.04)]"
                    >
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            'font-display text-lg',
                            rankNumberClass(row.position),
                          )}
                        >
                          {row.position}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Link href={`/players/${row.playerId}`} className="block">
                          <span className="font-medium text-chess-cream group-hover:text-chess-green">
                            {row.fullName}
                          </span>
                          <span className="block text-xs text-chess-muted">{row.career}</span>
                        </Link>
                      </td>
                      <td className="hidden px-4 py-3.5 text-sm text-chess-muted sm:table-cell">
                        {row.faculty}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={cn(
                            'font-display text-xl tracking-[1px]',
                            eloClass(row.position),
                          )}
                        >
                          {row.eloRating}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3.5 text-center md:table-cell">
                        <TrendCell index={index} total={rows.length} />
                      </td>
                      <td className="px-4 py-3.5 text-center text-sm text-chess-green">
                        {row.wins}
                      </td>
                      <td className="px-4 py-3.5 text-center text-sm text-chess-muted">
                        {row.draws}
                      </td>
                      <td className="px-4 py-3.5 text-center text-sm text-chess-red">
                        {row.losses}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
