import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/home/hero'
import { StatsSection } from '@/components/home/stats-section'
import { TopPlayersSection } from '@/components/home/top-players-section'
import { TournamentsSection } from '@/components/home/tournaments-section'
import { FeaturedPlayerSection } from '@/components/home/featured-player-section'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsSection />
      <TopPlayersSection />
      <TournamentsSection />
      <FeaturedPlayerSection />
      <Footer />
    </main>
  )
}
