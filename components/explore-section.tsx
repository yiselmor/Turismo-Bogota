"use client"

import { useState } from 'react'
import { useLanguage } from '@/context/language-context'
import {
  UtensilsCrossed, ShoppingBasket, ChefHat,
  Trees, Flower2, TreePine,
  Building2, Gem, Palette,
  Landmark, Church, Mountain,
  X, MapPin, Navigation, Search
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ExploreSection() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(0)
  const [mapUrl, setMapUrl] = useState<string | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<string>("")

  const openMap = (placeName: string) => {
    setSelectedPlace(placeName);
    const query = encodeURIComponent(`${placeName} Bogota Colombia`);

    // URL Optimizada: 'output=embed' es clave para que se mantenga en el sitio.
    // Usamos 'q=' para búsqueda general y 'iwloc=near' para evitar saltos.
    const fallbackUrl = `https://www.google.com/maps?q=${query}&output=embed&z=14&iwloc=near`;

    setMapUrl(fallbackUrl);
  }

  const categories = [
    {
      title: t('category.gastronomy'),
      description: t('category.gastronomy.desc'),
      color: 'bg-brick-red',
      image: "https://images.unsplash.com/photo-1688723062405-ca0e17562820?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEdBU1RST05PTVl8ZW58MHx8MHx8fDA%3D",
      subCategories: [
        { title: "Plazas de Mercado", icon: <ShoppingBasket className="w-5 h-5" /> },
        { title: "Mejores Restaurantes", icon: <ChefHat className="w-5 h-5" /> },
      ],
    },
    {
      title: t('category.parks'),
      description: t('category.parks.desc'),
      color: 'bg-deep-green',
      image: "https://images.unsplash.com/photo-1687951367359-6c269e75c77f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      subCategories: [
        { title: "Parques con senderos", icon: <TreePine className="w-5 h-5" /> },
        { title: "Jardines y Flores", icon: <Flower2 className="w-5 h-5" /> },
      ],
    },
    {
      title: t('category.museums'),
      description: t('category.museums.desc'),
      color: 'bg-gold',
      image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      subCategories: [
        { title: "Museos de Arte", icon: <Palette className="w-5 h-5" /> },
        { title: "Museo del Oro", icon: <Gem className="w-5 h-5" /> },
      ],
    },
    {
      title: t('category.heritage'),
      description: t('category.heritage.desc'),
      color: 'bg-warm-brown',
      image: "https://images.unsplash.com/photo-1773859891703-bbfb32dc3827?q=80&w=789&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      subCategories: [
        { title: "Sitios Históricos", icon: <Landmark className="w-5 h-5" /> },
        { title: "Miradores Bogota", icon: <Mountain className="w-5 h-5" /> },
      ],
    },
  ]

  return (
    <section id="explore" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brick-red/10 text-brick-red text-sm font-medium mb-4 uppercase tracking-widest">
            {t('nav.explore')}
          </span>
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-[1.1]">
            {t('hero.subtitle')}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row h-[600px] lg:h-[500px] gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveTab(index)}
              className={cn(
                "relative overflow-hidden rounded-[2.5rem] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group",
                activeTab === index ? "flex-[5]" : "flex-1"
              )}
            >
              <div className="absolute inset-0">
                <img src={category.image} alt={category.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                <div className={cn("absolute inset-0 transition-opacity duration-700", activeTab === index ? "bg-black/60" : "bg-black/40")} />
              </div>

              <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                <div className="flex items-center gap-4">
                  <div className={cn("p-4 rounded-2xl backdrop-blur-xl border border-white/20", activeTab === index ? category.color : "bg-white/10")}>
                    {category.icon}
                  </div>
                  <h3 className={cn("font-serif font-bold text-2xl transition-all duration-500", activeTab === index ? "opacity-100" : "lg:opacity-0")}>
                    {category.title}
                  </h3>
                </div>

                <div className={cn("transition-all duration-700", activeTab === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 h-0 lg:h-auto")}>
                  <p className="text-white/80 text-lg mb-8 max-w-md leading-relaxed">{category.description}</p>

                  <div className="flex flex-wrap gap-3">
                    {category.subCategories.map((sub, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          openMap(sub.title);
                        }}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all font-medium"
                      >
                        <Search className="w-4 h-4" />
                        <span className="text-sm">{sub.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DEL MAPA INMERSIVO */}
      {mapUrl && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-10 animate-in fade-in zoom-in duration-300">
          <div className="relative bg-background w-full h-full md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col border border-white/10">

            {/* Cabecera del Mapa */}
            <div className="flex items-center justify-between p-6 bg-card/50 backdrop-blur-md border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="bg-brick-red p-3 rounded-2xl text-white shadow-xl shadow-brick-red/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-bold">{selectedPlace}</h3>
                  <div className="flex items-center gap-2 text-xs text-brick-red font-bold uppercase tracking-widest mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brick-red opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brick-red"></span>
                    </span>
                    Explorando Bogotá en tiempo real
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMapUrl(null)}
                className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all active:scale-90"
              >
                <X className="w-8 h-8 text-white" />
              </button>
            </div>

            {/* CONTENEDOR DEL MAPA FULL NAVIGABLE */}
            <div className="flex-1 relative">
              <iframe
                src={mapUrl}
                className="absolute inset-0 w-full h-full border-none"
                allowFullScreen
                loading="lazy"
                title="Google Maps Inmersivo"
              />
            </div>

            {/* Footer Informativo */}
            <div className="p-6 bg-card border-t border-white/5 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Navigation className="w-4 h-4" />
                Puedes buscar rutas y ver fotos dentro del mapa.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}