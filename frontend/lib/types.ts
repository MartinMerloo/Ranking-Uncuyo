export interface Player {
  id: string
  name: string
  elo: number
  rank: number
  faculty: string
  wins: number
  losses: number
  draws: number
  avatar?: string
  trend: 'up' | 'down' | 'stable'
  eloChange: number
}

export interface Tournament {
  id: string
  name: string
  type: 'Swiss' | 'Round Robin' | 'Knockout' | 'Blitz' | 'Rapid'
  date: string
  rounds: number
  participants: number
  status: 'upcoming' | 'ongoing' | 'completed'
  winner?: string
}

export interface Match {
  id: string
  opponentId: string
  opponentName: string
  tournamentId: string
  tournamentName: string
  round: number
  result: '1-0' | '0-1' | '½-½'
  date: string
  eloChange: number
}

export interface Stats {
  totalPlayers: number
  activeTournaments: number
  matchesPlayed: number
  highestElo: number
}
