'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload,
  Users,
  Swords,
  UserPlus,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { uncuyoFaculties } from '@/lib/faculties'
import {
  postTournamentImport,
  type ClubMappings,
  type ClubMappingSuggestion,
  type TournamentImportResult,
} from '@/lib/tournament-import-api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

type WizardStep = 'upload' | 'map' | 'preview' | 'success'

const INVALID_FORMAT_HINT = 'formato esperado de Chess Results'

function clubLabel(club: string) {
  return club.trim() === '' ? '(Sin club/ciudad)' : club
}

function isMappingComplete(mapping?: { faculty: string; career: string }) {
  return Boolean(mapping?.faculty?.trim() && mapping?.career?.trim())
}

function suggestionsToMappings(suggestions: ClubMappingSuggestion[]): ClubMappings {
  return suggestions.reduce<ClubMappings>((acc, item) => {
    acc[item.clubCiudad] = {
      faculty: item.faculty ?? '',
      career: item.career ?? '',
    }
    return acc
  }, {})
}

export function ImportSection() {
  const [step, setStep] = useState<WizardStep>('upload')
  const [crossTableFile, setCrossTableFile] = useState<File | null>(null)
  const [classificationFile, setClassificationFile] = useState<File | null>(null)
  const [clubMappings, setClubMappings] = useState<ClubMappings>({})
  const [explicitAcademicColumns, setExplicitAcademicColumns] = useState(false)
  const [discoverResult, setDiscoverResult] = useState<TournamentImportResult | null>(null)
  const [previewResult, setPreviewResult] = useState<TournamentImportResult | null>(null)
  const [finalResult, setFinalResult] = useState<TournamentImportResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOverPrimary, setDragOverPrimary] = useState(false)

  const primaryInputRef = useRef<HTMLInputElement>(null)
  const secondaryInputRef = useRef<HTMLInputElement>(null)

  const incompleteClubs = useMemo(() => {
    if (!discoverResult) return new Set<string>()
    return new Set(
      discoverResult.uniqueClubValues.filter((club) => !isMappingComplete(clubMappings[club]))
    )
  }, [discoverResult, clubMappings])

  const mappingsComplete = explicitAcademicColumns
    ? true
    : discoverResult
      ? discoverResult.uniqueClubValues.every((club) => isMappingComplete(clubMappings[club]))
      : false

  const resetWizard = () => {
    setStep('upload')
    setCrossTableFile(null)
    setClassificationFile(null)
    setExplicitAcademicColumns(false)
    setClubMappings({})
    setDiscoverResult(null)
    setPreviewResult(null)
    setFinalResult(null)
    setError(null)
    setLoading(false)
    if (primaryInputRef.current) primaryInputRef.current.value = ''
    if (secondaryInputRef.current) secondaryInputRef.current.value = ''
  }

  const acceptXlsx = (file: File | null, setter: (f: File | null) => void) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      toast.error('Solo se aceptan archivos .xlsx')
      return
    }
    setter(file)
    setError(null)
  }

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'Ocurrió un error inesperado'
    setError(
      message.includes(INVALID_FORMAT_HINT)
        ? 'El archivo no tiene el formato esperado de Chess Results'
        : message
    )
  }

  const handleNextFromUpload = async () => {
    if (!crossTableFile) return
    setLoading(true)
    setError(null)
    try {
      const result = await postTournamentImport({
        crossTableFile,
        classificationFile,
        dryRun: true,
      })
      setDiscoverResult(result)
      setExplicitAcademicColumns(result.explicitAcademicColumns)

      if (result.explicitAcademicColumns) {
        if (!result.mappingsComplete) {
          toast.error(
            'El Excel incluye columnas FACULTAD y CARRERA, pero hay filas con datos académicos incompletos.'
          )
          return
        }
        setPreviewResult(result)
        setStep('preview')
        return
      }

      setClubMappings(suggestionsToMappings(result.clubSuggestions))
      setStep('map')
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = async () => {
    if (!crossTableFile || !mappingsComplete) return
    setLoading(true)
    setError(null)
    try {
      const result = await postTournamentImport({
        crossTableFile,
        classificationFile,
        mappings: clubMappings,
        dryRun: true,
      })
      if (!result.mappingsComplete) {
        toast.error('Completá todas las asignaciones de facultad y carrera')
        return
      }
      setPreviewResult(result)
      setExplicitAcademicColumns(result.explicitAcademicColumns)
      setStep('preview')
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!crossTableFile || !mappingsComplete) return
    setLoading(true)
    setError(null)
    try {
      const result = await postTournamentImport({
        crossTableFile,
        classificationFile: explicitAcademicColumns ? null : classificationFile,
        mappings: explicitAcademicColumns ? undefined : clubMappings,
        dryRun: false,
      })
      setFinalResult(result)
      setStep('success')
      toast.success('Torneo importado correctamente')
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const updateMapping = useCallback(
    (club: string, field: 'faculty' | 'career', value: string) => {
      setClubMappings((prev) => ({
        ...prev,
        [club]: {
          faculty: field === 'faculty' ? value : prev[club]?.faculty ?? '',
          career: field === 'career' ? value : prev[club]?.career ?? '',
        },
      }))
    },
    []
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
          <Upload className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Importar torneo desde Chess Results
          </h2>
          <p className="text-sm text-muted-foreground">
            Cuadro cruzado + asignación de facultades de las 12 unidades académicas UNCuyo
          </p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>{error}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setError(null)
                      if (step === 'map') handlePreview()
                      else if (step === 'preview') handleConfirm()
                      else if (step === 'upload' && crossTableFile) handleNextFromUpload()
                    }}
                  >
                    Reintentar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setError(null)}>
                    Cerrar
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="space-y-6"
          >
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Paso 1 — Archivos Excel</CardTitle>
                <CardDescription>
                  Subí el &quot;Cuadro cruzado por ranking inicial&quot; (obligatorio). Si el Excel
                  incluye columnas <strong>FACULTAD</strong> y <strong>CARRERA</strong>, se usan
                  directamente. Si no, podés subir la &quot;Clasificación Final&quot; y mapear
                  Club/Ciudad en el paso siguiente (flujo anterior).
                </CardDescription>
              </CardHeader>
            </Card>

            <UploadZone
              title="Cuadro cruzado (.xlsx)"
              required
              file={crossTableFile}
              dragOver={dragOverPrimary}
              onDragOver={setDragOverPrimary}
              onFile={(f) => acceptXlsx(f, setCrossTableFile)}
              inputRef={primaryInputRef}
            />

            <UploadZone
              title="Clasificación Final (.xlsx, opcional — solo sin columnas FACULTAD/CARRERA)"
              file={classificationFile}
              onFile={(f) => acceptXlsx(f, setClassificationFile)}
              inputRef={secondaryInputRef}
            />

            <div className="flex justify-end">
              <Button
                className="gap-2"
                disabled={!crossTableFile || loading}
                onClick={handleNextFromUpload}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Leyendo Excel...
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'map' && discoverResult && (
          <motion.div
            key="map"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="space-y-6"
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Paso 2 — Facultad y carrera</CardTitle>
                <CardDescription>
                  Torneo: <span className="font-medium text-foreground">{discoverResult.tournamentName}</span>
                  {' · '}
                  {discoverResult.rounds} rondas · {discoverResult.uniqueClubValues.length} valores
                  Club/Ciudad únicos
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {discoverResult.uniqueClubValues.map((club) => {
                const incomplete = incompleteClubs.has(club)
                const mapping = clubMappings[club] ?? { faculty: '', career: '' }
                return (
                  <div
                    key={club || '__empty__'}
                    className={cn(
                      'glass rounded-xl border p-4',
                      incomplete ? 'border-destructive/60 bg-destructive/5' : 'border-border/50'
                    )}
                  >
                    <p className="mb-3 text-sm font-medium text-foreground">
                      Club/Ciudad: <span className="text-primary">{clubLabel(club)}</span>
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Facultad</Label>
                        <Select
                          value={mapping.faculty || undefined}
                          onValueChange={(v) => updateMapping(club, 'faculty', v)}
                        >
                          <SelectTrigger className={cn(incomplete && !mapping.faculty && 'border-destructive')}>
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
                        <Label>Carrera</Label>
                        <Input
                          value={mapping.career}
                          onChange={(e) => updateMapping(club, 'career', e.target.value)}
                          placeholder="Nombre de la carrera"
                          className={cn(incomplete && !mapping.career.trim() && 'border-destructive')}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {!mappingsComplete && (
              <p className="text-sm text-destructive">
                Completá facultad y carrera para todos los valores Club/Ciudad marcados en rojo.
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button variant="outline" className="gap-2" onClick={() => setStep('upload')}>
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <Button
                className="gap-2"
                disabled={!mappingsComplete || loading}
                onClick={handlePreview}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generando vista previa...
                  </>
                ) : (
                  'Previsualizar'
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'preview' && previewResult && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="space-y-6"
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Paso 3 — Vista previa</CardTitle>
                <CardDescription className="font-medium text-foreground">
                  {previewResult.tournamentName}
                </CardDescription>
                {previewResult.explicitAcademicColumns && (
                  <p className="pt-2 text-xs text-primary">
                    Datos académicos leídos desde columnas FACULTAD y CARRERA del Excel.
                  </p>
                )}
              </CardHeader>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              <SummaryCard
                icon={UserPlus}
                value={previewResult.playersCreated}
                label="Jugadores nuevos"
                iconClass="text-emerald-500"
              />
              <SummaryCard
                icon={Users}
                value={previewResult.playersSkipped}
                label="Ya existían"
                iconClass="text-muted-foreground"
              />
              <SummaryCard
                icon={Swords}
                value={previewResult.matchesCreated}
                label="Partidas a importar"
                iconClass="text-primary"
              />
            </div>

            <div className="glass overflow-hidden rounded-2xl border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Facultad</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead className="text-right">ELO</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewResult.playersList.map((player) => (
                    <TableRow key={player.fullName} className="border-border/50">
                      <TableCell className="font-medium">{player.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">{player.faculty}</TableCell>
                      <TableCell className="text-muted-foreground">{player.career}</TableCell>
                      <TableCell className="text-right font-mono text-primary">{player.elo}</TableCell>
                      <TableCell className="text-right">
                        {player.isNew ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">
                            Nuevo
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Ya existía</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(explicitAcademicColumns ? 'upload' : 'map')}
              >
                Volver
              </Button>
              <Button className="gap-2" disabled={loading} onClick={handleConfirm}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  'Confirmar importación'
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'success' && finalResult && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            >
              <CheckCircle2 className="h-20 w-20 text-emerald-500" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                ¡Torneo importado exitosamente!
              </h3>
              <p className="mt-2 text-muted-foreground">
                {finalResult.playersCreated + finalResult.playersSkipped} jugadores ·{' '}
                {finalResult.rounds} rondas · {finalResult.matchesCreated} partidas importadas
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {finalResult.tournamentId != null && (
                <Button asChild>
                  <Link href={`/tournaments/${finalResult.tournamentId}`}>Ver torneo</Link>
                </Button>
              )}
              <Button variant="outline" onClick={resetWizard}>
                Importar otro torneo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function SummaryCard({
  icon: Icon,
  value,
  label,
  iconClass,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: number
  label: string
  iconClass: string
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="flex items-center gap-3 pt-6">
        <Icon className={cn('h-8 w-8', iconClass)} />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function UploadZone({
  title,
  required,
  file,
  dragOver,
  onDragOver,
  onFile,
  inputRef,
}: {
  title: string
  required?: boolean
  file: File | null
  dragOver?: boolean
  onDragOver?: (v: boolean) => void
  onFile: (file: File | null) => void
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver?.(true)
      }}
      onDragLeave={() => onDragOver?.(false)}
      onDrop={(e) => {
        e.preventDefault()
        onDragOver?.(false)
        onFile(e.dataTransfer.files[0] ?? null)
      }}
      className={cn(
        'glass flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-colors',
        dragOver ? 'border-primary bg-primary/5' : 'border-border/60'
      )}
    >
      <FileSpreadsheet className="h-10 w-10 text-primary/70" />
      <p className="text-center text-sm text-muted-foreground">
        {title}
        {required && <span className="text-destructive"> *</span>}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        Seleccionar archivo
      </Button>
      {file && <p className="text-sm font-medium text-foreground">{file.name}</p>}
    </div>
  )
}
