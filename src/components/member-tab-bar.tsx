"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarHeartIcon, HandCoinsIcon, HouseIcon, UsersIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const tabs = [
  { title: "Home", href: "/me", icon: HouseIcon },
  { title: "Give", href: "/me/give", icon: HandCoinsIcon },
  { title: "Events", href: "/me/events", icon: CalendarHeartIcon },
  { title: "Family", href: "/me/family", icon: UsersIcon },
]

export function MemberTabBar() {
  const pathname = usePathname().replace(/\/$/, "") || "/"

  return (
    <nav className="sticky bottom-0 z-20 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="grid grid-cols-4">
        {tabs.map((tab) => {
          const active = pathname === tab.href
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors",
                  active && "text-primary",
                )}
              >
                <tab.icon className={cn("size-5", active && "stroke-[2.25]")} />
                {tab.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
