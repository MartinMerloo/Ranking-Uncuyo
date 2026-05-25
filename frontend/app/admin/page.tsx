'use client'

import { motion } from 'framer-motion'
import { Settings, Upload } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AdminLogoutButton } from '@/components/admin/admin-logout-button'
import { PlayersSection } from '@/components/admin/players-section'
import { TournamentsSection } from '@/components/admin/tournaments-section'
import { MatchesSection } from '@/components/admin/matches-section'
import { ImportSection } from '@/components/admin/import-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 chess-pattern opacity-5"
        />
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="mb-6 flex justify-end">
              <AdminLogoutButton />
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <Settings className="h-4 w-4" />
                Administración
              </div>
              <h1 className="mb-3 text-4xl font-bold text-foreground md:text-5xl">
                Panel <span className="text-gold-gradient">Admin</span>
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Gestioná jugadores, torneos y resultados de partidas. Los cambios en ELO se
                reflejan automáticamente en el ranking público.
              </p>
            </div>
          </motion.div>

          <Tabs defaultValue="players" className="w-full">
            <TabsList className="mb-8 grid h-auto w-full grid-cols-2 gap-1 bg-secondary/50 p-1 sm:grid-cols-4 sm:w-auto sm:inline-flex">
              <TabsTrigger value="players" className="px-4 py-2.5">
                Jugadores
              </TabsTrigger>
              <TabsTrigger value="tournaments" className="px-4 py-2.5">
                Torneos
              </TabsTrigger>
              <TabsTrigger value="matches" className="px-4 py-2.5">
                Partidas
              </TabsTrigger>
              <TabsTrigger value="import" className="gap-2 px-4 py-2.5">
                <Upload className="h-4 w-4" />
                Importar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="players">
              <PlayersSection />
            </TabsContent>
            <TabsContent value="tournaments">
              <TournamentsSection />
            </TabsContent>
            <TabsContent value="matches">
              <MatchesSection />
            </TabsContent>
            <TabsContent value="import">
              <ImportSection />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  )
}
