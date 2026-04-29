"use client"

import { useState, useEffect } from "react"
import { Plus, Tag, Calendar, Clock, ChevronDown, X } from "lucide-react"
import { fetchCategories } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Category {
  id: number
  name: string
  color: string
}

interface TodoInputProps {
  onAdd: (text: string, category_id?: number, due_date?: string) => void
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showExtras, setShowExtras] = useState(false)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return

    // Combine date + time into ISO string if provided
    let due_date: string | undefined
    if (dueDate) {
      const combined = dueTime ? `${dueDate}T${dueTime}:00` : `${dueDate}T23:59:00`
      due_date = new Date(combined).toISOString()
    }

    onAdd(value.trim(), selectedCategory?.id, due_date)
    setValue("")
    setSelectedCategory(null)
    setDueDate("")
    setDueTime("")
    setShowExtras(false)
  }

  const clearDue = () => { setDueDate(""); setDueTime("") }

  // Min date = today
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Main input */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setShowExtras(true)}
          placeholder="Add a new task..."
          className="flex-1 px-5 py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="mr-3 p-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label="Add task"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Extras row — shown when input is focused */}
      {showExtras && (
        <div className="px-4 pb-4 pt-1 border-t border-border/40 space-y-3">

          {/* Category + Due Date row */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Category dropdown */}
            {categories.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    selectedCategory
                      ? "bg-accent/15 border-accent/40 text-accent"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Tag className="w-3 h-3" />
                  {selectedCategory ? selectedCategory.name : "Category"}
                  <ChevronDown className={cn("w-3 h-3 transition-transform", dropdownOpen && "rotate-180")} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 top-9 z-20 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => { setSelectedCategory(null); setDropdownOpen(false) }}
                      className="w-full px-4 py-2.5 text-xs text-muted-foreground hover:bg-secondary/60 transition-colors text-left"
                    >
                      No category
                    </button>
                    {categories.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat); setDropdownOpen(false) }}
                        className={cn(
                          "w-full flex items-center gap-2 px-4 py-2.5 text-xs text-foreground hover:bg-secondary/60 transition-colors",
                          selectedCategory?.id === cat.id && "bg-accent/10"
                        )}
                      >
                        <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Due date picker */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-lg">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <input
                  type="date"
                  value={dueDate}
                  min={today}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="text-xs bg-transparent text-foreground focus:outline-none w-28 cursor-pointer"
                />
              </div>

              {/* Time picker — only show if date selected */}
              {dueDate && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-lg">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="text-xs bg-transparent text-foreground focus:outline-none w-20 cursor-pointer"
                  />
                </div>
              )}

              {/* Clear due date */}
              {dueDate && (
                <button
                  type="button"
                  onClick={clearDue}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Summary badges */}
          {(selectedCategory || dueDate) && (
            <div className="flex items-center gap-2 flex-wrap">
              {selectedCategory && (
                <span className="flex items-center gap-1.5 text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedCategory.color}`} />
                  {selectedCategory.name}
                </span>
              )}
              {dueDate && (
                <span className="flex items-center gap-1.5 text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                  <Calendar className="w-3 h-3" />
                  {new Date(`${dueDate}T${dueTime || "23:59"}`).toLocaleString("en-US", {
                    month: "short", day: "numeric",
                    hour: dueTime ? "2-digit" : undefined,
                    minute: dueTime ? "2-digit" : undefined,
                  })}
                </span>
              )}
            </div>
          )}

          {/* Dismiss extras */}
          <button
            type="button"
            onClick={() => setShowExtras(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Hide options ↑
          </button>
        </div>
      )}
    </div>
  )
}