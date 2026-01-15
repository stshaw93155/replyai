"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboardIcon, MessageSquareIcon, SettingsIcon, QrCodeIcon } from "@/components/icons"

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

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <ul className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
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
  )
}
