"use client"

import Link from "next/link"
import { LogOutIcon, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { initials, me } from "@/lib/demo-data"

export function MemberAccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{initials(me.household.primary)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="grid">
          <span>{me.household.primary}</span>
          <span className="text-xs font-normal text-muted-foreground">{me.household.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/me/family">
            <UserIcon /> My family
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/sign-in">
            <LogOutIcon /> Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
