"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { CheckCircle2, Clock, Target, TrendingUp, Calendar, Flame, Loader2 } from "lucide-react"
import { fetchStats, fetchWeeklyStats, fetchActivity, fetchCategories } from "@/lib/api"

interface Stats {
  tasks_completed: number
  in_progress: number
  goals_met: number
  current_streak: number
  completed_today: number
  due_soon: number
}

interface WeekDay { day: string; count: number }
interface Activity { action: string; task: string; time: string }
interface Category { name: string; tasks: number; completed: number; color: string }

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [weekly, setWeekly] = useState<WeekDay[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("ticked_token")
    if (!token) { router.push("/login"); return }
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      const [s, w, a, c] = await Promise.all([
        fetchStats(),
        fetchWeeklyStats(),
        fetchActivity(),
        fetchCategories(),
      ])
      setStats(s)
      setWeekly(w)
      setActivity(a)
      setCategories(c)
    } catch {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const statCards = stats ? [
    { label: "Tasks Completed", value: stats.tasks_completed, icon: CheckCircle2, change: `+${stats.completed_today} today` },
    { label: "In Progress",     value: stats.in_progress,     icon: Clock,         change: `${stats.due_soon} due soon` },
    { label: "Goals Met",       value: `${stats.goals_met}%`, icon: Target,        change: "this week" },
    { label: "Current Streak",  value: stats.current_streak,  icon: Flame,         change: "days" },
  ] : []

  const maxWeekly = Math.max(...weekly.map((d) => d.count), 1)

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
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Your productivity at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, change }) => (
            <div key={label} className="bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="font-serif text-2xl md:text-3xl text-foreground mb-1">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-xs text-accent mt-1">{change}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Categories */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="font-serif text-xl text-foreground mb-4">Categories</h2>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              <div className="space-y-4">
                {categories.map(({ name, tasks, completed, color }) => (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{name}</span>
                      <span className="text-sm text-muted-foreground">{completed}/{tasks} tasks</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all`}
                        style={{ width: tasks > 0 ? `${(Number(completed) / Number(tasks)) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="font-serif text-xl text-foreground mb-4">Recent Activity</h2>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <div className="space-y-4">
                {activity.map(({ action, task, time }, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      {action === "Completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{task}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="mt-6 bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-foreground">This Week</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekly.map(({ day, count }) => (
              <div key={day} className="text-center">
                <p className="text-xs text-muted-foreground mb-2">{day}</p>
                <div className="h-16 rounded-lg flex items-end justify-center pb-2 bg-accent/20">
                  <div
                    className="w-6 bg-accent rounded transition-all"
                    style={{ height: `${(count / maxWeekly) * 60 + (count > 0 ? 10 : 0)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}