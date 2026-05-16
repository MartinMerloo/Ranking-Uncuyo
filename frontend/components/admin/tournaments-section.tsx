'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import {
  apiGet,
  apiPost,
  type ApiTournament,
  type CreateTournamentBody,
  type TournamentType,
} from '@/lib/api'
import { AdminError } from '@/components/admin/admin-error'
import { AdminLoading } from '@/components/admin/admin-loading'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const tournamentTypes: TournamentType[] = ['RAPID', 'BLITZ', 'CLASSICAL']

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function TournamentsSection() {
  const [tournaments, setTournaments] = useState<ApiTournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<TournamentType | ''>('')
  const [rounds, setRounds] = useState('5')

  const loadTournaments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<ApiTournament[]>('/tournaments')
      setTournaments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los torneos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTournaments()
  }, [loadTournaments])

  const resetForm = () => {
    setName('')
    setDate('')
    setType('')
    setRounds('5')
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const roundsNum = parseInt(rounds, 10)
    if (!name.trim() || !date || !type || !roundsNum || roundsNum < 1) {
      toast.error('Completá todos los campos correctamente')
      return
    }

    setSubmitting(true)
    try {
      const body: CreateTournamentBody = {
        name: name.trim(),
        date,
        type,
        rounds: roundsNum,
      }
      await apiPost<ApiTournament>('/tournaments', body)
      toast.success('Torneo creado correctamente')
      setDialogOpen(false)
      resetForm()
      await loadTournaments()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear torneo')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Torneos</h2>
            <p className="text-sm text-muted-foreground">
              {tournaments.length} torneo{tournaments.length !== 1 ? 's' : ''} registrado
              {tournaments.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo torneo
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card sm:max-w-md">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Crear torneo</DialogTitle>
                <DialogDescription>
                  Registrá un torneo organizado externamente (ej. Swiss-Manager).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="tournamentName">Nombre</Label>
                  <Input
                    id="tournamentName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Torneo Primavera 2026"
                    required
                  />
                </motion.div>
                <div className="grid gap-2">
                  <Label htmlFor="tournamentDate">Fecha</Label>
                  <Input
                    id="tournamentDate"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tournamentType">Modalidad</Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as TournamentType)}
                    required
                  >
                    <SelectTrigger id="tournamentType">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tournamentTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tournamentRounds">Rondas</Label>
                  <Input
                    id="tournamentRounds"
                    type="number"
                    min={1}
                    value={rounds}
                    onChange={(e) => setRounds(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Guardando...' : 'Crear torneo'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <AdminError message={error} />}

      <div className="glass overflow-hidden rounded-2xl border border-border/50">
        {loading ? (
          <AdminLoading label="Cargando torneos..." />
        ) : tournaments.length === 0 && !error ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No hay torneos registrados. Creá el primero con el botón de arriba.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Rondas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.map((tournament) => (
                <TableRow key={tournament.id} className="border-border/50">
                  <TableCell className="font-medium">{tournament.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(tournament.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {tournament.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{tournament.rounds}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  )
}
