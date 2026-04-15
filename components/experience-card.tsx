"use client"

import { ReactNode, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, ExternalLink, MapPin } from 'lucide-react'

interface ExperienceCardProps {
  title: string
  description: string
  category: string
  categoryColor: 'brick-red' | 'deep-green' | 'gold' | 'warm-brown'
  icon: ReactNode
  externalUrl?: string
  imageUrl?: string
  introText?: string
  buttonText?: string
}

const colorClasses = {
  'brick-red': 'bg-brick-red/10 text-brick-red border-brick-red/20',
  'deep-green': 'bg-deep-green/10 text-deep-green border-deep-green/20',
  'gold': 'bg-gold/20 text-warm-brown border-gold/30',
  'warm-brown': 'bg-warm-brown/10 text-warm-brown border-warm-brown/20',
}

const bgColorClasses = {
  'brick-red': 'from-brick-red/20 to-brick-red/5',
  'deep-green': 'from-deep-green/20 to-deep-green/5',
  'gold': 'from-gold/30 to-gold/10',
  'warm-brown': 'from-warm-brown/20 to-warm-brown/5',
}

export function ExperienceCard({
  title,
  description,
  category,
  categoryColor,
  icon,
  externalUrl,
  imageUrl = "https://images.unsplash.com/photo-1518173946687-a4c8030230bb?q=80&w=800&auto=format&fit=crop",
  introText = "Aquí iría una descripción introductoria detallada de la experiencia.",
  buttonText = "Visitar sitio oficial"
}: ExperienceCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card
        onClick={() => setIsOpen(true)}
        className="group overflow-hidden border-border/50 hover:border-brick-red/30 transition-all duration-300 hover:shadow-lg hover:shadow-brick-red/10 cursor-pointer h-full"
      >
        <div className={`relative h-48 bg-gradient-to-br ${bgColorClasses[categoryColor]} overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          <Badge variant="outline" className={`${colorClasses[categoryColor]} mb-3 font-medium`}>
            {category}
          </Badge>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-brick-red transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-background w-full max-w-5xl md:h-[70vh] rounded-3xl overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Columna Izquierda: Imagen */}
            <div className="relative md:w-1/2 h-56 md:h-full overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 md:p-8">
                <Badge variant="secondary" className={`${colorClasses[categoryColor]} text-sm flex items-center gap-1.5 px-3 py-1 font-medium`}>
                  {icon}
                  {category}
                </Badge>
              </div>
              <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-4 right-4 p-2 bg-black/50 text-white hover:bg-black/70 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Columna Derecha: Contenido */}
            <div className="flex-1 p-6 md:p-10 flex flex-col">
              <button onClick={() => setIsOpen(false)} className="hidden md:block absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  {title}
                </h3>
                <div className="w-20 h-1.5 bg-brick-red rounded-full mb-8"></div>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {introText}
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-border">
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full md:w-auto items-center justify-center gap-2.5 bg-brick-red text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-brick-red/90 transition-all shadow-lg hover:shadow-brick-red/20 active:scale-[0.98]"
                >
                  {categoryColor === 'warm-brown' ? <MapPin className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                  {buttonText}
                </a>
                <p className='text-xs text-muted-foreground mt-3 text-center md:text-left'>
                  Haz clic para abrir el sitio oficial en una pestaña nueva.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}