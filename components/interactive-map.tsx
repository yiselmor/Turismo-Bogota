"use client"

import { useState, useCallback, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/language-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Mountain, 
  Church, 
  ShoppingBag, 
  Music2, 
  Building, 
  Wine,
  X,
  Navigation,
  Clock,
  Route,
  Locate,
  Car,
  Footprints,
  Bus,
  Eye,
  Map,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

interface PointOfInterest {
  id: string
  nameKey: string
  x: number
  y: number
  lat: number
  lng: number
  icon: React.ReactNode
  color: string
  description: string
  descriptionEs: string
}

const pointsOfInterest: PointOfInterest[] = [
  {
    id: 'candelaria',
    nameKey: 'map.poi.candelaria',
    x: 45,
    y: 55,
    lat: 4.5970,
    lng: -74.0728,
    icon: <Church className="w-4 h-4" />,
    color: 'bg-brick-red',
    description: 'Historic colonial district with colorful streets and vibrant street art',
    descriptionEs: 'Distrito colonial histórico con calles coloridas y vibrante arte callejero',
  },
  {
    id: 'monserrate',
    nameKey: 'map.poi.monserrate',
    x: 60,
    y: 35,
    lat: 4.6058,
    lng: -74.0556,
    icon: <Mountain className="w-4 h-4" />,
    color: 'bg-deep-green',
    description: 'Sacred mountain offering panoramic views of the city at 3,152m',
    descriptionEs: 'Montaña sagrada que ofrece vistas panorámicas de la ciudad a 3,152m',
  },
  {
    id: 'usaquen',
    nameKey: 'map.poi.usaquen',
    x: 55,
    y: 20,
    lat: 4.6947,
    lng: -74.0302,
    icon: <ShoppingBag className="w-4 h-4" />,
    color: 'bg-gold',
    description: 'Charming neighborhood with boutiques, cafes and weekend flea market',
    descriptionEs: 'Encantador barrio con boutiques, cafés y mercado de pulgas los fines de semana',
  },
  {
    id: 'chapinero',
    nameKey: 'map.poi.chapinero',
    x: 48,
    y: 40,
    lat: 4.6483,
    lng: -74.0632,
    icon: <Music2 className="w-4 h-4" />,
    color: 'bg-brick-red',
    description: 'Bohemian district known for nightlife, gastronomy and LGBTQ+ culture',
    descriptionEs: 'Distrito bohemio conocido por su vida nocturna, gastronomía y cultura LGBTQ+',
  },
  {
    id: 'teusaquillo',
    nameKey: 'map.poi.teusaquillo',
    x: 35,
    y: 48,
    lat: 4.6344,
    lng: -74.0836,
    icon: <Building className="w-4 h-4" />,
    color: 'bg-warm-brown',
    description: 'Residential area with beautiful English-style architecture from the 1930s',
    descriptionEs: 'Zona residencial con hermosa arquitectura estilo inglés de los años 1930',
  },
  {
    id: 'zonarosa',
    nameKey: 'map.poi.zonarosa',
    x: 42,
    y: 30,
    lat: 4.6667,
    lng: -74.0524,
    icon: <Wine className="w-4 h-4" />,
    color: 'bg-deep-green',
    description: 'Upscale entertainment zone with fine dining and premium shopping',
    descriptionEs: 'Zona de entretenimiento exclusiva con restaurantes finos y tiendas premium',
  },
]

type TravelMode = 'DRIVING' | 'WALKING' | 'TRANSIT'

export function InteractiveMap() {
  const { t, language } = useLanguage()
  const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null)
  const [showMapModal, setShowMapModal] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [travelMode, setTravelMode] = useState<TravelMode>('DRIVING')
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [directionsError, setDirectionsError] = useState<string | null>(null)
  const [routeSteps, setRouteSteps] = useState<Array<{
    instructions: string;
    distance: { text: string };
    duration: { text: string };
  }>>([])
  const [showStreetView, setShowStreetView] = useState(false)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const streetViewRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const routePolylineRef = useRef<google.maps.Polyline | null>(null)

  const loadGoogleMapsScript = useCallback(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry&loading=async&callback=initMap`
      script.async = true
      script.defer = true
      
      // Define global callback
      ;(window as Window & { initMap?: () => void }).initMap = () => {
        setMapLoaded(true)
      }
      
      script.onerror = () => {
        setApiError(language === 'es' 
          ? 'Error al cargar Google Maps. Verifica que las APIs estén activadas en Google Cloud Console.' 
          : 'Error loading Google Maps. Please ensure the APIs are enabled in Google Cloud Console.')
      }
      
      document.head.appendChild(script)
    } else if (window.google) {
      setMapLoaded(true)
    }
  }, [language])

  const getUserLocation = useCallback(() => {
    setGettingLocation(true)
    setLocationError(null)
    
    if (!navigator.geolocation) {
      setLocationError(language === 'es' 
        ? 'Tu navegador no soporta geolocalización' 
        : 'Your browser does not support geolocation')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setGettingLocation(false)
      },
      (error) => {
        let errorMsg = ''
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = language === 'es' 
              ? 'Permiso de ubicación denegado' 
              : 'Location permission denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = language === 'es' 
              ? 'Ubicación no disponible' 
              : 'Location unavailable'
            break
          case error.TIMEOUT:
            errorMsg = language === 'es' 
              ? 'Tiempo de espera agotado' 
              : 'Location request timed out'
            break
          default:
            errorMsg = language === 'es' 
              ? 'Error al obtener ubicación' 
              : 'Error getting location'
        }
        setLocationError(errorMsg)
        setGettingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [language])

  useEffect(() => {
    if (showMapModal && selectedPOI) {
      loadGoogleMapsScript()
      getUserLocation()
    }
  }, [showMapModal, selectedPOI, loadGoogleMapsScript, getUserLocation])

  const calculateRoute = useCallback(async () => {
    if (!mapLoaded || !selectedPOI || !userLocation || !googleMapRef.current) return

    setLoadingRoute(true)
    setDirectionsError(null)
    
    // Clear previous route
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null)
      routePolylineRef.current = null
    }

    const travelModeMap: Record<TravelMode, string> = {
      DRIVING: 'DRIVE',
      WALKING: 'WALK',
      TRANSIT: 'TRANSIT'
    }

    try {
      const response = await fetch('/api/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: userLocation,
          destination: { lat: selectedPOI.lat, lng: selectedPOI.lng },
          travelMode: travelModeMap[travelMode]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get directions')
      }

      setLoadingRoute(false)

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        
        // Draw route on map
        if (route.polyline?.encodedPolyline) {
          const path = google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline)
          
          routePolylineRef.current = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#8B4513',
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: googleMapRef.current
          })
          
          // Fit map to route bounds
          const bounds = new google.maps.LatLngBounds()
          path.forEach(point => bounds.extend(point))
          googleMapRef.current?.fitBounds(bounds, 50)
        }

        // Extract route info
        if (route.distanceMeters && route.duration) {
          const distanceKm = (route.distanceMeters / 1000).toFixed(1)
          const durationSeconds = parseInt(route.duration.replace('s', ''))
          const durationMins = Math.round(durationSeconds / 60)
          
          setRouteInfo({
            distance: `${distanceKm} km`,
            duration: durationMins < 60 
              ? `${durationMins} min` 
              : `${Math.floor(durationMins / 60)} h ${durationMins % 60} min`
          })
        }

        // Extract steps for turn-by-turn directions
        if (route.legs && route.legs[0]?.steps) {
          const steps = route.legs[0].steps.map((step: {
            navigationInstruction?: { instructions?: string };
            distanceMeters?: number;
            staticDuration?: string;
          }) => ({
            instructions: step.navigationInstruction?.instructions || '',
            distance: { text: step.distanceMeters ? `${Math.round(step.distanceMeters)} m` : '' },
            duration: { text: step.staticDuration ? `${Math.round(parseInt(step.staticDuration.replace('s', '')) / 60)} min` : '' }
          }))
          setRouteSteps(steps)
        }
      } else {
        setRouteInfo(null)
        setRouteSteps([])
      }
    } catch (error) {
      setLoadingRoute(false)
      const errorMessage = error instanceof Error ? error.message : ''
      console.error('Route calculation error:', error)
      
      if (errorMessage.includes('recently') || errorMessage.includes('propagate') || errorMessage.includes('wait a few minutes')) {
        setDirectionsError(language === 'es' 
          ? 'La Routes API se acaba de habilitar. Espera 2-3 minutos y recarga la página.' 
          : 'Routes API was recently enabled. Wait 2-3 minutes and reload the page.')
      } else {
        setDirectionsError(language === 'es' 
          ? 'Error al calcular la ruta. Verifica que "Routes API" esté habilitada en Google Cloud Console.' 
          : 'Error calculating route. Please ensure "Routes API" is enabled in Google Cloud Console.')
      }
      setRouteInfo(null)
      setRouteSteps([])
    }
  }, [mapLoaded, selectedPOI, userLocation, travelMode, language])

  useEffect(() => {
    if (mapLoaded && showMapModal && selectedPOI && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: selectedPOI.lat, lng: selectedPOI.lng },
        zoom: 15,
        mapTypeId: 'roadmap',
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      })

      googleMapRef.current = map

      // Add destination marker
      new google.maps.Marker({
        position: { lat: selectedPOI.lat, lng: selectedPOI.lng },
        map: map,
        title: t(selectedPOI.nameKey),
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      })

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${t(selectedPOI.nameKey)}</h3>
            <p style="font-size: 12px; color: #666;">${language === 'es' ? selectedPOI.descriptionEs : selectedPOI.description}</p>
          </div>
        `
      })

      const marker = new google.maps.Marker({
        position: { lat: selectedPOI.lat, lng: selectedPOI.lng },
        map: map,
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      // Auto open info window
      infoWindow.open(map, marker)
    }
  }, [mapLoaded, showMapModal, selectedPOI, t, language])

  useEffect(() => {
    if (userLocation && mapLoaded && googleMapRef.current) {
      calculateRoute()
    }
  }, [userLocation, travelMode, calculateRoute, mapLoaded])

  const handlePOIClick = (poi: PointOfInterest) => {
    setSelectedPOI(poi)
    setShowMapModal(true)
    setRouteInfo(null)
  }

  const closeModal = () => {
    setShowMapModal(false)
    setSelectedPOI(null)
    setRouteInfo(null)
    setRouteSteps([])
    setUserLocation(null)
    setShowStreetView(false)
    setDirectionsError(null)
    googleMapRef.current = null
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null)
      routePolylineRef.current = null
    }
  }

  // Initialize Street View when toggle is enabled
  useEffect(() => {
    if (showStreetView && streetViewRef.current && selectedPOI && mapLoaded) {
      new google.maps.StreetViewPanorama(streetViewRef.current, {
        position: { lat: selectedPOI.lat, lng: selectedPOI.lng },
        pov: { heading: 165, pitch: 0 },
        zoom: 1,
        addressControl: true,
        fullscreenControl: true,
        motionTracking: false,
        motionTrackingControl: false,
      })
    }
  }, [showStreetView, selectedPOI, mapLoaded])

  const travelModeButtons = [
    { mode: 'DRIVING' as TravelMode, icon: Car, label: language === 'es' ? 'Auto' : 'Drive' },
    { mode: 'WALKING' as TravelMode, icon: Footprints, label: language === 'es' ? 'Caminar' : 'Walk' },
    { mode: 'TRANSIT' as TravelMode, icon: Bus, label: language === 'es' ? 'Transporte' : 'Transit' }
  ]

  return (
    <section id="map" className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-deep-green/10 text-deep-green text-sm font-medium mb-4">
            <MapPin className="w-4 h-4 inline mr-1" />
            {t('nav.map')}
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t('map.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('map.subtitle')}
          </p>
        </div>

        {/* Map Container */}
        <div className="relative">
          <Card className="overflow-hidden border-2 border-border">
            <CardContent className="p-0">
              {/* Map Placeholder */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-deep-green/20 via-cream to-gold/20 overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Decorative Mountains */}
                <div className="absolute bottom-0 right-0 w-1/3 h-1/4 opacity-20">
                  <svg viewBox="0 0 200 100" className="w-full h-full text-deep-green">
                    <path d="M0 100 L50 30 L80 60 L120 20 L160 50 L200 10 L200 100 Z" fill="currentColor" />
                  </svg>
                </div>

                {/* Map Title Overlay */}
                <div className="absolute top-4 left-4 px-4 py-2 bg-background/80 backdrop-blur rounded-lg border border-border">
                  <p className="font-serif text-lg font-semibold text-foreground">Bogotá, Colombia</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'es' ? 'Haz clic en un punto para ver cómo llegar' : 'Click a point to see directions'}
                  </p>
                </div>

                {/* Points of Interest */}
                {pointsOfInterest.map((poi) => (
                  <button
                    key={poi.id}
                    onClick={() => handlePOIClick(poi)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer`}
                    style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
                  >
                    {/* Pulse Animation */}
                    <span className={`absolute inset-0 ${poi.color} rounded-full animate-ping opacity-30`} />
                    
                    {/* Main Pin */}
                    <span className={`relative flex items-center justify-center w-10 h-10 ${poi.color} rounded-full shadow-lg text-primary-foreground transition-all group-hover:scale-110`}>
                      {poi.icon}
                    </span>

                    {/* Hover Label */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                      {t(poi.nameKey)}
                    </span>
                  </button>
                ))}

                {/* Compass */}
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-background/80 backdrop-blur rounded-full border border-border flex items-center justify-center">
                  <div className="relative w-8 h-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-brick-red">N</span>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-brick-red to-foreground/30 rounded-full" />
                  </div>
                </div>

                {/* Scale Bar */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-20 h-1 bg-foreground/30 rounded-full" />
                  <span className="text-xs text-muted-foreground">5 km</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {pointsOfInterest.map((poi) => (
            <button
              key={poi.id}
              onClick={() => handlePOIClick(poi)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border bg-background border-border hover:border-brick-red/50 transition-all cursor-pointer"
            >
              <span className={`w-3 h-3 ${poi.color} rounded-full`} />
              <span className="text-sm font-medium">{t(poi.nameKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Google Maps Modal with Directions */}
      {showMapModal && selectedPOI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl h-[85vh] bg-background rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col lg:flex-row">
            {/* Sidebar - Info & Controls */}
            <div className="w-full lg:w-80 p-6 border-b lg:border-b-0 lg:border-r border-border flex flex-col gap-4 shrink-0 overflow-y-auto max-h-[40vh] lg:max-h-full">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${selectedPOI.color} rounded-full flex items-center justify-center text-primary-foreground`}>
                    {selectedPOI.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      {t(selectedPOI.nameKey)}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-muted rounded-full transition-colors lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {language === 'es' ? selectedPOI.descriptionEs : selectedPOI.description}
              </p>

              {/* Travel Mode Selector */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {language === 'es' ? 'Modo de viaje' : 'Travel mode'}
                </p>
                <div className="flex gap-2">
                  {travelModeButtons.map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setTravelMode(mode)}
                      className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                        travelMode === mode 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-background border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Route Info */}
              {routeInfo && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-foreground">
                    <Route className="w-4 h-4 text-primary" />
                    <span className="font-medium">{routeInfo.distance}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">{routeInfo.duration}</span>
                  </div>
                </div>
              )}

              {loadingRoute && (
                <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    {language === 'es' ? 'Calculando ruta...' : 'Calculating route...'}
                  </span>
                </div>
              )}

              {/* Location Status */}
              {gettingLocation && (
                <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
                  <Locate className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    {language === 'es' ? 'Obteniendo tu ubicación...' : 'Getting your location...'}
                  </span>
                </div>
              )}

              {locationError && (
                <div className="p-4 bg-destructive/10 rounded-lg space-y-2">
                  <p className="text-sm text-destructive">{locationError}</p>
                  <Button onClick={getUserLocation} variant="outline" size="sm" className="w-full">
                    <Locate className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Reintentar' : 'Retry'}
                  </Button>
                </div>
              )}

              {directionsError && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-2">
                  <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                    {language === 'es' ? 'Direcciones no disponibles' : 'Directions unavailable'}
                  </p>
                  <p className="text-xs text-muted-foreground">{directionsError}</p>
                  <a 
                    href="https://console.cloud.google.com/apis/library/routes.googleapis.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    {language === 'es' ? 'Habilitar Routes API' : 'Enable Routes API'}
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              )}

              {!userLocation && !gettingLocation && !locationError && (
                <Button onClick={getUserLocation} variant="outline" className="w-full">
                  <Locate className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Obtener mi ubicación' : 'Get my location'}
                </Button>
              )}

              {/* View Toggle */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowStreetView(false)} 
                  variant={!showStreetView ? "default" : "outline"}
                  className="flex-1"
                  size="sm"
                >
                  <Map className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Mapa' : 'Map'}
                </Button>
                <Button 
                  onClick={() => setShowStreetView(true)} 
                  variant={showStreetView ? "default" : "outline"}
                  className="flex-1"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Vista 3D' : '3D View'}
                </Button>
              </div>

              {/* Step by Step Directions */}
              {routeSteps.length > 0 && !showStreetView && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    {language === 'es' ? 'Instrucciones' : 'Directions'}
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {routeSteps.map((step, index) => (
                      <div 
                        key={index} 
                        className="flex gap-3 p-2 bg-muted rounded-lg text-xs"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div 
                            className="text-foreground [&_b]:font-semibold"
                            dangerouslySetInnerHTML={{ __html: step.instructions }}
                          />
                          <span className="text-muted-foreground mt-1 block">
                            {step.distance?.text} · {step.duration?.text}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3 p-2 bg-primary/10 rounded-lg text-xs">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                        <span className="text-foreground font-medium">
                          {language === 'es' ? 'Llegaste a ' : 'Arrive at '}
                          {t(selectedPOI.nameKey)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Close button for desktop */}
              <button
                onClick={closeModal}
                className="hidden lg:flex items-center justify-center gap-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">{language === 'es' ? 'Cerrar' : 'Close'}</span>
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative min-h-[45vh] lg:min-h-0">
              {/* Regular Map View */}
              <div ref={mapRef} className={`w-full h-full ${showStreetView ? 'hidden' : 'block'}`}>
                {!mapLoaded && !apiError && (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {language === 'es' ? 'Cargando mapa...' : 'Loading map...'}
                      </p>
                    </div>
                  </div>
                )}
                {apiError && (
                  <div className="w-full h-full flex items-center justify-center bg-muted p-8">
                    <div className="text-center max-w-md">
                      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-destructive" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {language === 'es' ? 'API no activada' : 'API Not Activated'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">{apiError}</p>
                      <div className="text-xs text-muted-foreground bg-background p-3 rounded-lg text-left space-y-1">
                        <p className="font-medium">{language === 'es' ? 'Pasos para activar:' : 'Steps to activate:'}</p>
                        <p>1. {language === 'es' ? 'Ve a Google Cloud Console' : 'Go to Google Cloud Console'}</p>
                        <p>2. {language === 'es' ? 'Habilita "Maps JavaScript API"' : 'Enable "Maps JavaScript API"'}</p>
                        <p>3. {language === 'es' ? 'Habilita "Directions API"' : 'Enable "Directions API"'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Street View */}
              <div 
                ref={streetViewRef} 
                className={`w-full h-full ${showStreetView ? 'block' : 'hidden'}`}
              >
                {showStreetView && !mapLoaded && (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {language === 'es' ? 'Cargando vista 3D...' : 'Loading 3D view...'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
