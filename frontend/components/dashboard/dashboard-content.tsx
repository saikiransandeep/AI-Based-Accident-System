"use client"

import { StatsGrid } from "./stats-grid"
import { CameraGrid } from "./camera-grid"
import { AccidentTimeline } from "./accident-timeline"
import { AnalyticsCharts } from "./analytics-charts"
import { AlertPanel } from "./alert-panel"
import { SystemHealth } from "./system-health"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Camera Feeds - Takes 2 columns */}
        <div className="xl:col-span-2">
          <CameraGrid />
        </div>

        {/* Alert Panel */}
        <div className="xl:col-span-1">
          <AlertPanel />
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AnalyticsCharts />
        </div>
        <div className="xl:col-span-1">
          <AccidentTimeline />
        </div>
      </div>

      {/* System Health */}
      <SystemHealth />
    </div>
  )
}
