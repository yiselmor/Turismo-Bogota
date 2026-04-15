"use client"

import { useLanguage } from '@/context/language-context'
import { MapPin, Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-gold" />
              <span className="font-serif text-2xl font-bold">Bogotá</span>
            </div>
            <p className="text-background/70 leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:info@bogotalocaljourney.com" className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors">
                  <Mail className="w-4 h-4" />
                  info@bogotalocaljourney.com
                </a>
              </li>
              <li>
                <a href="tel:+571234567890" className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors">
                  <Phone className="w-4 h-4" />
                  +57 1 234 567 890
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">{t('footer.social')}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-gold hover:text-foreground flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-gold hover:text-foreground flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-gold hover:text-foreground flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-background/20" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <p>© 2026 Bogotá: A Local Journey. {t('footer.rights')}.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-brick-red">♥</span> in Colombia
          </p>
        </div>
      </div>
    </footer>
  )
}
