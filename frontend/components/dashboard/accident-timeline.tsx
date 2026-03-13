"use client"

import { Clock, MapPin, Camera, Percent, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const incidents = [
  {
    id: 1,
    type: "Multi-Vehicle Collision",
    severity: "critical",
    camera: "CAM-001",
    location: "Highway I-95 North",
    timestamp: "14:32:18",
    confidence: 98.5,
  },
  {
    id: 2,
    type: "Vehicle Rollover",
    severity: "high",
    camera: "CAM-004",
    location: "Airport Terminal",
    timestamp: "14:24:45",
    confidence: 94.2,
  },
  {
    id: 3,
    type: "Rear-End Collision",
    severity: "medium",
    camera: "CAM-002",
    location: "Main Street",
    timestamp: "14:17:03",
    confidence: 89.7,
  },
  {
    id: 4,
    type: "Side Impact",
    severity: "medium",
    camera: "CAM-003",
    location: "Industrial Zone",
    timestamp: "13:58:22",
    confidence: 91.3,
  },
  {
    id: 5,
    type: "Vehicle Fire",
    severity: "critical",
    camera: "CAM-001",
    location: "Highway I-95 South",
    timestamp: "13:45:11",
    confidence: 99.1,
  },
]

const severityColors = {
  critical: {
    dot: "bg-destructive",
    badge: "bg-destructive/20 text-destructive border-destructive/30",
  },
  high: {
    dot: "bg-amber-500",
    badge: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  },
  medium: {
    dot: "bg-yellow-500",
    badge: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  },
}

export function AccidentTimeline() {
  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10 border border-accent/30 glow-green">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Detection Feed</h3>
            <p className="text-xs text-muted-foreground">Real-time incident log</p>
          </div>
        </div>
        <Badge variant="outline" className="border-accent/30 text-accent text-xs">
          LIVE
        </Badge>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto space-y-1">
        {incidents.map((incident, index) => {
          const colors = severityColors[incident.severity as keyof typeof severityColors]

          return (
            <div
              key={incident.id}
              className={cn(
                "relative pl-6 pb-4 group cursor-pointer",
                "hover:bg-secondary/30 rounded-lg transition-colors -ml-2 px-4 py-2"
              )}
            >
              {/* Timeline Line */}
              {index < incidents.length - 1 && (
                <div className="absolute left-[9px] top-6 bottom-0 w-px bg-border/50" />
              )}

              {/* Timeline Dot */}
              <div
                className={cn(
                  "absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full border-2 border-background flex items-center justify-center",
                  colors.dot
                )}
              >
                <div className="w-2 h-2 rounded-full bg-white/50" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {incident.type}
                  </h4>
                  <Badge
                    variant="outline"
                    className={cn("text-xs shrink-0", colors.badge)}
                  >
                    {incident.severity.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    {incident.camera}
                  </div>
                  <div className="flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    {incident.confidence}%
                  </div>
                  <div className="flex items-center gap-1 col-span-2">
                    <MapPin className="w-3 h-3" />
                    {incident.location}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-primary/80">
                  <Clock className="w-3 h-3" />
                  {incident.timestamp}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
          View Full History
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
