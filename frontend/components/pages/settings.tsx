"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Settings,
  Bell,
  Camera,
  AlertTriangle,
  Palette,
  Sliders,
  Save,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  Mail,
  Smartphone,
  Shield,
  Database,
  Clock,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SettingsSection = "general" | "notifications" | "cameras" | "alerts" | "theme" | "system"

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general")
  const [isSaving, setIsSaving] = useState(false)

  // General Settings
  const [systemName, setSystemName] = useState("TrafficAI Monitoring")
  const [timezone, setTimezone] = useState("UTC-5")
  const [language, setLanguage] = useState("en")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState([30])

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [criticalOnly, setCriticalOnly] = useState(false)
  const [notificationEmail, setNotificationEmail] = useState("admin@trafficai.io")

  // Camera Settings
  const [defaultResolution, setDefaultResolution] = useState("1080p")
  const [frameRate, setFrameRate] = useState([30])
  const [nightVision, setNightVision] = useState(true)
  const [motionDetection, setMotionDetection] = useState(true)

  // Alert Settings
  const [sensitivityLevel, setSensitivityLevel] = useState([75])
  const [autoAcknowledge, setAutoAcknowledge] = useState(false)
  const [retentionDays, setRetentionDays] = useState([90])
  const [minConfidence, setMinConfidence] = useState([80])

  // Theme Settings
  const [darkMode, setDarkMode] = useState(true)
  const [accentColor, setAccentColor] = useState("cyan")
  const [compactMode, setCompactMode] = useState(false)
  const [animations, setAnimations] = useState(true)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const sections = [
    { id: "general", label: "General", icon: Sliders },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "cameras", label: "Cameras", icon: Camera },
    { id: "alerts", label: "Alert Thresholds", icon: AlertTriangle },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "system", label: "System", icon: Settings },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">General Settings</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">Central European (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Auto Refresh</p>
                      <p className="text-sm text-muted-foreground">Automatically refresh dashboard data</p>
                    </div>
                  </div>
                  <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                </div>
                {autoRefresh && (
                  <div className="p-4 glass rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Refresh Interval</Label>
                      <span className="text-sm text-primary font-mono">{refreshInterval[0]}s</span>
                    </div>
                    <Slider
                      value={refreshInterval}
                      onValueChange={setRefreshInterval}
                      min={5}
                      max={120}
                      step={5}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                {emailNotifications && (
                  <div className="p-4 glass rounded-xl">
                    <Label htmlFor="email">Notification Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.value)}
                      className="mt-2 bg-secondary/50"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Sound Alerts</p>
                      <p className="text-sm text-muted-foreground">Play sound for new alerts</p>
                    </div>
                  </div>
                  <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
                </div>
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-foreground">Critical Only</p>
                      <p className="text-sm text-muted-foreground">Only notify for critical alerts</p>
                    </div>
                  </div>
                  <Switch checked={criticalOnly} onCheckedChange={setCriticalOnly} />
                </div>
              </div>
            </div>
          </div>
        )

      case "cameras":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Camera Configuration</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Default Resolution</Label>
                  <Select value={defaultResolution} onValueChange={setDefaultResolution}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 glass rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Frame Rate</Label>
                    <span className="text-sm text-primary font-mono">{frameRate[0]} FPS</span>
                  </div>
                  <Slider
                    value={frameRate}
                    onValueChange={setFrameRate}
                    min={15}
                    max={60}
                    step={5}
                  />
                </div>
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Night Vision Mode</p>
                      <p className="text-sm text-muted-foreground">Auto-enable IR in low light</p>
                    </div>
                  </div>
                  <Switch checked={nightVision} onCheckedChange={setNightVision} />
                </div>
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Motion Detection</p>
                      <p className="text-sm text-muted-foreground">Enable smart motion detection</p>
                    </div>
                  </div>
                  <Switch checked={motionDetection} onCheckedChange={setMotionDetection} />
                </div>
              </div>
            </div>
          </div>
        )

      case "alerts":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Alert Threshold Settings</h3>
              <div className="space-y-4">
                <div className="p-4 glass rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Detection Sensitivity</Label>
                    <span className="text-sm text-primary font-mono">{sensitivityLevel[0]}%</span>
                  </div>
                  <Slider
                    value={sensitivityLevel}
                    onValueChange={setSensitivityLevel}
                    min={50}
                    max={100}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Higher sensitivity may increase false positives
                  </p>
                </div>
                <div className="p-4 glass rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Minimum Confidence</Label>
                    <span className="text-sm text-primary font-mono">{minConfidence[0]}%</span>
                  </div>
                  <Slider
                    value={minConfidence}
                    onValueChange={setMinConfidence}
                    min={50}
                    max={99}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Only trigger alerts above this confidence level
                  </p>
                </div>
                <div className="p-4 glass rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Data Retention</Label>
                    <span className="text-sm text-primary font-mono">{retentionDays[0]} days</span>
                  </div>
                  <Slider
                    value={retentionDays}
                    onValueChange={setRetentionDays}
                    min={7}
                    max={365}
                    step={7}
                  />
                </div>
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Auto Acknowledge</p>
                      <p className="text-sm text-muted-foreground">Auto-acknowledge low severity alerts</p>
                    </div>
                  </div>
                  <Switch checked={autoAcknowledge} onCheckedChange={setAutoAcknowledge} />
                </div>
              </div>
            </div>
          </div>
        )

      case "theme":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Theme Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                    <div>
                      <p className="font-medium text-foreground">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Use dark color scheme</p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
                <div className="p-4 glass rounded-xl">
                  <Label className="mb-3 block">Accent Color</Label>
                  <div className="flex gap-3">
                    {["cyan", "green", "blue", "purple", "orange"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setAccentColor(color)}
                        className={cn(
                          "w-10 h-10 rounded-xl transition-all",
                          color === "cyan" && "bg-cyan-500",
                          color === "green" && "bg-green-500",
                          color === "blue" && "bg-blue-500",
                          color === "purple" && "bg-purple-500",
                          color === "orange" && "bg-orange-500",
                          accentColor === color && "ring-2 ring-offset-2 ring-offset-background ring-foreground"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <Sliders className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                    </div>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                </div>
                <div className="flex items-center justify-between p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Animations</p>
                      <p className="text-sm text-muted-foreground">Enable UI animations</p>
                    </div>
                  </div>
                  <Switch checked={animations} onCheckedChange={setAnimations} />
                </div>
              </div>
            </div>
          </div>
        )

      case "system":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">System Preferences</h3>
              <div className="space-y-4">
                <div className="p-4 glass rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Database Status</p>
                        <p className="text-sm text-muted-foreground">PostgreSQL v15.2</p>
                      </div>
                    </div>
                    <Badge className="bg-accent/20 text-accent border-accent/30">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Storage Used</span>
                    <span className="text-foreground">42.8 GB / 100 GB</span>
                  </div>
                </div>
                <div className="p-4 glass rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">AI Model</p>
                        <p className="text-sm text-muted-foreground">TrafficAI v2.4.1</p>
                      </div>
                    </div>
                    <Badge className="bg-accent/20 text-accent border-accent/30">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="text-foreground">March 8, 2026</span>
                  </div>
                </div>
                <div className="p-4 glass rounded-xl">
                  <p className="font-medium text-foreground mb-2">System Version</p>
                  <p className="text-sm text-muted-foreground">TrafficAI Dashboard v3.2.0</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Check for Updates
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="glass-card rounded-2xl p-4 sticky top-6">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SettingsSection)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                  activeSection === section.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform",
                  activeSection === section.id && "rotate-90"
                )} />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3">
        <div className="glass-card rounded-2xl p-6">
          {renderSection()}
          <div className="flex justify-end mt-8 pt-6 border-t border-border/50">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
