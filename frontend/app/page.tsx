"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { LiveCamerasPage } from "@/components/pages/live-cameras"
import { AlertsPage } from "@/components/pages/alerts"
import { MapViewPage } from "@/components/pages/map-view"
import { HistoryPage } from "@/components/pages/history"
import { AnalyticsPage } from "@/components/pages/analytics"
import { EmergencyServicesPage } from "@/components/pages/emergency-services"
import { SystemHealthPage } from "@/components/pages/system-health"
import { SettingsPage } from "@/components/pages/settings"
import { AdminProfilePage } from "@/components/pages/admin-profile"
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context"
import { ThemeProvider } from "@/lib/theme-context"
import { cn } from "@/lib/utils"

function PageContent() {
  const { activePage, isExpanded } = useSidebar()

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />
      case "cameras":
        return <LiveCamerasPage />
      case "alerts":
        return <AlertsPage />
      case "map":
        return <MapViewPage />
      case "history":
        return <HistoryPage />
      case "analytics":
        return <AnalyticsPage />
      case "emergency":
        return <EmergencyServicesPage />
      case "health":
        return <SystemHealthPage />
      case "settings":
        return <SettingsPage />
      case "profile":
        return <AdminProfilePage />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="flex min-h-screen bg-background gradient-bg">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0",
          "lg:ml-20",
          isExpanded && "lg:ml-64"
        )}
      >
        {/* Top Navigation */}
        <TopNav />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto custom-scrollbar">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <PageContent />
      </SidebarProvider>
    </ThemeProvider>
  )
}
