"use client"

import { useState } from "react"
import { CalendarIcon, CheckCircle2Icon, MapPinIcon, TicketIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { events, formatCurrency, me, myRegistrations, type ChurchEvent } from "@/lib/demo-data"

// Everyone in the signed-in household who can be registered.
const family = [
  me.household.primary,
  ...me.household.authorizedPickup.filter((p) => p.endsWith(me.household.name) && p !== me.household.primary),
  ...me.household.children.map((c) => c.name),
]

export default function MemberEventsPage() {
  const [registrations, setRegistrations] = useState(myRegistrations)
  const [active, setActive] = useState<ChurchEvent | null>(null)
  const [people, setPeople] = useState<string[]>([])
  const [waiver, setWaiver] = useState(false)

  function open(e: ChurchEvent) {
    setActive(e)
    setPeople([me.household.primary])
    setWaiver(false)
  }

  function register() {
    if (!active) return
    const paid = active.price * people.length
    setRegistrations((r) => [...r, { eventId: active.id, people: people.length, paid }])
    toast.success("You're registered!", {
      description: `${active.title} · ${people.length} ${people.length === 1 ? "person" : "people"} · ${formatCurrency(paid)}`,
    })
    setActive(null)
  }

  return (
    <div className="grid gap-5">
      <h1 className="text-2xl font-semibold tracking-tight">Events</h1>

      {events.map((e) => {
        const reg = registrations.find((r) => r.eventId === e.id)
        const left = e.capacity - e.registered
        return (
          <article key={e.id} className="overflow-hidden rounded-xl border bg-card">
            <div className="flex items-start justify-between gap-3 bg-primary/5 p-4">
              <div>
                <div className="text-xs font-medium text-primary">{e.category}</div>
                <h2 className="mt-0.5 text-lg font-semibold leading-snug">{e.title}</h2>
              </div>
              <span className="text-lg font-semibold tabular-nums">{formatCurrency(e.price)}</span>
            </div>
            <div className="grid gap-3 p-4">
              <p className="text-sm text-muted-foreground">{e.description}</p>
              <div className="grid gap-1 text-sm">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="size-4 text-muted-foreground" /> {e.date} · {e.time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPinIcon className="size-4 text-muted-foreground" /> {e.location}
                </span>
              </div>
              {reg ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2Icon className="size-4" />
                  <span className="flex-1">
                    Registered · {reg.people} {reg.people === 1 ? "person" : "people"}
                  </span>
                  <TicketIcon className="size-4" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button className="flex-1" onClick={() => open(e)} disabled={left <= 0}>
                    Register
                  </Button>
                  {left <= 5 && <Badge variant="destructive">{left} spots left</Badge>}
                </div>
              )}
            </div>
          </article>
        )
      })}

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="bottom" className="mx-auto max-h-[90svh] max-w-md overflow-y-auto rounded-t-2xl">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.title}</SheetTitle>
                <SheetDescription>
                  {active.date} · {formatCurrency(active.price)} per person
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 px-4">
                <div className="grid gap-2">
                  <Label>Who&apos;s coming?</Label>
                  {family.map((name) => (
                    <Label
                      key={name}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                    >
                      <Checkbox
                        checked={people.includes(name)}
                        onCheckedChange={(v) =>
                          setPeople((p) => (v === true ? [...p, name] : p.filter((x) => x !== name)))
                        }
                      />
                      {name}
                    </Label>
                  ))}
                </div>
                {active.waiver && (
                  <Label className="flex items-start gap-3 rounded-lg border p-3 font-normal leading-snug">
                    <Checkbox checked={waiver} onCheckedChange={(v) => setWaiver(v === true)} className="mt-0.5" />
                    I agree to the activity waiver for everyone I&apos;m registering, including minors in my care.
                  </Label>
                )}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pay with {me.card}</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(active.price * people.length)}</span>
                </div>
              </div>
              <SheetFooter>
                <Button
                  size="lg"
                  disabled={people.length === 0 || (active.waiver && !waiver)}
                  onClick={register}
                >
                  Pay {formatCurrency(active.price * people.length)}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
