'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { RankingTable } from '@/components/ranking/ranking-table'

export default function RankingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 chess-pattern opacity-5" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              <span className="text-gold-gradient">Ranking</span> Oficial
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              El ranking ELO completo de todos los jugadores registrados en la Liga de Ajedrez UNCuyo.
              Actualizado después de cada torneo y partida puntuada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ranking Table Section */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <RankingTable />
        </div>
      </section>

      <Footer />
    </main>
  )
}
