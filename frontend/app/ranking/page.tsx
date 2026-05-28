'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { RankingTable } from '@/components/ranking/ranking-table'

export default function RankingPage() {
  const [eloOpen, setEloOpen] = useState(false)

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

      {/* ELO Info Panel */}
      <section className="px-4 pb-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setEloOpen((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: eloOpen ? 'var(--primary)' : 'var(--text-secondary)',
              padding: '4px 0',
              marginBottom: eloOpen ? 10 : 0,
              transition: 'color 0.15s',
            }}
          >
            <Info size={15} />
            ¿Cómo funciona el ELO?
          </button>

          {eloOpen && (
            <div style={{
              background: 'rgba(109,190,69,0.05)',
              border: '1px solid rgba(109,190,69,0.12)',
              borderRadius: 8,
              padding: '16px 20px',
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                El sistema ELO no solo cuenta victorias — evalúa la calidad de los rivales.
              </p>
              <ul style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, margin: '8px 0 10px', paddingLeft: 0, listStyle: 'none' }}>
                <li>• Ganar contra un rival fuerte suma más puntos que ganar contra uno débil.</li>
                <li>• Perder contra un rival fuerte resta menos puntos que perder contra uno débil.</li>
                <li>• Dos jugadores pueden tener el mismo ELO con distintos resultados si enfrentaron rivales de distinta fortaleza.</li>
              </ul>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.7, opacity: 0.7, margin: 0 }}>
                K-factor: 40 · ELO inicial: 1400 · Piso mínimo: 1400
              </p>
            </div>
          )}
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
