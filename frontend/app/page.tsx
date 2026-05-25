import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/home/hero'
import { StatsSection } from '@/components/home/stats-section'
import { TopPlayersSection } from '@/components/home/top-players-section'
import { HomeRankingPreview } from '@/components/home/home-ranking-preview'
import { HomeLastTournament } from '@/components/home/home-last-tournament'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-chess-navy">
      <Navbar />
      <Hero />
      <StatsSection />
      <TopPlayersSection />
      <HomeRankingPreview />
      <HomeLastTournament />
      <Footer />
    </main>
  )
}
