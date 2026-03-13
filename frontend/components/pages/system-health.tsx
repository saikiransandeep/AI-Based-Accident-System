"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Server,
  Camera,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  BarChart3,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

interface ServerStatus {
  id: string
  name: string
  status: "online" | "warning" | "offline"
  cpu: number
  memory: number
  uptime: string
  location: string
}

const servers: ServerStatus[] = [
  { id: "1", name: "Primary Server", status: "online", cpu: 45, memory: 62, uptime: "99.99%", location: "US-East" },
  { id: "2", name: "Backup Server", status: "online", cpu: 12, memory: 34, uptime: "99.95%", location: "US-West" },
  { id: "3", name: "AI Processing Node 1", status: "online", cpu: 78, memory: 85, uptime: "99.98%", location: "US-East" },
  { id: "4", name: "AI Processing Node 2", status: "warning", cpu: 92, memory: 88, uptime: "98.50%", location: "EU-West" },
  { id: "5", name: "Storage Server", status: "online", cpu: 25, memory: 55, uptime: "99.99%", location: "US-East" },
  { id: "6", name: "Cache Server", status: "offline", cpu: 0, memory: 0, uptime: "0%", location: "US-East" },
]

const cpuHistory = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  value: 40 + Math.random() * 30,
}))

const memoryHistory = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  value: 55 + Math.random() * 20,
}))

const networkHistory = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  value: 30 + Math.random() * 40,
}))

export function SystemHealthPage() {
  const [cpuUsage, setCpuUsage] = useState(67)
  const [memoryUsage, setMemoryUsage] = useState(72)
  const [networkUsage, setNetworkUsage] = useState(45)
  const [latency, setLatency] = useState(24)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const fetchHealth = () => {
      fetch("http://127.0.0.1:5000/api/system-health")
        .then((res) => res.json())
        .then((data) => {
          // Keep a bit of variation to simulate live metrics using the base backend value
          setCpuUsage(Math.max(20, Math.min(95, data.cpuUsage + (Math.random() - 0.5) * 10)))
          setMemoryUsage(Math.max(40, Math.min(90, data.memoryUsage + (Math.random() - 0.5) * 5)))
          setNetworkUsage(Math.max(10, Math.min(80, data.networkUsage + (Math.random() - 0.5) * 15)))
          setLatency(Math.max(15, Math.min(50, data.latency + (Math.random() - 0.5) * 8)))
        })
        .catch(console.error)
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const stats = {
    camerasOnline: 11,
    totalCameras: 12,
    aiModelStatus: "active",
    serverUptime: "99.97%",
  }

  const getStatusIcon = (status: ServerStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="w-5 h-5 text-accent" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "offline":
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = (value: number) => {
    if (value >= 90) return "text-red-500"
    if (value >= 75) return "text-yellow-500"
    return "text-accent"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">System Health Monitor</h2>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI Model</p>
              <p className="text-lg font-semibold text-accent capitalize">{stats.aiModelStatus}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cameras</p>
              <p className="text-lg font-semibold text-foreground">
                {stats.camerasOnline}/{stats.totalCameras}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-lg font-semibold text-foreground">{stats.serverUptime}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Latency</p>
              <p className={cn("text-lg font-semibold font-mono", latency > 40 ? "text-yellow-500" : "text-accent")}>
                {latency.toFixed(0)}ms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CPU */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">CPU Usage</p>
                <p className="text-xs text-muted-foreground">8 cores @ 3.2GHz</p>
              </div>
            </div>
            <span className={cn("text-2xl font-bold font-mono", getStatusColor(cpuUsage))}>
              {cpuUsage.toFixed(0)}%
            </span>
          </div>
          <Progress value={cpuUsage} className="h-2 mb-4" />
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuHistory}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#cpuGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Memory Usage</p>
                <p className="text-xs text-muted-foreground">64GB DDR5</p>
              </div>
            </div>
            <span className={cn("text-2xl font-bold font-mono", getStatusColor(memoryUsage))}>
              {memoryUsage.toFixed(0)}%
            </span>
          </div>
          <Progress value={memoryUsage} className="h-2 mb-4" />
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoryHistory}>
                <defs>
                  <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#4ade80" fill="url(#memoryGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Network I/O</p>
                <p className="text-xs text-muted-foreground">10 Gbps</p>
              </div>
            </div>
            <span className={cn("text-2xl font-bold font-mono", getStatusColor(networkUsage))}>
              {networkUsage.toFixed(0)}%
            </span>
          </div>
          <Progress value={networkUsage} className="h-2 mb-4" />
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkHistory}>
                <defs>
                  <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#f97316" fill="url(#networkGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Server Status Grid */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" />
          Server Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((server) => (
            <div
              key={server.id}
              className={cn(
                "glass rounded-xl p-4 transition-all duration-300",
                server.status === "offline" && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(server.status)}
                  <div>
                    <p className="font-medium text-foreground">{server.name}</p>
                    <p className="text-xs text-muted-foreground">{server.location}</p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    "text-xs capitalize",
                    server.status === "online"
                      ? "bg-accent/20 text-accent border-accent/30"
                      : server.status === "warning"
                        ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                        : "bg-red-500/20 text-red-500 border-red-500/30"
                  )}
                >
                  {server.status}
                </Badge>
              </div>
              {server.status !== "offline" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">CPU</span>
                    <span className={cn("font-mono", getStatusColor(server.cpu))}>
                      {server.cpu}%
                    </span>
                  </div>
                  <Progress value={server.cpu} className="h-1.5" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Memory</span>
                    <span className={cn("font-mono", getStatusColor(server.memory))}>
                      {server.memory}%
                    </span>
                  </div>
                  <Progress value={server.memory} className="h-1.5" />
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="text-accent font-mono">{server.uptime}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Camera Connectivity */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          Camera Connectivity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => {
            const isOnline = i !== 6
            return (
              <div
                key={i}
                className={cn(
                  "glass rounded-xl p-3 text-center transition-all",
                  isOnline ? "hover:bg-accent/10" : "opacity-50"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center",
                    isOnline ? "bg-accent/20" : "bg-red-500/20"
                  )}
                >
                  <Camera className={cn("w-4 h-4", isOnline ? "text-accent" : "text-red-500")} />
                </div>
                <p className="text-sm font-medium text-foreground">CAM-{String(i + 1).padStart(2, "0")}</p>
                <p className={cn("text-xs", isOnline ? "text-accent" : "text-red-500")}>
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
