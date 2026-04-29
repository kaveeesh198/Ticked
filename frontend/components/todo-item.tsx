"use client"

import { Check, Trash2, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  id: string
  text: string
  completed: boolean
  due_date?: string
  category_name?: string
  category_color?: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({
  id, text, completed,
  due_date, category_name, category_color,
  onToggle, onDelete,
}: TodoItemProps) {

  const getDueInfo = () => {
    if (!due_date) return null
    const due = new Date(due_date)
    const now = new Date()
    const diffMs = due.getTime() - now.getTime()
    const diffHrs = diffMs / (1000 * 60 * 60)

    const label = due.toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    })

    if (diffMs < 0) return { label, status: "overdue" }
    if (diffHrs <= 1) return { label, status: "soon" }
    if (diffHrs <= 24) return { label, status: "today" }
    return { label, status: "upcoming" }
  }

  const dueInfo = completed ? null : getDueInfo()

  const dueBadgeClass = {
    overdue:  "bg-red-100 text-red-700 border border-red-200",
    soon:     "bg-orange-100 text-orange-700 border border-orange-200",
    today:    "bg-amber-100 text-amber-700 border border-amber-200",
    upcoming: "bg-secondary text-muted-foreground border border-border",
  }[dueInfo?.status || "upcoming"]

  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-5 py-4 bg-card border rounded-xl transition-all duration-300 hover:shadow-md",
        dueInfo?.status === "overdue" && !completed ? "border-red-200" :
        dueInfo?.status === "soon" && !completed ? "border-orange-200" : "border-border",
        completed && "opacity-70"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(id)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          completed ? "bg-accent border-accent" : "border-muted-foreground/30 hover:border-accent"
        )}
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {completed && <Check className="w-3.5 h-3.5 text-accent-foreground" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className={cn(
          "text-foreground leading-relaxed transition-all duration-300",
          completed && "line-through text-muted-foreground"
        )}>
          {text}
        </span>

        {/* Category + due date badges */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {category_name && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`w-1.5 h-1.5 rounded-full ${category_color || "bg-accent"}`} />
              {category_name}
            </span>
          )}

          {dueInfo && (
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${dueBadgeClass}`}>
              {dueInfo.status === "overdue" ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {dueInfo.status === "overdue" ? "Overdue · " : ""}
              {dueInfo.label}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all duration-200"
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}