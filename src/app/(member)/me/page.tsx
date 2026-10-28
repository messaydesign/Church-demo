import Link from "next/link"
import { ChevronRightIcon, HandCoinsIcon, MegaphoneIcon, RepeatIcon, TriangleAlertIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { announcements, events, formatCurrency, me, myCheckIns, myRecurring, myRegistrations } from "@/lib/demo-data"

export default function MemberHomePage() {
  const registered = new Set(myRegistrations.map((r) => r.eventId))
  const kids = me.household.children

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Good morning, {me.firstName}</h1>
        <p className="text-sm text-muted-foreground">Saturday, October 31</p>
      </div>

      {/* Today's check-in status comes first: it's what a parent opens the app for on academy days. */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="text-base">Academy today</CardTitle>
          <CardDescription>Check-in status for your children</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {kids.map((c) => {
            const s = myCheckIns[c.id]
            return (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border p-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full ${s?.status === "in" ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
                  aria-hidden
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    {c.name.split(" ")[0]}
                    {c.allergies && <TriangleAlertIcon className="size-3.5 text-destructive" aria-label="Has allergy alert" />}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s?.status === "in" ? `Checked in at ${s.time} · ${s.room}` : "Not checked in"}
                  </div>
                </div>
                {s?.status === "in" && (
                  <Badge variant="outline" className="font-mono">
                    {s.code}
                  </Badge>
                )}
              </div>
            )
          })}
          <Button variant="ghost" size="sm" className="justify-self-start" asChild>
            <Link href="/me/family">
              Family & pickup <ChevronRightIcon />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Link href="/me/give" className="group">
        <Card className="gap-0 bg-primary py-5 text-primary-foreground transition-opacity group-hover:opacity-95">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary-foreground/15">
              <HandCoinsIcon className="size-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Give</div>
              <div className="flex items-center gap-1 text-xs text-primary-foreground/80">
                <RepeatIcon className="size-3" />
                {formatCurrency(myRecurring.amount)} {myRecurring.frequency.toLowerCase()} · next {myRecurring.next}
              </div>
            </div>
            <ChevronRightIcon className="size-5" />
          </CardContent>
        </Card>
      </Link>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Coming up</h2>
          <Link href="/me/events" className="text-sm text-primary">
            See all
          </Link>
        </div>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
          {events.map((e) => (
            <Link
              key={e.id}
              href="/me/events"
              className="w-60 shrink-0 snap-start rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="text-xs font-medium text-primary">{e.date}</div>
              <div className="mt-1 font-medium leading-snug">{e.title}</div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{e.location}</span>
                {registered.has(e.id) ? <Badge>Registered</Badge> : <span>{formatCurrency(e.price)}</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="font-semibold">Announcements</h2>
        {announcements.map((a) => (
          <Link key={a.id} href={a.href} className="flex gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50">
            <MegaphoneIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="grid gap-1">
              <div className="text-sm font-medium">{a.title}</div>
              <p className="text-sm text-muted-foreground">{a.body}</p>
              <span className="text-xs text-muted-foreground">{a.date}</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
