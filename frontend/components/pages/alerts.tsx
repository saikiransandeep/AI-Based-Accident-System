"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  Bell,
  Check,
  Clock,
  Camera,
  MapPin,
  Filter,
  Search,
  ChevronDown,
  X,
  Shield,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Severity = "critical" | "high" | "medium" | "low"
type AlertStatus = "active" | "acknowledged" | "resolved"

interface Alert {
  id: string
  title: string
  description: string
  severity: Severity
  status: AlertStatus
  camera: string
  location: string
  timestamp: Date
  confidence: number
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  high: {
    icon: AlertCircle,
    color: "text-orange-500",
    bg: "bg-orange-500/20",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  medium: {
    icon: Info,
    color: "text-yellow-500",
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  low: {
    icon: Shield,
    color: "text-blue-500",
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
}

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all")
  const [filterStatus, setFilterStatus] = useState<AlertStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchAlerts = () => {
      fetch("http://127.0.0.1:5000/api/alerts")
        .then((res) => res.json())
        .then((data) => {
          if (data.alerts) {
            setAlerts(
              data.alerts.map((a: any) => ({
                ...a,
                timestamp: new Date(a.timestamp),
              }))
            )
          }
        })
        .catch(console.error)
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.camera.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSeverity && matchesStatus && matchesSearch
  })

  const acknowledgeAlert = (id: string) => {
    fetch(`http://127.0.0.1:5000/api/alerts/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "acknowledged" })
    }).catch(console.error)

    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: "acknowledged" } : alert
      )
    )
  }

  const resolveAlert = (id: string) => {
    fetch(`http://127.0.0.1:5000/api/alerts/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolved" })
    }).catch(console.error)

    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: "resolved" } : alert
      )
    )
  }

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const stats = {
    total: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical" && a.status === "active").length,
    active: alerts.filter((a) => a.status === "active").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Alerts</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.critical}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Severity
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterSeverity("all")}>
                  All Severities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterSeverity("critical")}>
                  Critical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterSeverity("high")}>
                  High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterSeverity("medium")}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterSeverity("low")}>
                  Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Status
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("acknowledged")}>
                  Acknowledged
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("resolved")}>
                  Resolved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No alerts found</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const config = severityConfig[alert.severity]
            const Icon = config.icon

            return (
              <div
                key={alert.id}
                className={cn(
                  "glass-card rounded-2xl p-6 transition-all duration-300",
                  config.border,
                  alert.status === "active" && "border-l-4"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      config.bg
                    )}
                  >
                    <Icon className={cn("w-6 h-6", config.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{alert.title}</h3>
                      <Badge className={cn("text-xs", config.badge)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          alert.status === "active"
                            ? "border-orange-500/30 text-orange-400"
                            : alert.status === "acknowledged"
                              ? "border-blue-500/30 text-blue-400"
                              : "border-accent/30 text-accent"
                        )}
                      >
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {alert.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        {alert.camera}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                      <span className="flex items-center gap-1">
                        Confidence:
                        <span className="text-primary font-mono">{alert.confidence}%</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {alert.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Acknowledge
                      </Button>
                    )}
                    {alert.status !== "resolved" && (
                      <Button
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                        className="gap-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Resolve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
