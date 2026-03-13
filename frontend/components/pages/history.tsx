"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  History,
  Calendar,
  Camera,
  Filter,
  Search,
  ChevronDown,
  Eye,
  Download,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowUpDown,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Severity = "critical" | "high" | "medium" | "low"

interface Incident {
  id: string
  date: Date
  camera: string
  location: string
  type: string
  severity: Severity
  probability: number
  status: "confirmed" | "false-positive" | "pending"
}

const severityColors = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

export function HistoryPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all")
  const [filterCamera, setFilterCamera] = useState<string>("all")
  const [filterDate, setFilterDate] = useState<string>("all")
  const [sortField, setSortField] = useState<"date" | "probability">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchIncidents = () => {
      fetch("http://127.0.0.1:5000/api/history")
        .then((res) => res.json())
        .then((data) => {
          if (data.incidents) {
            setIncidents(
              data.incidents.map((inc: any) => ({
                ...inc,
                date: new Date(inc.date),
              }))
            )
          }
        })
        .catch(console.error)
    }

    fetchIncidents()
    const interval = setInterval(fetchIncidents, 5000)
    return () => clearInterval(interval)
  }, [])

  const cameras = [...new Set(incidents.map((i) => i.camera))]

  const filteredIncidents = incidents
    .filter((incident) => {
      const matchesSeverity = filterSeverity === "all" || incident.severity === filterSeverity
      const matchesCamera = filterCamera === "all" || incident.camera === filterCamera
      const matchesSearch =
        incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.id.toLowerCase().includes(searchQuery.toLowerCase())

      let matchesDate = true
      if (filterDate === "today") {
        const today = new Date()
        matchesDate = incident.date.toDateString() === today.toDateString()
      } else if (filterDate === "week") {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        matchesDate = incident.date >= weekAgo
      } else if (filterDate === "month") {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        matchesDate = incident.date >= monthAgo
      }

      return matchesSeverity && matchesCamera && matchesSearch && matchesDate
    })
    .sort((a, b) => {
      if (sortField === "date") {
        return sortOrder === "desc"
          ? b.date.getTime() - a.date.getTime()
          : a.date.getTime() - b.date.getTime()
      } else {
        return sortOrder === "desc"
          ? b.probability - a.probability
          : a.probability - b.probability
      }
    })

  const toggleSort = (field: "date" | "probability") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const stats = {
    total: incidents.length,
    confirmed: incidents.filter((i) => i.status === "confirmed").length,
    falsePositive: incidents.filter((i) => i.status === "false-positive").length,
    avgProbability:
      incidents.reduce((acc, i) => acc + i.probability, 0) / incidents.length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Incidents</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.confirmed}</p>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.falsePositive}</p>
              <p className="text-xs text-muted-foreground">False Positives</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.avgProbability.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Accuracy</p>
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
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterDate("all")}>
                  All Time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterDate("today")}>
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterDate("week")}>
                  Last 7 Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterDate("month")}>
                  Last 30 Days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Camera
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterCamera("all")}>
                  All Cameras
                </DropdownMenuItem>
                {cameras.map((camera) => (
                  <DropdownMenuItem
                    key={camera}
                    onClick={() => setFilterCamera(camera)}
                  >
                    {camera}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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

            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead
                className="text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date & Time
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground">Camera</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Severity</TableHead>
              <TableHead
                className="text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => toggleSort("probability")}
              >
                <div className="flex items-center gap-1">
                  Probability
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIncidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <History className="w-8 h-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No incidents found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredIncidents.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="border-border/50 hover:bg-primary/5"
                >
                  <TableCell className="font-mono text-primary">
                    {incident.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-foreground">{formatDate(incident.date)}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(incident.date)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-muted-foreground" />
                      {incident.camera}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate max-w-32">{incident.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{incident.type}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", severityColors[incident.severity])}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-mono",
                        incident.probability > 90
                          ? "text-accent"
                          : incident.probability > 75
                            ? "text-primary"
                            : "text-yellow-500"
                      )}
                    >
                      {incident.probability}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        incident.status === "confirmed"
                          ? "border-accent/30 text-accent"
                          : incident.status === "false-positive"
                            ? "border-yellow-500/30 text-yellow-500"
                            : "border-blue-500/30 text-blue-500"
                      )}
                    >
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
