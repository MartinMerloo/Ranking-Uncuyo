'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Users, Layers, Trophy, Clock, MapPin } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { API_URL } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: Promise<{ id: string }>
}

export default function TournamentDetailPage({ params }: Props) {
  const { id } = use(params)

  const [tournament, setTournament] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/tournaments/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTournament(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching tournament:', error)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Cargando torneo...
      </main>
    )
  }

  if (!tournament) {
    notFound()
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'upcoming':
        return 'bg-primary/20 text-primary border-primary/30'
      case 'completed':
        return 'bg-muted text-muted-foreground border-border'
      default:
        return ''
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Blitz':
      case 'Rapid':
        return <Clock className="w-5 h-5" />
      default:
        return <Trophy className="w-5 h-5" />
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 chess-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="max-w-4xl mx-auto relative">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/tournaments">
                <ArrowLeft className="w-4 h-4" />
                Volver a Torneos
              </Link>
            </Button>
          </motion.div>

          {/* Tournament Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 chess-pattern opacity-5 -rotate-12 translate-x-16 -translate-y-16" />
            
            <div className="relative">
              {/* Status & Type */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge 
                  variant="outline" 
                  className={cn('capitalize text-sm', getStatusStyle(tournament.status))}
                >
                  {tournament.status}
                </Badge>

                <div className="flex items-center gap-2 text-muted-foreground">
                  {getTypeIcon(tournament.type)}
                  <span className="font-medium">{tournament.type}</span>
                </div>
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              >
                {tournament.name}
              </motion.h1>

              {/* Details Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Fecha</div>
                    <div className="font-medium text-foreground">
                      {new Date(tournament.date).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Rondas</div>
                    <div className="font-medium text-foreground">
                      {tournament.rounds}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Participantes</div>
                    <div className="font-medium text-foreground">
                      {tournament.participants}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Ubicación</div>
                    <div className="font-medium text-foreground">
                      UnCuyo
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Winner Section */}
              {tournament.winner && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8 pt-8 border-t border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-amber-500" />
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">
                        Campeón del torneo
                      </div>

                      <div className="text-2xl font-bold text-gold-gradient">
                        {tournament.winner}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}