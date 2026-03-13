"use client";

import {
  AlertTriangle,
  Check,
  Clock,
  MapPin,
  ChevronRight,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    severity: "critical",
    title: "Multi-Vehicle Collision",
    location: "Highway I-95 North, Exit 42",
    camera: "CAM-001",
    time: "2 min ago",
    confidence: 98.5,
    acknowledged: false,
  },
  {
    id: 2,
    severity: "high",
    title: "Vehicle Rollover Detected",
    location: "Airport Terminal Road",
    camera: "CAM-004",
    time: "8 min ago",
    confidence: 94.2,
    acknowledged: false,
  },
  // {
  //   id: 3,
  //   severity: "medium",
  //   title: "Rear-End Collision",
  //   location: "Main Street Junction",
  //   camera: "CAM-002",
  //   time: "15 min ago",
  //   confidence: 89.7,
  //   acknowledged: true,
  // },
];

const severityConfig = {
  critical: {
    color: "bg-destructive",
    textColor: "text-destructive",
    borderColor: "border-destructive/50",
    bgColor: "bg-destructive/10",
    label: "CRITICAL",
  },
  high: {
    color: "bg-amber-500",
    textColor: "text-amber-500",
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-500/10",
    label: "HIGH",
  },
  medium: {
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500/50",
    bgColor: "bg-yellow-500/10",
    label: "MEDIUM",
  },
};

export function AlertPanel() {
  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-destructive/10 border border-destructive/30 glow-red">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Active Alerts</h3>
            <p className="text-xs text-muted-foreground">
              {alerts.filter((a) => !a.acknowledged).length} unacknowledged
            </p>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Alert List */}
      <div className="flex-1 space-y-3 overflow-auto">
        {alerts.map((alert) => {
          const config =
            severityConfig[alert.severity as keyof typeof severityConfig];

          return (
            <div
              key={alert.id}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300",
                "hover:border-primary/30 cursor-pointer",
                config.borderColor,
                config.bgColor,
                alert.severity === "critical" &&
                  !alert.acknowledged &&
                  "animate-pulse-glow",
              )}>
              {/* Alert Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", config.color)} />
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      config.textColor,
                      config.borderColor,
                    )}>
                    {config.label}
                  </Badge>
                  {!alert.acknowledged && (
                    <Badge className="bg-primary/20 text-primary text-xs">
                      NEW
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {alert.time}
                </span>
              </div>

              {/* Alert Content */}
              <h4 className="font-medium text-foreground mb-2">
                {alert.title}
              </h4>

              <div className="space-y-1 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {alert.location}
                </div>
                <div className="flex items-center justify-between">
                  <span>Camera: {alert.camera}</span>
                  <span className={config.textColor}>
                    Confidence: {alert.confidence}%
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!alert.acknowledged ? (
                  <>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                      <Check className="w-3 h-3 mr-1" />
                      Acknowledge
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border/50">
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-accent">
                    <Check className="w-3 h-3" />
                    Acknowledged
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full text-muted-foreground hover:text-foreground">
          View All Alerts
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
