"use client"

import { useLanguage } from '@/context/language-context'
import { ExperienceCard } from './experience-card'
import { Camera, Coffee, Bike, Music } from 'lucide-react'

export function ExperiencesSection() {
  const { t } = useLanguage()

  // Definición enriquecida de las experiencias
  const experiences = [
    {
      title: "Cata de Café en La Candelaria",
      description: "Descubre los secretos del mejor café colombiano en el corazón histórico.",
      category: "Gastronomía",
      categoryColor: 'brick-red' as const,
      icon: <Coffee className="w-8 h-8 text-brick-red" />,
      externalUrl: "https://tenemosfilo.com/listing/cata-de-cafe-en-la-candelaria/",
      // NUEVOS CAMPOS PARA EL MODAL
      imageUrl: "https://images.unsplash.com/photo-1649056992168-518d921ea73a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Foto de café
      introText: "Sumérgete en una experiencia sensorial única. Aprenderás a diferenciar aromas, sabores y texturas de diferentes variedades de café cultivadas en las regiones más cafeteras de Colombia, guiado por un barista experto en una casa colonial de La Candelaria.",
      buttonText: "Reservar mi Cata"
    },
    {
      title: "Ciclovía Dominical",
      description: "Recorre Bogotá sin afán. Consulta el mapa oficial de rutas y puntos.",
      category: "Deporte",
      categoryColor: 'deep-green' as const,
      icon: <Bike className="w-8 h-8 text-deep-green" />,
      externalUrl: "https://www.idrd.gov.co/ciclovia_old/mapa-de-la-ciclovia",
      // NUEVOS CAMPOS PARA EL MODAL
      imageUrl: "https://images.unsplash.com/photo-1595392312394-0a1d14c9dadb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Foto de ciclistas
      introText: "Cada domingo y festivo, las principales avenidas de Bogotá se cierran para los autos y se abren para las personas. Únete a miles de bogotanos para correr, patinar, montar en bici o simplemente pasear. Un evento icónico de la cultura 'rola'.",
      buttonText: "Ver Mapa de Rutas"
    },
    {
      title: "Noche de Salsa en Galerías",
      description: "Vive la leyenda de Galería Café Libro, el lugar emblemático de la salsa.",
      category: "Cultura",
      categoryColor: 'gold' as const,
      icon: <Music className="w-8 h-8 text-gold" />,
      externalUrl: "https://www.galeriacafelibro.com.co/",
      // NUEVOS CAMPOS PARA EL MODAL
      imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop", // Foto de club nocturno
      introText: "Si quieres sentir el verdadero pulso de la noche bogotana, tienes que bailar salsa. Galería Café Libro no es solo un bar, es una institución cultural donde la música en vivo, los bailarines expertos y la energía vibrante te garantizan una noche inolvidable.",
      buttonText: "Ver Programación"
    },
    {
      title: "Miradores de La Calera",
      description: "La mejor vista panorámica de la ciudad. Haz clic para ver la ruta exacta.",
      category: "Aventura",
      categoryColor: 'warm-brown' as const,
      icon: <Camera className="w-8 h-8 text-warm-brown" />,
      externalUrl: "https://www.google.com/maps/dir/?api=1&destination=Mirador+La+Paloma+La+Calera", // URL de Google Maps
      // NUEVOS CAMPOS PARA EL MODAL
      imageUrl: "https://images.unsplash.com/photo-1622433595283-e5912e217786?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Foto de Monserrate/Vista nocturna
      introText: "Asciende por los cerros orientales para obtener una vista impresionante de la inmensidad de Bogotá. Ideal para ir al atardecer o en la noche para ver la ciudad iluminada. En la ruta encontrarás restaurantes y miradores para disfrutar el paisaje.",
      buttonText: "Cómo llegar con Maps"
    }
  ]

  return (
    <section id="experiences" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold mb-4">Experiencias Imperdibles</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre actividades locales seleccionadas para vivir Bogotá como un local. Haz clic en una tarjeta para saber más.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={index}
              {...exp} // Pasamos todas las nuevas props automáticamente
            />
          ))}
        </div>
      </div>
    </section>
  )
}