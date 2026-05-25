export type TrendDirection = 'up' | 'down' | 'stable'

export function mockTrend(index: number, total: number): { trend: TrendDirection; delta: number | null } {
  if (index < 3) {
    return { trend: 'up', delta: 3 - index }
  }
  if (index >= total - 3 && total > 6) {
    return { trend: 'down', delta: index - (total - 4) }
  }
  return { trend: 'stable', delta: null }
}

export function rankNumberClass(rank: number): string {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return 'text-chess-muted'
}

export function eloClass(rank: number): string {
  return rank === 1 ? 'text-chess-gold' : 'text-chess-cream'
}
