"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Clock,
  Zap,
  Calendar,
} from "lucide-react"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts"

const accidentsPerDay = [
  { day: "Mon", accidents: 12, resolved: 10 },
  { day: "Tue", accidents: 8, resolved: 7 },
  { day: "Wed", accidents: 15, resolved: 14 },
  { day: "Thu", accidents: 10, resolved: 9 },
  { day: "Fri", accidents: 18, resolved: 16 },
  { day: "Sat", accidents: 22, resolved: 20 },
  { day: "Sun", accidents: 14, resolved: 13 },
]

const accidentsPerLocation = [
  { location: "Highway A1", count: 45, change: 12 },
  { location: "Main St", count: 32, change: -5 },
  { location: "Junction 5", count: 28, change: 8 },
  { location: "Bridge Rd", count: 21, change: -2 },
  { location: "Route 66", count: 18, change: 3 },
  { location: "Tunnel E", count: 15, change: -1 },
]

const severityDistribution = [
  { name: "Critical", value: 15, color: "#ef4444" },
  { name: "High", value: 28, color: "#f97316" },
  { name: "Medium", value: 35, color: "#eab308" },
  { name: "Low", value: 22, color: "#3b82f6" },
]

const detectionAccuracy = [
  { month: "Jan", accuracy: 87 },
  { month: "Feb", accuracy: 89 },
  { month: "Mar", accuracy: 91 },
  { month: "Apr", accuracy: 90 },
  { month: "May", accuracy: 93 },
  { month: "Jun", accuracy: 94 },
  { month: "Jul", accuracy: 92 },
  { month: "Aug", accuracy: 95 },
  { month: "Sep", accuracy: 94 },
  { month: "Oct", accuracy: 96 },
  { month: "Nov", accuracy: 95 },
  { month: "Dec", accuracy: 97 },
]

const systemUsage = [
  { hour: "00:00", cpu: 45, memory: 62, network: 30 },
  { hour: "04:00", cpu: 35, memory: 58, network: 25 },
  { hour: "08:00", cpu: 75, memory: 78, network: 65 },
  { hour: "12:00", cpu: 85, memory: 82, network: 78 },
  { hour: "16:00", cpu: 90, memory: 85, network: 82 },
  { hour: "20:00", cpu: 70, memory: 75, network: 60 },
]

const hourlyDetections = [
  { hour: "00", detections: 2 },
  { hour: "02", detections: 1 },
  { hour: "04", detections: 1 },
  { hour: "06", detections: 5 },
  { hour: "08", detections: 12 },
  { hour: "10", detections: 8 },
  { hour: "12", detections: 6 },
  { hour: "14", detections: 9 },
  { hour: "16", detections: 15 },
  { hour: "18", detections: 18 },
  { hour: "20", detections: 11 },
  { hour: "22", detections: 4 },
]

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week")

  const [stats, setStats] = useState([
    {
      label: "Total Detections",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: Activity,
    },
    {
      label: "Avg Response Time",
      value: "2.3s",
      change: "-8.2%",
      trend: "down",
      icon: Clock,
    },
    {
      label: "Detection Accuracy",
      value: "96.8%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
    },
    {
      label: "System Uptime",
      value: "99.9%",
      change: "+0.1%",
      trend: "up",
      icon: Zap,
    },
  ])

  useEffect(() => {
    const fetchAnalytics = () => {
      fetch("http://127.0.0.1:5000/api/analytics")
        .then((res) => res.json())
        .then((data) => {
          if (data.stats) {
            setStats((prev) =>
              prev.map((item, i) => ({
                ...item,
                value: data.stats[i].value,
                change: data.stats[i].change,
                trend: data.stats[i].trend,
              }))
            )
          }
        })
        .catch(console.error)
    }

    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Analytics Overview</h2>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1 glass rounded-lg p-1">
            {(["day", "week", "month"] as const).map((range) => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? "default" : "ghost"}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "capitalize",
                  timeRange === range && "bg-primary text-primary-foreground"
                )}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-accent" />
              ) : (
                <TrendingDown className="w-4 h-4 text-accent" />
              )}
              <span className="text-sm text-accent">{stat.change}</span>
              <span className="text-xs text-muted-foreground">vs last {timeRange}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accidents Per Day */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Accidents Per Day
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accidentsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="accidents"
                  fill="#00d2d3"
                  radius={[4, 4, 0, 0]}
                  name="Detected"
                />
                <Bar
                  dataKey="resolved"
                  fill="#4ade80"
                  radius={[4, 4, 0, 0]}
                  name="Resolved"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Severity Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detection Accuracy */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Detection Accuracy Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={detectionAccuracy}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2d3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d2d3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#00d2d3"
                  strokeWidth={2}
                  fill="url(#accuracyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Usage */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            System Usage Statistics
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={systemUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#00d2d3"
                  strokeWidth={2}
                  dot={false}
                  name="CPU"
                />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={false}
                  name="Memory"
                />
                <Line
                  type="monotone"
                  dataKey="network"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  name="Network"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accidents Per Location */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Accidents Per Location
          </h3>
          <div className="space-y-4">
            {accidentsPerLocation.map((loc) => (
              <div key={loc.location} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{loc.location}</span>
                    <span className="text-sm font-mono text-muted-foreground">
                      {loc.count}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{
                        width: `${(loc.count / 50) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <Badge
                  className={cn(
                    "text-xs",
                    loc.change > 0
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-accent/20 text-accent border-accent/30"
                  )}
                >
                  {loc.change > 0 ? "+" : ""}
                  {loc.change}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Detection Pattern */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Hourly Detection Pattern
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyDetections}>
                <defs>
                  <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="detections"
                  stroke="#4ade80"
                  strokeWidth={2}
                  fill="url(#hourlyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
