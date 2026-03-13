"use client"

import { Bell, Search, User, Wifi, Clock, ChevronDown, Menu, Sun, Moon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/lib/sidebar-context"
import { useTheme } from "@/lib/theme-context"

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Traffic Monitoring Dashboard", subtitle: "Real-time AI-powered accident detection" },
  cameras: { title: "Live Camera Feeds", subtitle: "Monitor and analyze camera streams" },
  alerts: { title: "Alert Management", subtitle: "View and manage system alerts" },
  map: { title: "Map View", subtitle: "Geographic visualization of incidents" },
  history: { title: "Incident History", subtitle: "Review past detected incidents" },
  analytics: { title: "Analytics Dashboard", subtitle: "Performance metrics and statistics" },
  emergency: { title: "Emergency Services", subtitle: "Manage emergency contacts and response" },
  health: { title: "System Health", subtitle: "Monitor system performance" },
  settings: { title: "Settings", subtitle: "Configure system preferences" },
  profile: { title: "Admin Profile", subtitle: "Manage your account" },
}

export function TopNav() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isScrolled, setIsScrolled] = useState(false)
  const { activePage, setActivePage, setIsMobileOpen } = useSidebar()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const currentPage = pageTitles[activePage] || pageTitles.dashboard

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border/50 px-4 lg:px-6 py-4 transition-all duration-300",
        isScrolled
          ? "bg-background shadow-md shadow-background/20"
          : "glass-card"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3 lg:gap-4 min-w-0">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 glass rounded-xl hover:bg-primary/10 transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="min-w-0">
            <h2 className="text-lg lg:text-xl font-bold text-foreground truncate">{currentPage.title}</h2>
            <p className="text-xs lg:text-sm text-muted-foreground flex items-center gap-2">
              <Wifi className="w-3 h-3 text-accent flex-shrink-0" />
              <span className="truncate">{currentPage.subtitle}</span>
            </p>
          </div>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cameras, incidents..."
              className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 glass rounded-xl hover:bg-primary/10 transition-colors group"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </button>

          {/* Time Display (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 glass rounded-xl">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-foreground">
              {currentTime.toLocaleTimeString("en-US", { hour12: false })}
            </span>
            <span className="text-xs text-muted-foreground hidden lg:inline">
              {currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>

          {/* Notifications */}
          <button
            onClick={() => setActivePage("alerts")}
            className="relative p-2 glass rounded-xl hover:bg-primary/10 transition-colors group"
          >
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs px-1.5 animate-pulse-glow"
            >
              3
            </Badge>
          </button>

          {/* User Profile */}
          <button
            onClick={() => setActivePage("profile")}
            className="flex items-center gap-2 lg:gap-3 p-2 glass rounded-xl hover:bg-primary/10 transition-colors group"
          >
            <Avatar className="h-8 w-8 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-sm">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">System Operator</p>
            </div>
            <ChevronDown className="hidden lg:block w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>
      </div>
    </header>
  )
}
