"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Bell, Moon, Globe, Lock, Trash2, Download, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingToggleProps {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
}

function SettingToggle({ label, description, enabled, onToggle }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "relative w-12 h-7 rounded-full transition-colors",
          enabled ? "bg-accent" : "bg-secondary"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-5 h-5 rounded-full bg-card shadow transition-transform",
            enabled && "translate-x-5"
          )}
        />
      </button>
    </div>
  )
}

interface SettingLinkProps {
  icon: React.ReactNode
  label: string
  description: string
  onClick?: () => void
}

function SettingLink({ icon, label, description, onClick }: SettingLinkProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 py-4 border-b border-border last:border-0 hover:bg-secondary/30 -mx-4 px-4 transition-colors text-left"
    >
      <div className="p-2.5 bg-secondary rounded-lg">{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  )
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sounds, setSounds] = useState(true)
  const [weekStart, setWeekStart] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your Ticked experience</p>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="font-serif text-xl text-foreground mb-2">Preferences</h2>
          <p className="text-sm text-muted-foreground mb-4">Manage your app preferences</p>
          
          <SettingToggle
            label="Push Notifications"
            description="Receive reminders for upcoming tasks"
            enabled={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
          <SettingToggle
            label="Dark Mode"
            description="Switch to a darker color scheme"
            enabled={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
          <SettingToggle
            label="Sound Effects"
            description="Play sounds on task completion"
            enabled={sounds}
            onToggle={() => setSounds(!sounds)}
          />
          <SettingToggle
            label="Week Starts Monday"
            description="Set Monday as the first day of the week"
            enabled={weekStart}
            onToggle={() => setWeekStart(!weekStart)}
          />
        </div>

        {/* Account */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="font-serif text-xl text-foreground mb-2">Account</h2>
          <p className="text-sm text-muted-foreground mb-4">Manage your account settings</p>
          
          <SettingLink
            icon={<Globe className="w-5 h-5 text-foreground" />}
            label="Language"
            description="English (US)"
          />
          <SettingLink
            icon={<Lock className="w-5 h-5 text-foreground" />}
            label="Privacy"
            description="Manage your data and privacy settings"
          />
          <SettingLink
            icon={<Bell className="w-5 h-5 text-foreground" />}
            label="Email Preferences"
            description="Weekly digest, tips, and updates"
          />
        </div>

        {/* Data */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-serif text-xl text-foreground mb-2">Data</h2>
          <p className="text-sm text-muted-foreground mb-4">Export or manage your data</p>
          
          <SettingLink
            icon={<Download className="w-5 h-5 text-foreground" />}
            label="Export Data"
            description="Download all your tasks and settings"
          />
          <SettingLink
            icon={<Trash2 className="w-5 h-5 text-destructive" />}
            label="Clear All Tasks"
            description="Permanently delete all completed tasks"
          />
        </div>

        {/* Version */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Ticked v1.0.0
        </p>
      </main>
    </div>
  )
}

