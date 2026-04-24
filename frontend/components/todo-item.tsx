"use client"

import { Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  id: string
  text: string
  completed: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ id, text, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-lg transition-all duration-300 hover:shadow-md",
        completed && "opacity-70"
      )}
    >
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
      
      <span
        className={cn(
          "flex-1 text-foreground leading-relaxed transition-all duration-300",
          completed && "line-through text-muted-foreground"
        )}
      >
        {text}
      </span>
      
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

