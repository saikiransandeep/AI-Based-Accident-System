"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  User,
  Mail,
  Shield,
  Clock,
  Key,
  Edit,
  Camera,
  LogOut,
  Save,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSidebar } from "@/lib/sidebar-context"
import { useAuth } from "@/lib/auth-context"

interface Permission {
  id: string
  name: string
  description: string
  granted: boolean
}

const permissions: Permission[] = [
  { id: "view_dashboard", name: "View Dashboard", description: "Access the main dashboard", granted: true },
  { id: "view_cameras", name: "View Cameras", description: "Access live camera feeds", granted: true },
  { id: "manage_alerts", name: "Manage Alerts", description: "Acknowledge and resolve alerts", granted: true },
  { id: "view_analytics", name: "View Analytics", description: "Access analytics data", granted: true },
  { id: "manage_cameras", name: "Manage Cameras", description: "Configure camera settings", granted: true },
  { id: "manage_users", name: "Manage Users", description: "Add, edit, or remove users", granted: true },
  { id: "system_settings", name: "System Settings", description: "Modify system configuration", granted: true },
  { id: "export_data", name: "Export Data", description: "Export reports and data", granted: true },
]

const activityLog = [
  { action: "Logged in", timestamp: new Date(), ip: "192.168.1.100" },
  { action: "Acknowledged alert #1234", timestamp: new Date(Date.now() - 30 * 60 * 1000), ip: "192.168.1.100" },
  { action: "Resolved incident INC-001", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), ip: "192.168.1.100" },
  { action: "Updated camera settings", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), ip: "192.168.1.100" },
  { action: "Exported analytics report", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), ip: "192.168.1.100" },
]

export function AdminProfilePage() {
  const { setActivePage } = useSidebar()
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Profile Data
  const [name, setName] = useState(user?.name || "Admin User")
  const [email, setEmail] = useState(user?.email || "admin@trafficai.io")
  const [phone, setPhone] = useState("+1 (555) 123-4567")
  const [department, setDepartment] = useState("Operations")

  // Password
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const userInfo = {
    role: "System Administrator",
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
    accountCreated: new Date("2024-01-15"),
    status: "active",
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) return
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsChangingPassword(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleLogout = () => {
    logout()
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 border-4 border-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-foreground mt-4">{name}</h2>
          <p className="text-muted-foreground">{userInfo.role}</p>
          <Badge className="mt-2 bg-accent/20 text-accent border-accent/30 capitalize">
            {userInfo.status}
          </Badge>

          <div className="mt-6 pt-6 border-t border-border/50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </span>
              <span className="text-foreground">{email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Role
              </span>
              <span className="text-foreground">{userInfo.role}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last Login
              </span>
              <span className="text-foreground">
                {formatTimeAgo(userInfo.lastLogin)}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full gap-2"
              variant={isEditing ? "secondary" : "default"}
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Account Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Alerts Handled</span>
              <span className="text-lg font-bold text-primary">247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Response Time</span>
              <span className="text-lg font-bold text-accent">2.3m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Sessions</span>
              <span className="text-lg font-bold text-foreground">1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Edit Profile Form */}
        {isEditing && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
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
        )}

        {/* Change Password */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Security
            </h3>
            {!isChangingPassword && (
              <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(true)}>
                Change Password
              </Button>
            )}
          </div>
          {isChangingPassword ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-secondary/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-secondary/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    "bg-secondary/50",
                    confirmPassword && newPassword !== confirmPassword && "border-destructive"
                  )}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={!currentPassword || !newPassword || newPassword !== confirmPassword || isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium text-foreground">Password is secure</p>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Permissions */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            System Permissions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl",
                  permission.granted ? "glass" : "bg-secondary/30"
                )}
              >
                {permission.granted ? (
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium text-foreground text-sm">{permission.name}</p>
                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {activityLog.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 glass rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{activity.action}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-mono">{activity.ip}</span>
                  <span>{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
