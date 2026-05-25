import { API_URL, parseApiError } from '@/lib/api'

export interface ClubCareerMapping {
  faculty: string
  career: string
}

export interface ClubMappingSuggestion {
  clubCiudad: string
  faculty: string
  career: string
}

export interface ImportedPlayerSummary {
  fullName: string
  clubCiudad: string
  faculty: string
  career: string
  elo: number
  isNew: boolean
}

export interface TournamentImportResult {
  tournamentId: number | null
  tournamentName: string
  playersCreated: number
  playersSkipped: number
  matchesCreated: number
  rounds: number
  preview: boolean
  mappingsComplete: boolean
  explicitAcademicColumns: boolean
  uniqueClubValues: string[]
  clubSuggestions: ClubMappingSuggestion[]
  playersList: ImportedPlayerSummary[]
}

export type ClubMappings = Record<string, ClubCareerMapping>

export async function postTournamentImport(options: {
  crossTableFile: File
  classificationFile?: File | null
  mappings?: ClubMappings
  dryRun: boolean
}): Promise<TournamentImportResult> {
  const formData = new FormData()
  formData.append('file', options.crossTableFile)
  if (options.classificationFile) {
    formData.append('classificationFile', options.classificationFile)
  }
  if (options.mappings) {
    formData.append('mappings', JSON.stringify(options.mappings))
  }

  const params = new URLSearchParams()
  params.set('dryRun', String(options.dryRun))

  const response = await fetch(
    `${API_URL}/tournaments/import-excel?${params.toString()}`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }

  return response.json()
}
