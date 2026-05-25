'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { RankingTable } from '@/components/ranking/ranking-table'
import { SectionHeading } from '@/components/ui/section-heading'

export default function RankingPage() {
  return (
    <main className="min-h-screen bg-chess-navy pt-[72px]">
      <Navbar />

      <section className="border-b border-[var(--chess-border)] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Ranking Oficial"
            subtitle="Clasificación ELO completa de la Liga de Ajedrez UNCUYO"
          />
        </div>
      </section>

      <section className="px-4 py-10 pb-20">
        <div className="mx-auto max-w-6xl">
          <RankingTable />
        </div>
      </section>

      <Footer />
    </main>
  )
}
