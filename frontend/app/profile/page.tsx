"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Camera, Mail, Calendar, Award, CheckCircle2, Target, Flame, Edit2 } from "lucide-react"

const achievements = [
  { name: "Early Bird", description: "Completed 10 tasks before 9 AM", icon: "🌅", unlocked: true },
  { name: "Streak Master", description: "Maintained a 7-day streak", icon: "🔥", unlocked: true },
  { name: "Perfectionist", description: "Completed 100 tasks", icon: "✨", unlocked: true },
  { name: "Goal Getter", description: "Achieved 10 weekly goals", icon: "🎯", unlocked: false },
  { name: "Night Owl", description: "Complete tasks after midnight", icon: "🦉", unlocked: false },
  { name: "Centurion", description: "Complete 1000 tasks", icon: "👑", unlocked: false },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("Alexandra Chen")
  const [email] = useState("alexandra@example.com")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-secondary flex items-center justify-center text-3xl font-serif text-foreground">
                AC
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-accent rounded-full text-accent-foreground shadow-lg hover:scale-105 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-serif text-2xl md:text-3xl text-foreground bg-transparent border-b border-accent focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <h1 className="font-serif text-2xl md:text-3xl text-foreground">{name}</h1>
                )}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-3">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since January 2024</span>
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
            <p className="font-serif text-2xl text-foreground">247</p>
            <p className="text-sm text-muted-foreground">Tasks Done</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-secondary rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <p className="font-serif text-2xl text-foreground">7</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-secondary rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <p className="font-serif text-2xl text-foreground">85%</p>
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

