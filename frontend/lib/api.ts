export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export type TournamentType = 'BLITZ' | 'RAPID' | 'CLASSICAL'
export type MatchResultUi = 'WHITE_WINS' | 'BLACK_WINS' | 'DRAW'
export type MatchResultApi = 'WHITE_WIN' | 'BLACK_WIN' | 'DRAW'

export interface ApiPlayer {
  id: number
  fullName: string
  faculty: string
  career: string
  eloRating: number
  wins: number
  losses: number
  draws: number
  gamesPlayed: number
}

export interface ApiTournament {
  id: number
  name: string
  date: string
  type: TournamentType
  rounds: number
}

export interface CreatePlayerBody {
  fullName: string
  faculty: string
  career: string
}

export interface CreateTournamentBody {
  name: string
  date: string
  type: TournamentType
  rounds: number
}

export interface CreateMatchBody {
  tournamentId: number
  round: number
  whitePlayerId: number
  blackPlayerId: number
  result: MatchResultApi
  date: string
}

export function toApiMatchResult(result: MatchResultUi): MatchResultApi {
  switch (result) {
    case 'WHITE_WINS':
      return 'WHITE_WIN'
    case 'BLACK_WINS':
      return 'BLACK_WIN'
    case 'DRAW':
      return 'DRAW'
  }
}

export async function parseApiError(response: Response): Promise<string> {
  try {
    const data = await response.json()
    if (typeof data?.error === 'string') return data.error
    if (data?.fields) {
      return Object.values(data.fields as Record<string, string>).join(', ')
    }
    return `Error ${response.status}: ${response.statusText}`
  } catch {
    return `Error ${response.status}: ${response.statusText}`
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }
  return response.json()
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }
  return response.json()
}
