import Link from "next/link"
import { ChurchIcon } from "lucide-react"

import { MemberAccountMenu } from "@/components/member-account-menu"
import { MemberTabBar } from "@/components/member-tab-bar"
import { church } from "@/lib/demo-data"

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    // Phone-width column; on desktop it sits centered like a device preview.
    <div className="min-h-svh bg-muted/40">
      <div className="mx-auto flex min-h-svh max-w-md flex-col bg-background shadow-sm sm:border-x">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ChurchIcon className="size-4" />
          </div>
          <div className="flex-1 leading-tight">
            <div className="text-sm font-semibold">{church.name}</div>
            <Link href="/" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
              Demo · switch to admin
            </Link>
          </div>
          <MemberAccountMenu />
        </header>
        <main className="flex-1 px-4 pt-5 pb-8">{children}</main>
        <MemberTabBar />
      </div>
    </div>
  )
}
