"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  MapPin,
  Camera,
  AlertTriangle,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Locate,
  X,
  Search,
  Stethoscope,
  Shield,
  Route,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface MapMarker {
  id: string
  type: "camera" | "accident" | "alert" | "hospital" | "police"
  name: string
  location: string
  status: "active" | "warning" | "critical" | "offline"
  x: number
  y: number
  details?: string
  confidence?: string
  timestamp?: string
}

const typeConfig = {
  camera: { icon: Camera, color: "bg-blue-500", label: "Camera", ringColor: "ring-blue-500/30" },
  accident: { icon: AlertTriangle, color: "bg-red-500", label: "Accident", ringColor: "ring-red-500/30" },
  alert: { icon: AlertTriangle, color: "bg-yellow-500", label: "Alert", ringColor: "ring-yellow-500/30" },
  hospital: { icon: Stethoscope, color: "bg-green-500", label: "Hospital", ringColor: "ring-green-500/30" },
  police: { icon: Shield, color: "bg-indigo-500", label: "Police", ringColor: "ring-indigo-500/30" },
}

const statusColors = {
  active: { bg: "bg-accent", ring: "ring-accent/30" },
  warning: { bg: "bg-yellow-500", ring: "ring-yellow-500/30" },
  critical: { bg: "bg-red-500", ring: "ring-red-500/30" },
  offline: { bg: "bg-gray-500", ring: "ring-gray-500/30" },
}

export function MapViewPage() {
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [zoom, setZoom] = useState(1)
  const [showCameras, setShowCameras] = useState(true)
  const [showAccidents, setShowAccidents] = useState(true)
  const [showAlerts, setShowAlerts] = useState(true)
  const [showHospitals, setShowHospitals] = useState(true)
  const [showPolice, setShowPolice] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showRoute, setShowRoute] = useState(false)

  useEffect(() => {
    const fetchMarkers = () => {
      fetch("http://127.0.0.1:5000/api/map-markers")
        .then((res) => res.json())
        .then((data) => {
          if (data.markers) setMarkers(data.markers)
        })
        .catch(console.error)
    }

    fetchMarkers()
    const interval = setInterval(fetchMarkers, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredMarkers = markers.filter((marker) => {
    if (marker.type === "camera" && !showCameras) return false
    if (marker.type === "accident" && !showAccidents) return false
    if (marker.type === "alert" && !showAlerts) return false
    if (marker.type === "hospital" && !showHospitals) return false
    if (marker.type === "police" && !showPolice) return false
    if (searchQuery && !marker.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !marker.location.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const stats = {
    cameras: markers.filter((m) => m.type === "camera").length,
    camerasOnline: markers.filter((m) => m.type === "camera" && m.status !== "offline").length,
    accidents: markers.filter((m) => m.type === "accident").length,
    hospitals: markers.filter((m) => m.type === "hospital").length,
    police: markers.filter((m) => m.type === "police").length,
  }

  // Find nearest emergency service to accident
  const getNearestEmergency = (accident: MapMarker) => {
    const emergencies = markers.filter(m => m.type === "hospital" || m.type === "police")
    let nearest = emergencies[0]
    let minDist = Infinity
    emergencies.forEach(e => {
      const dist = Math.sqrt(Math.pow(e.x - accident.x, 2) + Math.pow(e.y - accident.y, 2))
      if (dist < minDist) {
        minDist = dist
        nearest = e
      }
    })
    return nearest
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        <div className="glass-card rounded-xl p-3 lg:p-4">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Camera className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-lg lg:text-xl font-bold text-foreground">
                {stats.camerasOnline}/{stats.cameras}
              </p>
              <p className="text-xs text-muted-foreground truncate">Cameras Online</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-3 lg:p-4">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-lg lg:text-xl font-bold text-foreground">{stats.accidents}</p>
              <p className="text-xs text-muted-foreground truncate">Accidents</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-3 lg:p-4">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" />
            </div>
            <div className="min-w-0">
              <p className="text-lg lg:text-xl font-bold text-foreground">{stats.hospitals}</p>
              <p className="text-xs text-muted-foreground truncate">Hospitals</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-3 lg:p-4">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-500" />
            </div>
            <div className="min-w-0">
              <p className="text-lg lg:text-xl font-bold text-foreground">{stats.police}</p>
              <p className="text-xs text-muted-foreground truncate">Police Stations</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-3 lg:p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-4 h-4 lg:w-5 lg:h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-lg lg:text-xl font-bold text-foreground">24ms</p>
              <p className="text-xs text-muted-foreground truncate">Avg Latency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative" style={{ height: "calc(100vh - 340px)", minHeight: "400px" }}>
          {/* Map Background */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background transition-transform duration-300"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          >
            {/* Grid Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Road Network Simulation */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Main Roads */}
              <line x1="10%" y1="30%" x2="90%" y2="30%" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <line x1="10%" y1="70%" x2="90%" y2="70%" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <line x1="30%" y1="10%" x2="30%" y2="90%" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <line x1="55%" y1="10%" x2="55%" y2="90%" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <line x1="75%" y1="10%" x2="75%" y2="90%" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              {/* Highway */}
              <line x1="15%" y1="20%" x2="85%" y2="40%" stroke="rgba(0,210,211,0.2)" strokeWidth="8" strokeDasharray="20,10" />
              
              {/* Route line when showing route */}
              {showRoute && selectedMarker?.type === "accident" && (() => {
                const nearest = getNearestEmergency(selectedMarker)
                return (
                  <g>
                    <line 
                      x1={`${selectedMarker.x}%`} 
                      y1={`${selectedMarker.y}%`} 
                      x2={`${nearest.x}%`} 
                      y2={`${nearest.y}%`} 
                      stroke="rgba(74,222,128,0.8)" 
                      strokeWidth="4" 
                      strokeDasharray="10,5"
                      className="animate-pulse"
                    />
                    <circle cx={`${selectedMarker.x}%`} cy={`${selectedMarker.y}%`} r="6" fill="rgba(239,68,68,0.8)" />
                    <circle cx={`${nearest.x}%`} cy={`${nearest.y}%`} r="6" fill="rgba(74,222,128,0.8)" />
                  </g>
                )
              })()}
            </svg>

            {/* Markers */}
            {filteredMarkers.map((marker) => {
              const config = typeConfig[marker.type]
              const isSelected = selectedMarker?.id === marker.id
              const Icon = config.icon

              return (
                <button
                  key={marker.id}
                  onClick={() => {
                    setSelectedMarker(marker)
                    setShowRoute(false)
                  }}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                    "hover:scale-125 focus:outline-none z-10",
                    isSelected && "scale-125 z-20"
                  )}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                >
                  <div
                    className={cn(
                      "relative w-8 h-8 rounded-full flex items-center justify-center",
                      config.color,
                      "ring-4",
                      config.ringColor,
                      marker.status === "critical" && "animate-pulse"
                    )}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  {isSelected && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
                      <div className="glass-card rounded-lg px-3 py-1.5 text-xs font-medium">
                        {marker.name}
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className="absolute top-4 left-4 right-4 md:right-auto md:w-72 z-20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-border/50 bg-background/80"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="absolute top-16 right-4 flex flex-col gap-2 z-20">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
              className="glass bg-background/80"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
              className="glass bg-background/80"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline" className="glass bg-background/80">
              <Locate className="w-4 h-4" />
            </Button>
          </div>

          {/* Layer Controls */}
          <div className="absolute top-16 left-4 glass-card rounded-xl p-3 space-y-2 z-20 hidden md:block">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Layers</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCameras}
                onChange={(e) => setShowCameras(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-secondary accent-primary"
              />
              <Camera className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Cameras</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAccidents}
                onChange={(e) => setShowAccidents(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-secondary accent-primary"
              />
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Accidents</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAlerts}
                onChange={(e) => setShowAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-secondary accent-primary"
              />
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Alerts</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showHospitals}
                onChange={(e) => setShowHospitals(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-secondary accent-primary"
              />
              <Stethoscope className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Hospitals</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPolice}
                onChange={(e) => setShowPolice(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-secondary accent-primary"
              />
              <Shield className="w-4 h-4 text-indigo-500" />
              <span className="text-sm text-muted-foreground">Police</span>
            </label>
          </div>

          {/* Selected Marker Info Panel */}
          {selectedMarker && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-20">
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        `${typeConfig[selectedMarker.type].color}/20`
                      )}
                    >
                      {(() => {
                        const Icon = typeConfig[selectedMarker.type].icon
                        return <Icon className={cn("w-5 h-5", typeConfig[selectedMarker.type].color.replace("bg-", "text-"))} />
                      })()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {selectedMarker.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {selectedMarker.location}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedMarker(null)
                      setShowRoute(false)
                    }}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <Badge
                      className={cn(
                        "text-xs capitalize",
                        typeConfig[selectedMarker.type].color,
                        "text-white"
                      )}
                    >
                      {typeConfig[selectedMarker.type].label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      className={cn(
                        "text-xs capitalize",
                        statusColors[selectedMarker.status].bg,
                        "text-white"
                      )}
                    >
                      {selectedMarker.status}
                    </Badge>
                  </div>
                  {selectedMarker.details && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Details</span>
                      <span className="text-foreground">{selectedMarker.details}</span>
                    </div>
                  )}
                  {selectedMarker.confidence && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="text-accent font-medium">{selectedMarker.confidence}</span>
                    </div>
                  )}
                  {selectedMarker.timestamp && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Detected</span>
                      <span className="text-foreground">{selectedMarker.timestamp}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1 bg-primary text-primary-foreground">
                    <Info className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  {selectedMarker.type === "accident" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={cn("flex-1", showRoute && "bg-accent/20 text-accent border-accent/30")}
                      onClick={() => setShowRoute(!showRoute)}
                    >
                      <Route className="w-4 h-4 mr-1" />
                      Route
                    </Button>
                  )}
                  {selectedMarker.type === "camera" && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Camera className="w-4 h-4 mr-1" />
                      Live Feed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-card rounded-xl p-3 hidden lg:block z-10">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">Legend</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Camera</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-muted-foreground">Accident</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">Alert</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-muted-foreground">Police</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-muted-foreground">Offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
