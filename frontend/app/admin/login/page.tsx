'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Crown, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!data.ok) {
        setError('Contraseña incorrecta. Intentá de nuevo.')
        return
      }

      window.location.href = '/admin'
      
    } catch {
      setError('No se pudo iniciar sesión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <motion.div className="absolute inset-0 chess-pattern opacity-5" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 transition-colors group-hover:bg-primary/30">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-bold text-foreground">Ranking UNCuyo</span>
              <span className="block text-xs font-medium text-primary">Panel de administración</span>
            </div>
          </Link>
        </div>

        <Card className="glass border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <motion.div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Lock className="h-5 w-5 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Ingresar</CardTitle>
            <CardDescription>
              Ingresá la contraseña de administrador para acceder al panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Ingresar'}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link href="/" className="text-primary hover:underline">
                Volver al sitio público
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
