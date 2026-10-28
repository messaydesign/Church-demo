"use client"

import { useState } from "react"
import { CalendarIcon, ClockIcon, MapPinIcon, MinusIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { events, formatCurrency, type ChurchEvent } from "@/lib/demo-data"

export default function EventsPage() {
  const [active, setActive] = useState<ChurchEvent | null>(null)
  const [mode, setMode] = useState("member")
  const [tickets, setTickets] = useState(1)
  const [waiver, setWaiver] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")

  function open(e: ChurchEvent) {
    setActive(e)
    setTickets(1)
    setWaiver(false)
  }

  const canSubmit =
    !!active && (!active.waiver || waiver) && (mode === "member" || (guestName.trim() && guestEmail.includes("@")))

  function register() {
    if (!active) return
    toast.success(`You're registered for ${active.title}`, {
      description: `${tickets} ${tickets === 1 ? "spot" : "spots"} · ${formatCurrency(active.price * tickets)} paid. Confirmation sent by email.`,
    })
    setActive(null)
  }

  return (
    <>
      <PageHeader
        title="Events"
        description="Register and pay for church activities. Guests are welcome."
        actions={<Button variant="outline">Create event</Button>}
      />
      <div className="grid gap-4 px-4 pb-8 md:grid-cols-2 md:px-8 xl:grid-cols-3">
        {events.map((e) => {
          const left = e.capacity - e.registered
          return (
            <Card key={e.id}>
              <CardHeader>
                <CardDescription>{e.category}</CardDescription>
                <CardTitle className="text-lg">{e.title}</CardTitle>
                <CardAction>
                  <span className="text-lg font-semibold tabular-nums">{formatCurrency(e.price)}</span>
                </CardAction>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-muted-foreground">{e.description}</p>
                <div className="grid gap-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-muted-foreground" /> {e.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="size-4 text-muted-foreground" /> {e.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="size-4 text-muted-foreground" /> {e.location}
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {e.registered} of {e.capacity} registered
                    </span>
                    {left <= 5 ? <span className="font-medium text-destructive">{left} spots left</span> : null}
                  </div>
                  <Progress value={(e.registered / e.capacity) * 100} />
                </div>
                <div className="flex gap-2">
                  {e.waiver && <Badge variant="outline">Waiver required</Badge>}
                  <Badge variant="outline">Guest checkout</Badge>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full" onClick={() => open(e)}>
                  Register
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.title}</DialogTitle>
                <DialogDescription>
                  {active.date} · {active.time} · {active.location}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <Tabs value={mode} onValueChange={setMode}>
                  <TabsList className="w-full">
                    <TabsTrigger value="member">I&apos;m a member</TabsTrigger>
                    <TabsTrigger value="guest">Continue as guest</TabsTrigger>
                  </TabsList>
                </Tabs>
                {mode === "member" ? (
                  <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                    Signed in as <span className="font-medium">Selam Bekele</span>. Saved card ending 4242 will be
                    used.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="gname">Full name</Label>
                      <Input id="gname" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gemail">Email for your receipt</Label>
                      <Input id="gemail" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label>Participants</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Remove participant"
                      disabled={tickets <= 1}
                      onClick={() => setTickets((t) => t - 1)}
                    >
                      <MinusIcon />
                    </Button>
                    <span className="w-4 text-center tabular-nums">{tickets}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Add participant"
                      disabled={tickets >= 6}
                      onClick={() => setTickets((t) => t + 1)}
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                </div>
                {active.waiver && (
                  <Label className="flex items-start gap-3 rounded-lg border p-3 font-normal leading-snug">
                    <Checkbox checked={waiver} onCheckedChange={(v) => setWaiver(v === true)} className="mt-0.5" />
                    I have read and agree to the activity waiver and release on behalf of every participant listed.
                  </Label>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(active.price * tickets)}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActive(null)}>
                  Cancel
                </Button>
                <Button disabled={!canSubmit} onClick={register}>
                  Pay {formatCurrency(active.price * tickets)}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
