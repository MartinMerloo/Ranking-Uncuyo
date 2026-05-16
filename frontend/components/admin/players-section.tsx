'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Users } from 'lucide-react'
import { toast } from 'sonner'
import {
  apiGet,
  apiPost,
  type ApiPlayer,
  type CreatePlayerBody,
} from '@/lib/api'
import { uncuyoFaculties } from '@/lib/faculties'
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

export function PlayersSection() {
  const [players, setPlayers] = useState<ApiPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [fullName, setFullName] = useState('')
  const [faculty, setFaculty] = useState('')
  const [career, setCareer] = useState('')

  const loadPlayers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<ApiPlayer[]>('/players')
      setPlayers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los jugadores')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPlayers()
  }, [loadPlayers])

  const resetForm = () => {
    setFullName('')
    setFaculty('')
    setCareer('')
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !faculty || !career.trim()) {
      toast.error('Completá todos los campos')
      return
    }

    setSubmitting(true)
    try {
      const body: CreatePlayerBody = {
        fullName: fullName.trim(),
        faculty,
        career: career.trim(),
      }
      await apiPost<ApiPlayer>('/players', body)
      toast.success('Jugador creado correctamente')
      setDialogOpen(false)
      resetForm()
      await loadPlayers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear jugador')
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
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Jugadores</h2>
            <p className="text-sm text-muted-foreground">
              {players.length} jugador{players.length !== 1 ? 'es' : ''} registrado
              {players.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo jugador
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card sm:max-w-md">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Registrar jugador</DialogTitle>
                <DialogDescription>
                  El jugador comenzará con ELO inicial de 1400.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nombre y apellido"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="faculty">Facultad</Label>
                  <Select value={faculty} onValueChange={setFaculty} required>
                    <SelectTrigger id="faculty">
                      <SelectValue placeholder="Seleccionar facultad" />
                    </SelectTrigger>
                    <SelectContent>
                      {uncuyoFaculties.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="career">Carrera</Label>
                  <Input
                    id="career"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    placeholder=""
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
                  {submitting ? 'Guardando...' : 'Crear jugador'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <AdminError message={error} />}

      <div className="glass overflow-hidden rounded-2xl border border-border/50">
        {loading ? (
          <AdminLoading label="Cargando jugadores..." />
        ) : players.length === 0 && !error ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No hay jugadores registrados. Creá el primero con el botón de arriba.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Nombre</TableHead>
                <TableHead>Facultad</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead className="text-right">ELO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id} className="border-border/50">
                  <TableCell className="font-medium">{player.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{player.faculty}</TableCell>
                  <TableCell className="text-muted-foreground">{player.career}</TableCell>
                  <TableCell className="text-right font-mono text-primary">
                    {player.eloRating}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  )
}