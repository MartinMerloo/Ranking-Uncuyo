'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ClipboardList, Plus, Swords, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  apiGet,
  apiPost,
  toApiMatchResult,
  type ApiPlayer,
  type ApiTournament,
  type CreateMatchBody,
  type MatchResultUi,
} from '@/lib/api'
import { AdminError } from '@/components/admin/admin-error'
import { AdminLoading } from '@/components/admin/admin-loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface PendingMatch {
  clientId: string
  round: number
  whitePlayerId: number
  blackPlayerId: number
  whitePlayerName: string
  blackPlayerName: string
  result: MatchResultUi
}

const resultLabels: Record<MatchResultUi, string> = {
  WHITE_WINS: 'Gana blancas (1-0)',
  BLACK_WINS: 'Ganan negras (0-1)',
  DRAW: 'Tablas (½-½)',
}

export function MatchesSection() {
  const [tournaments, setTournaments] = useState<ApiTournament[]>([])
  const [players, setPlayers] = useState<ApiPlayer[]>([])
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [metaError, setMetaError] = useState<string | null>(null)

  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('')
  const [round, setRound] = useState('1')
  const [whitePlayerId, setWhitePlayerId] = useState('')
  const [blackPlayerId, setBlackPlayerId] = useState('')
  const [result, setResult] = useState<MatchResultUi>('WHITE_WINS')

  const [pendingMatches, setPendingMatches] = useState<PendingMatch[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const selectedTournament = tournaments.find(
    (t) => t.id.toString() === selectedTournamentId
  )

  const loadMeta = useCallback(async () => {
    setLoadingMeta(true)
    setMetaError(null)
    try {
      const [tournamentsData, playersData] = await Promise.all([
        apiGet<ApiTournament[]>('/tournaments'),
        apiGet<ApiPlayer[]>('/players'),
      ])
      setTournaments(tournamentsData)
      setPlayers(playersData)
    } catch (err) {
      setMetaError(
        err instanceof Error ? err.message : 'No se pudieron cargar torneos y jugadores'
      )
    } finally {
      setLoadingMeta(false)
    }
  }, [])

  useEffect(() => {
    loadMeta()
  }, [loadMeta])

  const getPlayerName = (id: number) =>
    players.find((p) => p.id === id)?.fullName ?? `Jugador #${id}`

  const resetMatchForm = () => {
    setWhitePlayerId('')
    setBlackPlayerId('')
    setResult('WHITE_WINS')
  }

  const handleAddMatch = () => {
    if (!selectedTournament) {
      toast.error('Seleccioná un torneo primero')
      return
    }

    const roundNum = parseInt(round, 10)
    const whiteId = parseInt(whitePlayerId, 10)
    const blackId = parseInt(blackPlayerId, 10)

    if (!roundNum || roundNum < 1) {
      toast.error('Ingresá un número de ronda válido')
      return
    }
    if (!whiteId || !blackId) {
      toast.error('Seleccioná ambos jugadores')
      return
    }
    if (whiteId === blackId) {
      toast.error('Las blancas y negras deben ser jugadores distintos')
      return
    }
    if (roundNum > selectedTournament.rounds) {
      toast.error(`La ronda no puede superar ${selectedTournament.rounds}`)
      return
    }

    const entry: PendingMatch = {
      clientId: crypto.randomUUID(),
      round: roundNum,
      whitePlayerId: whiteId,
      blackPlayerId: blackId,
      whitePlayerName: getPlayerName(whiteId),
      blackPlayerName: getPlayerName(blackId),
      result,
    }

    setPendingMatches((prev) => [...prev, entry])
    setSuccessMessage(null)
    resetMatchForm()
    toast.success('Partida agregada a la lista')
  }

  const handleRemoveMatch = (clientId: string) => {
    setPendingMatches((prev) => prev.filter((m) => m.clientId !== clientId))
  }

  const handleSubmitAll = async () => {
    if (!selectedTournament) {
      toast.error('Seleccioná un torneo')
      return
    }
    if (pendingMatches.length === 0) {
      toast.error('Agregá al menos una partida antes de enviar')
      return
    }

    setSubmitting(true)
    setSuccessMessage(null)

    let successCount = 0
    const errors: string[] = []

    for (const match of pendingMatches) {
      try {
        const body: CreateMatchBody = {
          tournamentId: selectedTournament.id,
          round: match.round,
          whitePlayerId: match.whitePlayerId,
          blackPlayerId: match.blackPlayerId,
          result: toApiMatchResult(match.result),
          date: selectedTournament.date,
        }
        await apiPost('/matches', body)
        successCount++
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido'
        errors.push(
          `R${match.round} ${match.whitePlayerName} vs ${match.blackPlayerName}: ${msg}`
        )
      }
    }

    setSubmitting(false)

    if (successCount > 0) {
      await loadMeta()
      setPendingMatches([])
      setSuccessMessage(
        `${successCount} partida${successCount !== 1 ? 's' : ''} registrada${successCount !== 1 ? 's' : ''}. Los ELO se actualizaron automáticamente.`
      )
      toast.success('Resultados enviados correctamente')
    }

    if (errors.length > 0) {
      toast.error(`${errors.length} partida(s) fallaron`, {
        description: errors.slice(0, 2).join(' · '),
      })
    }
  }

  if (loadingMeta) {
    return <AdminLoading label="Cargando torneos y jugadores..." />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20"
        >
          <Swords className="h-5 w-5 text-primary" />
        </motion.div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Resultados de partidas</h2>
          <p className="text-sm text-muted-foreground">
            Cargá los resultados ronda por ronda para actualizar el ELO
          </p>
        </div>
      </div>

      {metaError && <AdminError message={metaError} />}

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Alert className="border-primary/30 bg-primary/10">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">¡Listo!</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass space-y-6 rounded-2xl border border-border/50 p-6">
        <div className="grid gap-2">
          <Label htmlFor="tournamentSelect">Torneo</Label>
          <Select
            value={selectedTournamentId}
            onValueChange={(v) => {
              setSelectedTournamentId(v)
              setPendingMatches([])
              setSuccessMessage(null)
            }}
          >
            <SelectTrigger id="tournamentSelect">
              <SelectValue placeholder="Seleccionar torneo" />
            </SelectTrigger>
            <SelectContent>
              {tournaments.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.name} — {t.date} ({t.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tournaments.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Creá un torneo en la pestaña Torneos antes de cargar partidas.
            </p>
          )}
        </div>

        {selectedTournament && (
          <>
            <div className="grid gap-4 border-t border-border/50 pt-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="round">Ronda</Label>
                <Input
                  id="round"
                  type="number"
                  min={1}
                  max={selectedTournament.rounds}
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid gap-2"
              >
                <Label htmlFor="whitePlayer">Blancas</Label>
                <Select value={whitePlayerId} onValueChange={setWhitePlayerId}>
                  <SelectTrigger id="whitePlayer">
                    <SelectValue placeholder="Seleccionar jugador" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.fullName} ({p.eloRating})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="blackPlayer">Negras</Label>
                  <Select value={blackPlayerId} onValueChange={setBlackPlayerId}>
                    <SelectTrigger id="blackPlayer">
                      <SelectValue placeholder="Seleccionar jugador" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.fullName} ({p.eloRating})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Resultado</Label>
              <RadioGroup
                value={result}
                onValueChange={(v) => setResult(v as MatchResultUi)}
                className="grid gap-2 sm:grid-cols-3"
              >
                {(Object.keys(resultLabels) as MatchResultUi[]).map((key) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/50 px-4 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                  >
                    <RadioGroupItem value={key} id={key} />
                    <span className="text-sm">{resultLabels[key]}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <Button type="button" variant="secondary" className="gap-2" onClick={handleAddMatch}>
              <Plus className="h-4 w-4" />
              Agregar partida a la lista
            </Button>
          </>
        )}
      </div>

      {pendingMatches.length > 0 && (
        <div className="glass space-y-4 rounded-2xl border border-border/50 p-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">
              Partidas pendientes ({pendingMatches.length})
            </h3>
          </div>
          <ul className="space-y-2">
            {pendingMatches.map((match) => (
              <li
                key={match.clientId}
                className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-secondary/30 px-4 py-3 text-sm"
              >
                <span>
                  <span className="text-muted-foreground">R{match.round}</span>{' '}
                  <span className="font-medium">{match.whitePlayerName}</span>
                  <span className="text-muted-foreground"> vs </span>
                  <span className="font-medium">{match.blackPlayerName}</span>
                  <span className="ml-2 text-primary">— {resultLabels[match.result]}</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemoveMatch(match.clientId)}
                  disabled={submitting}
                  aria-label="Eliminar partida"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            className="w-full gap-2 sm:w-auto"
            onClick={handleSubmitAll}
            disabled={submitting || !selectedTournament}
          >
            {submitting ? 'Enviando...' : 'Enviar todas las partidas'}
          </Button>
        </div>
      )}

      {players.length < 2 && !metaError && (
        <p className="text-center text-sm text-muted-foreground">
          Necesitás al menos 2 jugadores registrados para cargar partidas.
        </p>
      )}
    </motion.div>
  )
}
