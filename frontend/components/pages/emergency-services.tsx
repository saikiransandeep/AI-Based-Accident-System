"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Building2,
  Phone,
  MapPin,
  Navigation,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Ambulance,
  Shield,
  Flame,
  Stethoscope,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  type: "hospital" | "police" | "ambulance" | "fire"
  phone: string
  address: string
  distance: string
  available: boolean
  responseTime: string
}

export function EmergencyServicesPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    const fetchContacts = () => {
      fetch("http://127.0.0.1:5000/api/emergency-contacts")
        .then((res) => res.json())
        .then((data) => {
          if (data.contacts) setContacts(data.contacts)
        })
        .catch(console.error)
    }

    fetchContacts()
    const interval = setInterval(fetchContacts, 5000)
    return () => clearInterval(interval)
  }, [])

const typeConfig = {
  hospital: {
    icon: Stethoscope,
    label: "Hospitals",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  police: {
    icon: Shield,
    label: "Police Stations",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  ambulance: {
    icon: Ambulance,
    label: "Ambulance Services",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  fire: {
    icon: Flame,
    label: "Fire Department",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
}

function ContactCard({
  contact,
  onEdit,
  onDelete,
}: {
  contact: EmergencyContact
  onEdit: (contact: EmergencyContact) => void
  onDelete: (id: string) => void
}) {
  const config = typeConfig[contact.type]
  const Icon = config.icon

  return (
    <div className={cn(
      "glass-card glass-card-hover rounded-xl p-4 relative overflow-hidden",
      "border-l-4",
      config.borderColor
    )}>
      {/* Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Badge
          className={cn(
            "text-xs",
            contact.available
              ? "bg-accent/20 text-accent border-accent/30"
              : "bg-muted text-muted-foreground border-muted"
          )}
        >
          {contact.available ? "Available" : "Busy"}
        </Badge>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={cn("p-2 rounded-lg", config.bgColor)}>
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>
        <div className="min-w-0 flex-1 pr-16">
          <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
          <p className="text-xs text-muted-foreground">{config.label}</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-foreground font-mono">{contact.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground truncate">{contact.address}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-primary font-medium">{contact.distance}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{contact.responseTime}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border-0"
        >
          <Phone className="w-4 h-4 mr-1" />
          Call
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-accent/20 hover:bg-accent/30 text-accent border-0"
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          Alert
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-secondary/50"
        >
          <Navigation className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-secondary/50"
          onClick={() => onEdit(contact)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30"
          onClick={() => onDelete(contact.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function ContactFormDialog({
  contact,
  onSave,
  onClose,
  isOpen,
}: {
  contact?: EmergencyContact | null
  onSave: (contact: EmergencyContact) => void
  onClose: () => void
  isOpen: boolean
}) {
  const [formData, setFormData] = useState<Partial<EmergencyContact>>(
    contact || {
      name: "",
      type: "hospital",
      phone: "",
      address: "",
      distance: "",
      available: true,
      responseTime: "",
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: contact?.id || `new-${Date.now()}`,
    } as EmergencyContact)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {contact ? "Edit Contact" : "Add New Contact"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-secondary/50 border-border/50"
              placeholder="Organization name"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as EmergencyContact["type"] })}
              className="w-full p-2 rounded-lg bg-secondary/50 border border-border/50 text-foreground"
            >
              <option value="hospital">Hospital</option>
              <option value="police">Police Station</option>
              <option value="ambulance">Ambulance Service</option>
              <option value="fire">Fire Department</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-secondary/50 border-border/50"
              placeholder="+1-555-0000"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-secondary/50 border-border/50"
              placeholder="123 Street Name"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Distance</label>
              <Input
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="bg-secondary/50 border-border/50"
                placeholder="2.5 km"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Response Time</label>
              <Input
                value={formData.responseTime}
                onChange={(e) => setFormData({ ...formData, responseTime: e.target.value })}
                className="bg-secondary/50 border-border/50"
                placeholder="5 min"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="rounded border-border"
            />
            <label htmlFor="available" className="text-sm text-foreground">Available</label>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              {contact ? "Update" : "Add Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}



  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || contact.type === activeFilter
    return matchesSearch && matchesFilter
  })

  const handleSave = (contact: EmergencyContact) => {
    const isNew = !contacts.find((c) => c.id === contact.id)
    const method = isNew ? "POST" : "PUT"
    const url = isNew 
      ? "http://127.0.0.1:5000/api/emergency-contacts"
      : `http://127.0.0.1:5000/api/emergency-contacts/${contact.id}`
      
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact)
    }).then(() => {
      if (isNew) {
        setContacts([...contacts, contact])
      } else {
        setContacts(contacts.map((c) => (c.id === contact.id ? contact : c)))
      }
      setEditingContact(null)
    }).catch(console.error)
  }

  const handleDelete = (id: string) => {
    fetch(`http://127.0.0.1:5000/api/emergency-contacts/${id}`, { method: "DELETE" })
      .then(() => setContacts(contacts.filter((c) => c.id !== id)))
      .catch(console.error)
  }

  const filterTabs = [
    { id: "all", label: "All", count: contacts.length },
    { id: "hospital", label: "Hospitals", count: contacts.filter((c) => c.type === "hospital").length },
    { id: "police", label: "Police", count: contacts.filter((c) => c.type === "police").length },
    { id: "ambulance", label: "Ambulance", count: contacts.filter((c) => c.type === "ambulance").length },
    { id: "fire", label: "Fire", count: contacts.filter((c) => c.type === "fire").length },
  ]

  // Stats
  const stats = [
    {
      label: "Total Services",
      value: contacts.length,
      icon: Building2,
      color: "text-primary",
    },
    {
      label: "Available Now",
      value: contacts.filter((c) => c.available).length,
      icon: CheckCircle,
      color: "text-accent",
    },
    {
      label: "Avg Response Time",
      value: "6 min",
      icon: Clock,
      color: "text-chart-4",
    },
    {
      label: "Nearest Service",
      value: "0.8 km",
      icon: Navigation,
      color: "text-chart-5",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card glass-card-hover rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-secondary/50", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search emergency services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>

          {/* Add Button */}
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeFilter === tab.id
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {tab.label}
              <Badge className="ml-2 bg-background/50" variant="outline">
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onEdit={setEditingContact}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No contacts found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search or filter criteria"
              : "Add your first emergency contact"}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      )}

      {/* Edit/Add Dialog */}
      <ContactFormDialog
        contact={editingContact}
        isOpen={isAddDialogOpen || !!editingContact}
        onSave={handleSave}
        onClose={() => {
          setIsAddDialogOpen(false)
          setEditingContact(null)
        }}
      />
    </div>
  )
}
