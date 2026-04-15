"use client"

import { ReactNode } from 'react'
import { ExperienceCard } from './experience-card'

interface SubCategory {
  title: string
  description: string
  icon: ReactNode
}

interface CategorySectionProps {
  title: string
  description: string
  categoryColor: 'brick-red' | 'deep-green' | 'gold' | 'warm-brown'
  icon: ReactNode
  subCategories: SubCategory[]
  reversed?: boolean
}

export function CategorySection({
  title,
  description,
  categoryColor,
  icon,
  subCategories,
  reversed = false,
}: CategorySectionProps) {
  return (
    <div className={`grid md:grid-cols-2 gap-8 items-center ${reversed ? 'md:flex-row-reverse' : ''}`}>
      {/* Category Info */}
      <div className={`space-y-6 ${reversed ? 'md:order-2' : ''}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted shadow-lg">
          {icon}
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          {title}
        </h3>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
          {description}
        </p>
      </div>

      {/* Sub-category Cards */}
      <div className={`grid gap-4 ${reversed ? 'md:order-1' : ''}`}>
        {subCategories.map((sub, index) => (
          <ExperienceCard
            key={index}
            title={sub.title}
            description={sub.description}
            category={title}
            categoryColor={categoryColor}
            icon={sub.icon}
          />
        ))}
      </div>
    </div>
  )
}
