"use client"

import { useState, useEffect } from "react"
import { Plus, Tag, ChevronDown } from "lucide-react"
import { fetchCategories } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Category {
  id: number
  name: string
  color: string
}

interface TodoInputProps {
  onAdd: (text: string, category_id?: number) => void
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {})
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onAdd(value.trim(), selectedCategory?.id)
      setValue("")
      setSelectedCategory(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Task input row */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-5 py-4 pr-14 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-accent transition-all duration-200"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Add task"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Category selector row */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Category:</span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all",
                selectedCategory
                  ? "bg-accent/15 border-accent/40 text-accent"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {selectedCategory ? selectedCategory.name : "None"}
              <ChevronDown className={cn("w-3 h-3 transition-transform", dropdownOpen && "rotate-180")} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-8 z-20 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                {/* None option */}
                <button
                  type="button"
                  onClick={() => { setSelectedCategory(null); setDropdownOpen(false) }}
                  className={cn(
                    "w-full flex items-center px-4 py-2.5 text-xs text-muted-foreground hover:bg-secondary/60 transition-colors",
                    !selectedCategory && "bg-secondary/40"
                  )}
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

          {selectedCategory && (
            <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
              {selectedCategory.name} ✓
            </span>
          )}
        </div>
      )}
    </form>
  )
}