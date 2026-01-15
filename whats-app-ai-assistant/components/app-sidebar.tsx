"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  WhatsAppIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  SettingsIcon,
  PowerIcon,
  QrCodeIcon,
  LogOutIcon,
} from "@/components/icons"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    label: "Connect",
    href: "/connect",
    icon: QrCodeIcon,
  },
  {
    label: "Chats",
    href: "/chats",
    icon: MessageSquareIcon,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
          <WhatsAppIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg text-sidebar-foreground">ReplyAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Emergency Stop */}
      <div className="px-3 py-2">
        <Link
          href="/emergency-stop"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <PowerIcon className="w-5 h-5" />
          Emergency Stop
        </Link>
      </div>

      {/* User section */}
      <div className="px-3 py-4 border-t border-border">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
          <LogOutIcon className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
