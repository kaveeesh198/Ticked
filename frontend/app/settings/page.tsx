"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import {
  Bell, Moon, Globe, Lock, Trash2, Download,
  ChevronDown, Loader2, Check, Shield, Mail,
  Volume2, Calendar, Palette, LogOut, AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchSettings, updateSettings, clearCompleted, fetchTodos } from "@/lib/api"

// ── Toggle ────────────────────────────────────────────────────
function SettingToggle({
  label, description, enabled, onToggle, icon, color
}: {
  label: string; description: string; enabled: boolean
  onToggle: () => void; icon: React.ReactNode; color: string
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/60 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <div>
          <p className="font-medium text-foreground text-sm">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50",
          enabled ? "bg-accent" : "bg-secondary border border-border"
        )}
      >
        <span className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300",
          enabled && "translate-x-5"
        )} />
      </button>
    </div>
  )
}

// ── Language Selector ──────────────────────────────────────────
const LANGUAGES = [
  { code: "en", label: "English (US)" },
  { code: "si", label: "Sinhala" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "ja", label: "Japanese" },
]

function LanguageSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const selected = LANGUAGES.find((l) => l.code === value) ?? LANGUAGES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-lg text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
      >
        {selected.label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-10 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onChange(lang.code); setOpen(false) }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors"
            >
              {lang.label}
              {lang.code === value && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Section Card ──────────────────────────────────────────────
function SectionCard({
  title, subtitle, icon, iconBg, children
}: {
  title: string; subtitle: string; icon: React.ReactNode
  iconBg: string; children: React.ReactNode
}) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-5">
      {/* Section Header */}
      <div className={`px-6 py-4 ${iconBg} flex items-center gap-3`}>
        <div className="p-2 bg-white/30 rounded-lg backdrop-blur-sm">{icon}</div>
        <div>
          <h2 className="font-serif text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-foreground/70">{subtitle}</p>
        </div>
      </div>
      <div className="px-6 py-2">{children}</div>
    </div>
  )
}

// ── Email Prefs Modal ─────────────────────────────────────────
function EmailPrefsModal({ open, onClose, onSave }: {
  open: boolean; onClose: () => void; onSave: (prefs: object) => void
}) {
  const [weekly, setWeekly] = useState(true)
  const [tips, setTips] = useState(false)
  const [updates, setUpdates] = useState(true)

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm px-4">
      <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4 text-accent" />
          <h3 className="font-serif text-lg text-foreground">Email Preferences</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Choose which emails you'd like to receive</p>
        <div className="space-y-4">
          {[
            { label: "Weekly digest", desc: "Summary of your week's progress", value: weekly, set: setWeekly },
            { label: "Tips & tricks", desc: "Productivity tips from Ticked", value: tips, set: setTips },
            { label: "Product updates", desc: "New features and improvements", value: updates, set: setUpdates },
          ].map(({ label, desc, value, set }) => (
            <div key={label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <button
                onClick={() => set(!value)}
                className={cn("relative w-10 h-5 rounded-full transition-all", value ? "bg-accent" : "bg-secondary border border-border")}
              >
                <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", value && "translate-x-5")} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:bg-secondary/50 transition-colors">Cancel</button>
          <button onClick={() => { onSave({ weekly, tips, updates }); onClose() }} className="flex-1 py-2 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors">Save</button>
        </div>
      </div>
    </div>
  )
}

// ── Privacy Modal ─────────────────────────────────────────────
function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm px-4">
      <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-accent" />
          <h3 className="font-serif text-lg text-foreground">Privacy</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">How we handle your data</p>
        <div className="space-y-3 text-sm text-foreground/80">
          <div className="flex gap-3 p-3 bg-secondary/50 rounded-xl">
            <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p>Your tasks are stored securely and never shared with third parties.</p>
          </div>
          <div className="flex gap-3 p-3 bg-secondary/50 rounded-xl">
            <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p>Passwords are hashed — we cannot see your password.</p>
          </div>
          <div className="flex gap-3 p-3 bg-secondary/50 rounded-xl">
            <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p>You can export or delete your data at any time.</p>
          </div>
        </div>
        <button onClick={onClose} className="w-full mt-5 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors">Got it</button>
      </div>
    </div>
  )
}

// ── Danger Confirm Modal ─────────────────────────────────────
function ConfirmModal({ open, onClose, onConfirm, title, description }: {
  open: boolean; onClose: () => void; onConfirm: () => void
  title: string; description: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm px-4">
      <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <h3 className="font-serif text-lg text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-2 mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:bg-secondary/50 transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(); onClose() }} className="flex-1 py-2.5 bg-destructive text-destructive-foreground rounded-xl text-sm font-medium hover:bg-destructive/90 transition-colors">Confirm</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sounds, setSounds] = useState(true)
  const [weekStart, setWeekStart] = useState(true)
  const [language, setLanguage] = useState("en")
  const [showEmailPrefs, setShowEmailPrefs] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [toast, setToast] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("ticked_token")
    if (!token) { router.push("/login"); return }
    loadSettings()
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const loadSettings = async () => {
    try {
      const s = await fetchSettings()
      setNotifications(s.notifications)
      setDarkMode(s.dark_mode)
      setSounds(s.sounds)
      setWeekStart(s.week_starts_monday)
      setLanguage(s.language || "en")
    } catch {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const save = async (patch: object) => {
    try {
      await updateSettings(patch)
    } catch { /* silent */ }
  }

  const toggle = (field: string, current: boolean, setter: (v: boolean) => void) => {
    setter(!current)
    save({ [field]: !current })
  }

  const handleLanguageChange = (code: string) => {
    setLanguage(code)
    save({ language: code })
    showToast("Language updated ✓")
  }

  const handleExportData = async () => {
    try {
      const todos = await fetchTodos()
      const blob = new Blob([JSON.stringify(todos, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ticked-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast("Data exported ✓")
    } catch {
      showToast("Export failed")
    }
  }

  const handleClearCompleted = async () => {
    try {
      await clearCompleted()
      showToast("Completed tasks cleared ✓")
    } catch {
      showToast("Failed to clear tasks")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("ticked_token")
    localStorage.removeItem("ticked_user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-foreground text-background text-sm rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5" /> {toast}
        </div>
      )}

      {/* Modals */}
      <EmailPrefsModal open={showEmailPrefs} onClose={() => setShowEmailPrefs(false)} onSave={(p) => { save(p); showToast("Email preferences saved ✓") }} />
      <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <ConfirmModal open={showClearConfirm} onClose={() => setShowClearConfirm(false)} onConfirm={handleClearCompleted} title="Clear completed tasks?" description="This will permanently delete all completed tasks. This action cannot be undone." />
      <ConfirmModal open={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} onConfirm={handleLogout} title="Sign out?" description="You'll need to sign in again to access your tasks." />

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/15 rounded-full mb-3">
            <Palette className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent">Preferences</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your Ticked experience</p>
        </div>

        {/* Preferences Section */}
        <SectionCard
          title="Preferences"
          subtitle="Personalize how Ticked behaves"
          icon={<Palette className="w-4 h-4 text-amber-700" />}
          iconBg="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100"
        >
          <SettingToggle label="Push Notifications" description="Receive reminders for upcoming tasks" enabled={notifications} onToggle={() => toggle("notifications", notifications, setNotifications)} icon={<Bell className="w-4 h-4 text-amber-600" />} color="bg-amber-100" />
          <SettingToggle label="Dark Mode" description="Switch to a darker color scheme" enabled={darkMode} onToggle={() => toggle("dark_mode", darkMode, setDarkMode)} icon={<Moon className="w-4 h-4 text-indigo-500" />} color="bg-indigo-100" />
          <SettingToggle label="Sound Effects" description="Play sounds on task completion" enabled={sounds} onToggle={() => toggle("sounds", sounds, setSounds)} icon={<Volume2 className="w-4 h-4 text-emerald-600" />} color="bg-emerald-100" />
          <SettingToggle label="Week Starts Monday" description="Set Monday as the first day of the week" enabled={weekStart} onToggle={() => toggle("week_starts_monday", weekStart, setWeekStart)} icon={<Calendar className="w-4 h-4 text-rose-500" />} color="bg-rose-100" />
        </SectionCard>

        {/* Account Section */}
        <SectionCard
          title="Account"
          subtitle="Manage your account and privacy"
          icon={<Lock className="w-4 h-4 text-primary" />}
          iconBg="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100"
        >
          {/* Language */}
          <div className="flex items-center justify-between py-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Language</p>
                <p className="text-xs text-muted-foreground mt-0.5">App display language</p>
              </div>
            </div>
            <LanguageSelector value={language} onChange={handleLanguageChange} />
          </div>

          {/* Privacy */}
          <button onClick={() => setShowPrivacy(true)} className="w-full flex items-center justify-between py-4 border-b border-border/60 hover:bg-secondary/30 -mx-6 px-6 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Shield className="w-4 h-4 text-violet-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground text-sm">Privacy</p>
                <p className="text-xs text-muted-foreground mt-0.5">See how your data is used</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">Protected</span>
          </button>

          {/* Email Prefs */}
          <button onClick={() => setShowEmailPrefs(true)} className="w-full flex items-center justify-between py-4 hover:bg-secondary/30 -mx-6 px-6 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Mail className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground text-sm">Email Preferences</p>
                <p className="text-xs text-muted-foreground mt-0.5">Digests, tips and updates</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">Configure →</span>
          </button>
        </SectionCard>

        {/* Data Section */}
        <SectionCard
          title="Data"
          subtitle="Export or manage your tasks"
          icon={<Download className="w-4 h-4 text-primary" />}
          iconBg="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100"
        >
          {/* Export */}
          <button onClick={handleExportData} className="w-full flex items-center justify-between py-4 border-b border-border/60 hover:bg-secondary/30 -mx-6 px-6 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Download className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground text-sm">Export Data</p>
                <p className="text-xs text-muted-foreground mt-0.5">Download all tasks as JSON</p>
              </div>
            </div>
            <span className="text-xs text-teal-700 bg-teal-100 px-2 py-1 rounded-full font-medium">Download</span>
          </button>

          {/* Clear completed */}
          <button onClick={() => setShowClearConfirm(true)} className="w-full flex items-center justify-between py-4 hover:bg-destructive/5 -mx-6 px-6 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-4 h-4 text-destructive" />
              </div>
              <div className="text-left">
                <p className="font-medium text-destructive text-sm">Clear Completed Tasks</p>
                <p className="text-xs text-muted-foreground mt-0.5">Permanently delete all done tasks</p>
              </div>
            </div>
            <span className="text-xs text-destructive bg-red-100 px-2 py-1 rounded-full font-medium">Danger</span>
          </button>
        </SectionCard>

        {/* Sign Out */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-destructive/30 rounded-2xl text-destructive hover:bg-destructive/5 transition-colors font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>

        <p className="text-center text-xs text-muted-foreground mt-6">Ticked v1.0.0</p>
      </main>
    </div>
  )
}