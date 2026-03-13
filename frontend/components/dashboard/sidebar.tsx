"use client"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/lib/sidebar-context"
import {
  LayoutDashboard,
  Camera,
  AlertTriangle,
  MapPin,
  History,
  BarChart3,
  Settings,
  Activity,
  Shield,
  ChevronLeft,
  ChevronRight,
  Zap,
  User,
  Phone,
  X,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Camera, label: "Live Cameras", id: "cameras" },
  { icon: AlertTriangle, label: "Alerts", id: "alerts" },
  { icon: MapPin, label: "Map View", id: "map" },
  { icon: History, label: "History", id: "history" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Phone, label: "Emergency Services", id: "emergency" },
  { icon: Activity, label: "System Health", id: "health" },
  { icon: Settings, label: "Settings", id: "settings" },
  { icon: User, label: "Admin Profile", id: "profile" },
]

export function Sidebar() {
  const { isExpanded, setIsExpanded, activePage, setActivePage, isMobileOpen, setIsMobileOpen } = useSidebar()

  const handleNavClick = (id: string) => {
    setActivePage(id)
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen glass-card flex flex-col transition-all duration-300",
          // Desktop
          "hidden lg:flex",
          isExpanded ? "lg:w-64" : "lg:w-20",
          // Mobile - show when open
          isMobileOpen && "flex w-72"
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 glass rounded-xl hover:bg-primary/10 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-border/50 flex-shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-cyan">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse-glow" />
          </div>
          {(isExpanded || isMobileOpen) && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg text-foreground tracking-tight">AI-ACCIDENT DETECTION</h1>
              <p className="text-xs text-muted-foreground">Monitoring System</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                "hover:bg-primary/10 group",
                activePage === item.id
                  ? "bg-primary/15 text-primary cyber-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                  activePage === item.id && "text-primary"
                )}
              />
              {(isExpanded || isMobileOpen) && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {activePage === item.id && (isExpanded || isMobileOpen) && (
                <Zap className="w-4 h-4 ml-auto text-primary animate-pulse-glow" />
              )}
            </button>
          ))}
        </nav>

        {/* Toggle Button - Desktop only */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-secondary border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* System Status */}
        <div className={cn(
          "border-t border-border/50 p-4 flex-shrink-0",
          !isExpanded && !isMobileOpen && "p-2"
        )}>
          <div className={cn(
            "glass rounded-xl transition-all duration-300",
            (isExpanded || isMobileOpen) ? "p-4" : "p-2"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow flex-shrink-0" />
              {(isExpanded || isMobileOpen) && (
                <span className="text-xs font-medium text-accent">SYSTEM ONLINE</span>
              )}
            </div>
            {(isExpanded || isMobileOpen) && (
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>AI Model</span>
                  <span className="text-accent">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Cameras</span>
                  <span className="text-foreground">12/12</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency</span>
                  <span className="text-primary">24ms</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
