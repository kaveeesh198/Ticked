"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TodoItem } from "./todo-item"
import { TodoInput } from "./todo-input"
import { CheckCircle2, Circle, ListTodo, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "@/lib/api"

interface Todo {
  id: string
  text: string
  completed: boolean
}

type FilterType = "all" | "active" | "completed"

export function TodoList() {
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("ticked_token")
    if (!token) {
      router.push("/login")
      return
    }
    loadTodos()
  }, [filter])

  const loadTodos = async () => {
    try {
      setLoading(true)
      const data = await fetchTodos(filter === "all" ? undefined : filter)
      setTodos(data)
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("token")) {
        router.push("/login")
      } else {
        setError("Failed to load tasks")
      }
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (text: string) => {
    try {
      const newTodo = await createTodo({ text })
      setTodos([newTodo, ...todos])
    } catch {
      setError("Failed to add task")
    }
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return
    try {
      const updated = await updateTodo(id, { completed: !todo.completed })
      setTodos(todos.map((t) => (t.id === id ? updated : t)))
    } catch {
      setError("Failed to update task")
    }
  }

  const deleteTodoItem = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos(todos.filter((t) => t.id !== id))
    } catch {
      setError("Failed to delete task")
    }
  }

  const activeTodos = todos.filter((t) => !t.completed).length
  const completedTodos = todos.filter((t) => t.completed).length

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All", icon: <ListTodo className="w-4 h-4" /> },
    { key: "active", label: "Active", icon: <Circle className="w-4 h-4" /> },
    { key: "completed", label: "Done", icon: <CheckCircle2 className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-6">
      <TodoInput onAdd={addTodo} />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-lg">
        {filters.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              filter === key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <span>{activeTodos} task{activeTodos !== 1 ? "s" : ""} remaining</span>
        <span>{completedTodos} completed</span>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      {/* Todo Items */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="font-medium">
              {filter === "completed"
                ? "No completed tasks yet"
                : filter === "active"
                ? "All tasks completed!"
                : "No tasks yet. Add one above."}
            </p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              text={todo.text}
              completed={todo.completed}
              onToggle={toggleTodo}
              onDelete={deleteTodoItem}
            />
          ))
        )}
      </div>
    </div>
  )
}