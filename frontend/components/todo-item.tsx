"use client"

import { Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  id: string
  text: string
  completed: boolean
  category_name?: string
  category_color?: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({
  id, text, completed,
  category_name, category_color,
  onToggle, onDelete
}: TodoItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-xl transition-all duration-300 hover:shadow-md",
        completed && "opacity-70"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(id)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          completed
            ? "bg-accent border-accent"
            : "border-muted-foreground/30 hover:border-accent"
        )}
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {completed && <Check className="w-3.5 h-3.5 text-accent-foreground" />}
      </button>

      {/* Text + category badge */}
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "text-foreground leading-relaxed transition-all duration-300",
            completed && "line-through text-muted-foreground"
          )}
        >
          {text}
        </span>

        {category_name && (
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${category_color || "bg-accent"}`} />
            <span className="text-xs text-muted-foreground">{category_name}</span>
          </div>
        )}
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