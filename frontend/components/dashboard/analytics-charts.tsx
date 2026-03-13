"use client"

import { useState } from "react"
import { BarChart3, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const accidentData = [
  { time: "00:00", accidents: 2, detected: 2, resolved: 1 },
  { time: "04:00", accidents: 1, detected: 1, resolved: 1 },
  { time: "08:00", accidents: 8, detected: 8, resolved: 6 },
  { time: "12:00", accidents: 5, detected: 5, resolved: 5 },
  { time: "16:00", accidents: 12, detected: 12, resolved: 10 },
  { time: "20:00", accidents: 6, detected: 6, resolved: 4 },
  { time: "Now", accidents: 4, detected: 4, resolved: 2 },
]

const locationData = [
  { location: "Highway I-95", count: 45 },
  { location: "Main St", count: 32 },
  { location: "Airport Rd", count: 28 },
  { location: "Industrial", count: 18 },
  { location: "Downtown", count: 15 },
]

type ChartView = "area" | "bar"

export function AnalyticsCharts() {
  const [chartView, setChartView] = useState<ChartView>("area")

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/30 glow-cyan">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Analytics Overview</h3>
            <p className="text-xs text-muted-foreground">Real-time detection metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartView("area")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              chartView === "area"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            Timeline
          </button>
          <button
            onClick={() => setChartView("bar")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              chartView === "bar"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            By Location
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">38</p>
          <p className="text-xs text-muted-foreground">Total Today</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-accent">29</p>
          <p className="text-xs text-muted-foreground">Resolved</p>
        </div>
        <div className="glass rounded-xl p-4 text-center flex flex-col items-center">
          <div className="flex items-center gap-1">
            <p className="text-2xl font-bold text-primary">4.2</p>
            <span className="text-sm text-muted-foreground">min</span>
          </div>
          <p className="text-xs text-muted-foreground">Avg Response</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === "area" ? (
            <AreaChart data={accidentData}>
              <defs>
                <linearGradient id="accidentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d2d3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d2d3" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.3)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                itemStyle={{ color: "rgba(255,255,255,0.9)" }}
              />
              <Area
                type="monotone"
                dataKey="detected"
                stroke="#00d2d3"
                strokeWidth={2}
                fill="url(#accidentGradient)"
                name="Detected"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#4ade80"
                strokeWidth={2}
                fill="url(#resolvedGradient)"
                name="Resolved"
              />
            </AreaChart>
          ) : (
            <BarChart data={locationData} layout="vertical">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00d2d3" stopOpacity={1} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke="rgba(255,255,255,0.3)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="location"
                type="category"
                stroke="rgba(255,255,255,0.3)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                itemStyle={{ color: "rgba(255,255,255,0.9)" }}
              />
              <Bar
                dataKey="count"
                fill="url(#barGradient)"
                radius={[0, 6, 6, 0]}
                name="Accidents"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
        {chartView === "area" ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Detected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-xs text-muted-foreground">Resolved</span>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              96.5% Detection Rate
            </Badge>
          </>
        ) : (
          <Badge variant="outline" className="border-primary/30 text-primary text-xs">
            Hotspot Analysis - Last 7 Days
          </Badge>
        )}
      </div>
    </div>
  )
}
