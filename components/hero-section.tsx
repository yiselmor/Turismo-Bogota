"use client"

import { useLanguage } from '@/context/language-context'
import { Button } from '@/components/ui/button'
import { MapPin, ChevronDown } from 'lucide-react'

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brick-red/10 via-cream to-deep-green/10" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gold/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brick-red/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-deep-green/15 rounded-full blur-2xl" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Small Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brick-red/10 border border-brick-red/20 mb-8">
          <MapPin className="w-4 h-4 text-brick-red" />
          <span className="text-sm font-medium text-brick-red">Colombia</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-balance">
          <span className="block text-6xl sm:text-8xl lg:text-9xl font-bold text-foreground tracking-tight">
            {t('hero.title')}
          </span>
          <span className="block text-2xl sm:text-4xl lg:text-5xl font-light text-brick-red mt-2 tracking-wide">
            {t('hero.subtitle')}
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg"
            className="bg-brick-red hover:bg-brick-red/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg shadow-brick-red/25 hover:shadow-xl hover:shadow-brick-red/30 transition-all"
            asChild
          >
            <a href="#map">
              <MapPin className="w-5 h-5 mr-2" />
              {t('hero.cta')}
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-deep-green text-deep-green hover:bg-deep-green hover:text-primary-foreground px-8 py-6 text-lg rounded-full transition-all"
            asChild
          >
            <a href="#experiences">
              {t('hero.secondary')}
            </a>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>

      {/* Decorative Side Lines */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-brick-red/50 to-transparent" />
      </div>
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-deep-green/50 to-transparent" />
      </div>
    </section>
  )
}
