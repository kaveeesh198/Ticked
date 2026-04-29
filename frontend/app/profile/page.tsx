"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import {
  Camera, Mail, Calendar, Award, CheckCircle2,
  Target, Flame, Edit2, Loader2, Upload, X, FolderOpen
} from "lucide-react"
import { fetchProfile, updateProfile, fetchStats, fetchAchievements } from "@/lib/api"

interface Profile { id: number; name: string; email: string; avatar_url: string | null; created_at: string }
interface Stats { tasks_completed: number; current_streak: number; goals_met: number }
interface Achievement { name: string; description: string; icon: string; unlocked: boolean }

// Compress image to max 400x400, return base64
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 400
      let { width, height } = img
      if (width > height) {
        if (width > MAX) { height = (height * MAX) / width; width = MAX }
      } else {
        if (height > MAX) { width = (width * MAX) / height; height = MAX }
      }
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL("image/jpeg", 0.8))
    }
    img.onerror = reject
    img.src = url
  })
}

// ── Avatar Upload Modal ────────────────────────────────────────
function AvatarModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (base64: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB.")
      return
    }
    setError("")
    const compressed = await compressImage(file)
    setPreview(compressed)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleSave = async () => {
    if (!preview) return
    setSaving(true)
    await onSave(preview)
    setSaving(false)
    setPreview(null)
    onClose()
  }

  const handleClose = () => {
    setPreview(null)
    setError("")
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm px-4">
      <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif text-lg text-foreground">Profile Picture</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Upload from your device or take a photo</p>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Preview */}
        {preview ? (
          <div className="flex flex-col items-center gap-4 mb-5">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-accent/30 shadow-lg"
              />
              <button
                onClick={() => setPreview(null)}
                className="absolute -top-1 -right-1 p-1 bg-destructive text-white rounded-full shadow"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Looking good! Save to apply.</p>
          </div>
        ) : (
          // Upload Options
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Camera */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-5 bg-accent/10 border-2 border-accent/20 rounded-xl hover:bg-accent/20 hover:border-accent/40 transition-all group"
            >
              <div className="p-3 bg-accent/20 rounded-full group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-accent" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Camera</p>
                <p className="text-xs text-muted-foreground">Take a photo</p>
              </div>
            </button>

            {/* File */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-5 bg-secondary border-2 border-border rounded-xl hover:bg-secondary/80 hover:border-accent/30 transition-all group"
            >
              <div className="p-3 bg-secondary rounded-full group-hover:scale-110 transition-transform">
                <FolderOpen className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Browse</p>
                <p className="text-xs text-muted-foreground">Choose a file</p>
              </div>
            </button>
          </div>
        )}

        {error && (
          <p className="text-xs text-destructive text-center mb-4">{error}</p>
        )}

        {/* Hidden inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileInput}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!preview || saving}
            className="flex-1 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Upload className="w-4 h-4" /> Save</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [toast, setToast] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("ticked_token")
    if (!token) { router.push("/login"); return }
    loadAll()
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const loadAll = async () => {
    try {
      const [p, s, a] = await Promise.all([fetchProfile(), fetchStats(), fetchAchievements()])
      setProfile(p)
      setName(p.name)
      setStats(s)
      setAchievements(a)
    } catch {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveName = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const updated = await updateProfile({ name, avatar_url: profile?.avatar_url })
      setProfile(updated)
      setIsEditing(false)
      showToast("Name updated ✓")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAvatar = async (base64: string) => {
    const updated = await updateProfile({ name: profile?.name, avatar_url: base64 })
    setProfile(updated)
    showToast("Profile picture updated ✓")
  }

  const initials = profile?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-foreground text-background text-sm rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}

      <AvatarModal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSave={handleSaveAvatar}
      />

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">

        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">

            {/* Avatar */}
            <div className="relative group cursor-pointer" onClick={() => setAvatarModalOpen(true)}>
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-accent/20 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-secondary flex items-center justify-center text-3xl font-serif text-foreground border-4 border-transparent">
                  {initials}
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              {/* Camera badge */}
              <div className="absolute bottom-0 right-0 p-2 bg-accent rounded-full text-accent-foreground shadow-lg border-2 border-card">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="font-serif text-2xl md:text-3xl text-foreground bg-transparent border-b border-accent focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={saving}
                      className="text-sm px-3 py-1 bg-accent text-accent-foreground rounded-lg disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); setName(profile?.name || "") }}
                      className="text-sm px-3 py-1 border border-border rounded-lg text-muted-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h1 className="font-serif text-2xl md:text-3xl text-foreground">{profile?.name}</h1>
                )}
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-3">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(profile?.created_at || "").toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
              </div>

              {/* Click to change avatar hint */}
              <p className="text-xs text-muted-foreground/60 mt-3 md:text-left text-center">
                Click your avatar to change profile picture
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-secondary rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-accent" />
            </div>
            <p className="font-serif text-2xl text-foreground">{stats?.tasks_completed ?? 0}</p>
            <p className="text-sm text-muted-foreground">Tasks Done</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-secondary rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <p className="font-serif text-2xl text-foreground">{stats?.current_streak ?? 0}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-secondary rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <p className="font-serif text-2xl text-foreground">{stats?.goals_met ?? 0}%</p>
            <p className="text-sm text-muted-foreground">Goals Met</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-accent" />
            <h2 className="font-serif text-xl text-foreground">Achievements</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map(({ name, description, icon, unlocked }) => (
              <div
                key={name}
                className={`p-4 rounded-lg border transition-all ${
                  unlocked
                    ? "border-accent/30 bg-accent/5 hover:shadow-md"
                    : "border-border bg-secondary/30 opacity-50"
                }`}
              >
                <span className="text-2xl mb-2 block">{icon}</span>
                <p className="font-medium text-sm text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}