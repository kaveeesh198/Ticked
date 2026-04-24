import { TodoList } from "@/components/todo-list"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-xl mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
            My Tasks
          </h1>
          <p className="text-muted-foreground">
            Elegantly organize your day
          </p>
        </div>

        {/* Todo List */}
        <TodoList />

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground/60">
          <p>Stay focused. Stay refined.</p>
        </footer>
      </main>
    </div>
  )
}

