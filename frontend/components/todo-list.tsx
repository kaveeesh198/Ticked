"use client"

import { useState } from "react"
import { TodoItem } from "./todo-item"
import { TodoInput } from "./todo-input"
import { CheckCircle2, Circle, ListTodo } from "lucide-react"
import { cn } from "@/lib/utils"

interface Todo {
  id: string
  text: string
  completed: boolean
}

type FilterType = "all" | "active" | "completed"

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Review quarterly report", completed: false },
    { id: "2", text: "Schedule team meeting", completed: true },
    { id: "3", text: "Prepare presentation slides", completed: false },
  ])
  const [filter, setFilter] = useState<FilterType>("all")

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
    }
    setTodos([newTodo, ...todos])
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

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

      {/* Todo Items */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
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
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              text={todo.text}
              completed={todo.completed}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  )
}

