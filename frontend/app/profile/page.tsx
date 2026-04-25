"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Camera, Mail, Calendar, Award, CheckCircle2, Target, Flame, Edit2, Loader2 } from "lucide-react"
import { fetchProfile, updateProfile, fetchStats, fetchAchievements } from "@/lib/api"

interface Profile { id: number; name: string; email: string; avatar_url: string | null; created_at: string }
interface Stats { tasks_completed: number; current_streak: number; goals_met: number }
interface Achievement { name: string; description: string; icon: string; unlocked: boolean }

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("ticked_token")
    if (!token) { router.push("/login"); return }
    loadAll()
  }, [])

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

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const updated = await updateProfile({ name })
      setProfile(updated)
      setIsEditing(false)
    } finally {
      setSaving(false)
    }
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
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">

        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-secondary flex items-center justify-center text-3xl font-serif text-foreground">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-accent rounded-full text-accent-foreground shadow-lg hover:scale-105 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>

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
                      onClick={handleSave}
                      disabled={saving}
                      className="text-sm px-3 py-1 bg-accent text-accent-foreground rounded-lg"
                    >
                      {saving ? "Saving..." : "Save"}
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