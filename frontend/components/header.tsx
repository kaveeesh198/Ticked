"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CheckCircle, LayoutDashboard, Settings, User, Info, ListTodo, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/",          label: "Tasks",     icon: ListTodo },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile",   label: "Profile",   icon: User },
  { href: "/settings",  label: "Settings",  icon: Settings },
  { href: "/about",     label: "About",     icon: Info },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("ticked_token")
    localStorage.removeItem("ticked_user")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-accent rounded-full transition-transform group-hover:scale-105">
              <CheckCircle className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-serif text-2xl tracking-tight text-foreground">Ticked</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-secondary/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center gap-1">
            {navItems.slice(0, 4).map(({ href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "p-2.5 rounded-lg transition-colors",
                  pathname === href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
            <button onClick={handleLogout} className="p-2.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}