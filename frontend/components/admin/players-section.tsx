'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  type ApiPlayer,
  type CreatePlayerBody,
} from '@/lib/api'
import { uncuyoFaculties } from '@/lib/faculties'
import { AdminError } from '@/components/admin/admin-error'
import { AdminLoading } from '@/components/admin/admin-loading'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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

const MATCHES_DELETE_ERROR = 'No se puede eliminar un jugador con partidas registradas'

export function PlayersSection() {
  const [players, setPlayers] = useState<ApiPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [editingPlayer, setEditingPlayer] = useState<ApiPlayer | null>(null)
  const [playerToDelete, setPlayerToDelete] = useState<ApiPlayer | null>(null)

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

  const openEditDialog = (player: ApiPlayer) => {
    setEditingPlayer(player)
    setFullName(player.fullName)
    setFaculty(player.faculty)
    setCareer(player.career)
    setEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditDialogOpen(false)
    setEditingPlayer(null)
    resetForm()
  }

  const openDeleteDialog = (player: ApiPlayer) => {
    setPlayerToDelete(player)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setPlayerToDelete(null)
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
      setCreateDialogOpen(false)
      resetForm()
      await loadPlayers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear jugador')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPlayer) return
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
      await apiPut<ApiPlayer>(`/players/${editingPlayer.id}`, body)
      toast.success('Jugador actualizado')
      closeEditDialog()
      await loadPlayers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar jugador')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!playerToDelete) return

    setDeleting(true)
    try {
      await apiDelete(`/players/${playerToDelete.id}`)
      toast.success('Jugador eliminado')
      closeDeleteDialog()
      await loadPlayers()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar jugador'
      toast.error(message.includes(MATCHES_DELETE_ERROR) ? MATCHES_DELETE_ERROR : message)
    } finally {
      setDeleting(false)
    }
  }

  const playerFormFields = (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="player-fullName">Nombre completo</Label>
        <Input
          id="player-fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nombre y apellido"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="player-faculty">Facultad</Label>
        <Select value={faculty} onValueChange={setFaculty} required>
          <SelectTrigger id="player-faculty">
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
        <Label htmlFor="player-career">Carrera</Label>
        <Input
          id="player-career"
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          placeholder=""
          required
        />
      </div>
    </div>
  )

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

        <Dialog
          open={createDialogOpen}
          onOpenChange={(open) => {
            setCreateDialogOpen(open)
            if (!open) resetForm()
          }}
        >
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
              {playerFormFields}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
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

      <Dialog open={editDialogOpen} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Editar jugador</DialogTitle>
              <DialogDescription>
                Modificá nombre, facultad o carrera. El ELO y estadísticas no cambian.
              </DialogDescription>
            </DialogHeader>
            {playerFormFields}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeEditDialog}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar jugador</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro? Esta acción no se puede deshacer.
              {playerToDelete && (
                <span className="mt-2 block font-medium text-foreground">
                  {playerToDelete.fullName}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                void handleDelete()
              }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                <TableHead className="w-[100px] text-right">Acciones</TableHead>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(player)}
                        aria-label={`Editar ${player.fullName}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openDeleteDialog(player)}
                        aria-label={`Eliminar ${player.fullName}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
