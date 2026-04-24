import { Header } from "@/components/header"
import { CheckCircle2, Clock, Target, TrendingUp, Calendar, Flame } from "lucide-react"

const stats = [
  { label: "Tasks Completed", value: "24", icon: CheckCircle2, change: "+3 today" },
  { label: "In Progress", value: "8", icon: Clock, change: "2 due soon" },
  { label: "Goals Met", value: "85%", icon: Target, change: "+5% this week" },
  { label: "Current Streak", value: "7", icon: Flame, change: "days" },
]

const categories = [
  { name: "Work", tasks: 12, completed: 8, color: "bg-accent" },
  { name: "Personal", tasks: 6, completed: 4, color: "bg-primary" },
  { name: "Health", tasks: 4, completed: 3, color: "bg-muted-foreground" },
  { name: "Learning", tasks: 5, completed: 2, color: "bg-foreground/70" },
]

const recentActivity = [
  { action: "Completed", task: "Review quarterly report", time: "2 hours ago" },
  { action: "Added", task: "Schedule dentist appointment", time: "4 hours ago" },
  { action: "Completed", task: "Send project proposal", time: "Yesterday" },
  { action: "Added", task: "Buy groceries", time: "Yesterday" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Your productivity at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, change }) => (
            <div
              key={label}
              className="bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow"
            >
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
            <div className="space-y-4">
              {categories.map(({ name, tasks, completed, color }) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{name}</span>
                    <span className="text-sm text-muted-foreground">
                      {completed}/{tasks} tasks
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all`}
                      style={{ width: `${(completed / tasks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="font-serif text-xl text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map(({ action, task, time }, index) => (
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
                    <p className="text-xs text-muted-foreground">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="mt-6 bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-foreground">This Week</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <div key={day} className="text-center">
                <p className="text-xs text-muted-foreground mb-2">{day}</p>
                <div
                  className={`h-16 rounded-lg flex items-end justify-center pb-2 ${
                    i < 5 ? "bg-accent/20" : "bg-secondary"
                  }`}
                >
                  <div
                    className="w-6 bg-accent rounded"
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
