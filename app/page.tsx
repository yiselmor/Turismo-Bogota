"use client"

import { LanguageProvider } from '@/context/language-context'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { ExploreSection } from '@/components/explore-section'
import { ExperiencesSection } from '@/components/experiences-section' // 1. Nueva importación
import { InteractiveMap } from '@/components/interactive-map'
import { Footer } from '@/components/footer'

export default function BogotaLocalJourney() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <ExploreSection />
          {/* 2. Inserción de la sección de experiencias */}
          <ExperiencesSection />
          <InteractiveMap />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}