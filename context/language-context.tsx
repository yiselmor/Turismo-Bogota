"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.explore': 'Explore',
    'nav.experiences': 'Experiences',
    'nav.map': 'Map',
    'nav.about': 'About',
    
    // Hero
    'hero.title': 'Bogota',
    'hero.subtitle': 'A Local Journey',
    'hero.description': 'Discover the authentic heart of Colombia through the eyes of locals. From hidden culinary gems to historic streets, experience Bogota like never before.',
    'hero.cta': 'Explore the Map',
    'hero.secondary': 'View Experiences',
    
    // Categories
    'category.gastronomy': 'Gastronomy',
    'category.gastronomy.desc': 'Savor the rich flavors of Colombian cuisine',
    'category.parks': 'Urban Parks',
    'category.parks.desc': 'Green oases in the heart of the city',
    'category.museums': 'Museums',
    'category.museums.desc': 'Journey through art, history, and culture',
    'category.heritage': 'Historic Heritage',
    'category.heritage.desc': 'Walk through centuries of history',
    
    // Sub-categories
    'sub.markets': 'Local Markets',
    'sub.markets.desc': 'Authentic flavors at Paloquemao and Plaza de la Perseverancia',
    'sub.dining': 'Fine Dining',
    'sub.dining.desc': 'World-class restaurants in Zona G and Usaquén',
    'sub.botanical': 'Botanical Gardens',
    'sub.botanical.desc': 'Discover native flora at Jardín Botánico',
    'sub.simon': 'Simón Bolívar Park',
    'sub.simon.desc': 'The green heart of Bogota',
    'sub.gold': 'Gold Museum',
    'sub.gold.desc': 'Pre-Columbian treasures and indigenous art',
    'sub.botero': 'Botero Museum',
    'sub.botero.desc': 'Masterpieces by Colombia\'s beloved artist',
    'sub.candelaria': 'La Candelaria',
    'sub.candelaria.desc': 'Colonial architecture and street art',
    'sub.monserrate': 'Monserrate',
    'sub.monserrate.desc': 'Sacred mountain with panoramic views',
    
    // Map
    'map.title': 'Explore Bogota',
    'map.subtitle': 'Click on points of interest to discover more',
    'map.poi.candelaria': 'La Candelaria',
    'map.poi.monserrate': 'Monserrate',
    'map.poi.usaquen': 'Usaquén',
    'map.poi.chapinero': 'Chapinero',
    'map.poi.teusaquillo': 'Teusaquillo',
    'map.poi.zonarosa': 'Zona Rosa',
    
    // Footer
    'footer.tagline': 'Your journey through Bogota starts here',
    'footer.contact': 'Contact',
    'footer.social': 'Follow Us',
    'footer.rights': 'All rights reserved',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.explore': 'Explorar',
    'nav.experiences': 'Experiencias',
    'nav.map': 'Mapa',
    'nav.about': 'Nosotros',
    
    // Hero
    'hero.title': 'Bogotá',
    'hero.subtitle': 'Un Viaje Local',
    'hero.description': 'Descubre el corazón auténtico de Colombia a través de los ojos de los locales. Desde joyas culinarias escondidas hasta calles históricas, vive Bogotá como nunca antes.',
    'hero.cta': 'Explorar el Mapa',
    'hero.secondary': 'Ver Experiencias',
    
    // Categories
    'category.gastronomy': 'Gastronomía',
    'category.gastronomy.desc': 'Saborea los ricos sabores de la cocina colombiana',
    'category.parks': 'Parques Urbanos',
    'category.parks.desc': 'Oasis verdes en el corazón de la ciudad',
    'category.museums': 'Museos',
    'category.museums.desc': 'Un viaje a través del arte, la historia y la cultura',
    'category.heritage': 'Patrimonio Histórico',
    'category.heritage.desc': 'Camina a través de siglos de historia',
    
    // Sub-categories
    'sub.markets': 'Mercados Locales',
    'sub.markets.desc': 'Sabores auténticos en Paloquemao y Plaza de la Perseverancia',
    'sub.dining': 'Alta Cocina',
    'sub.dining.desc': 'Restaurantes de clase mundial en Zona G y Usaquén',
    'sub.botanical': 'Jardín Botánico',
    'sub.botanical.desc': 'Descubre la flora nativa en el Jardín Botánico',
    'sub.simon': 'Parque Simón Bolívar',
    'sub.simon.desc': 'El corazón verde de Bogotá',
    'sub.gold': 'Museo del Oro',
    'sub.gold.desc': 'Tesoros precolombinos y arte indígena',
    'sub.botero': 'Museo Botero',
    'sub.botero.desc': 'Obras maestras del amado artista colombiano',
    'sub.candelaria': 'La Candelaria',
    'sub.candelaria.desc': 'Arquitectura colonial y arte callejero',
    'sub.monserrate': 'Monserrate',
    'sub.monserrate.desc': 'Montaña sagrada con vistas panorámicas',
    
    // Map
    'map.title': 'Explora Bogotá',
    'map.subtitle': 'Haz clic en los puntos de interés para descubrir más',
    'map.poi.candelaria': 'La Candelaria',
    'map.poi.monserrate': 'Monserrate',
    'map.poi.usaquen': 'Usaquén',
    'map.poi.chapinero': 'Chapinero',
    'map.poi.teusaquillo': 'Teusaquillo',
    'map.poi.zonarosa': 'Zona Rosa',
    
    // Footer
    'footer.tagline': 'Tu viaje por Bogotá comienza aquí',
    'footer.contact': 'Contacto',
    'footer.social': 'Síguenos',
    'footer.rights': 'Todos los derechos reservados',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
