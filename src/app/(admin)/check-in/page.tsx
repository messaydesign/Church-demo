"use client"

import { useMemo, useState } from "react"
import { CheckIcon, LogOutIcon, PrinterIcon, SearchIcon, ShieldAlertIcon, TriangleAlertIcon } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { households, type Child, type Household } from "@/lib/demo-data"

type CheckIn = { child: Child; household: Household; code: string; time: string }

function makeCode() {
  const letters = "ACDEFGHJKLMNPQRTUVWXY"
  return Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join("") +
    Math.floor(10 + Math.random() * 90)
}

const families = households.filter((h) => h.children.length > 0)

export default function CheckInPage() {
  const [query, setQuery] = useState("")
  const [family, setFamily] = useState<Household | null>(null)
  const [picked, setPicked] = useState<string[]>([])
  const [tags, setTags] = useState<CheckIn[] | null>(null)
  const [present, setPresent] = useState<CheckIn[]>([])
  const [pickup, setPickup] = useState<CheckIn | null>(null)
  const [pickupCode, setPickupCode] = useState("")
  const [pickupPerson, setPickupPerson] = useState("")

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\D/g, "") || query.trim().toLowerCase()
    if (q.length < 2) return []
    return families.filter(
      (h) => h.name.toLowerCase().startsWith(q) || h.phone.replace(/\D/g, "").endsWith(q),
    )
  }, [query])

  const presentIds = new Set(present.map((p) => p.child.id))

  function chooseFamily(h: Household) {
    setFamily(h)
    setPicked(h.children.filter((c) => !presentIds.has(c.id)).map((c) => c.id))
  }

  function checkIn() {
    if (!family) return
    const code = makeCode()
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    const created = family.children
      .filter((c) => picked.includes(c.id))
      .map((child) => ({ child, household: family, code, time }))
    setPresent((p) => [...created, ...p])
    setTags(created)
    setFamily(null)
    setQuery("")
  }

  const codeOk = !!pickup && pickupCode.trim().toUpperCase() === pickup.code
  const personOk = !!pickup && pickup.household.authorizedPickup.includes(pickupPerson)

  function checkOut() {
    if (!pickup) return
    setPresent((p) => p.filter((x) => x.child.id !== pickup.child.id))
    toast.success(`${pickup.child.name} checked out to ${pickupPerson}`)
    setPickup(null)
  }

  return (
    <>
      <PageHeader title="Child check-in" description="Saturday academy · Volunteer station 1" />
      <div className="grid gap-4 px-4 pb-8 md:px-8 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Check in</CardTitle>
            <CardDescription>Search by last name or the last 4 digits of a phone number.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {!family && (
              <>
                <div className="relative">
                  <SearchIcon className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    autoFocus
                    placeholder="e.g. Bekele or 0142"
                    className="h-12 pl-10 text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  {matches.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => chooseFamily(h)}
                      className="flex items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-muted"
                    >
                      <div>
                        <div className="font-medium">{h.name} family</div>
                        <div className="text-sm text-muted-foreground">
                          {h.children.map((c) => c.name.split(" ")[0]).join(", ")}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">···{h.phone.slice(-4)}</span>
                    </button>
                  ))}
                  {query.trim().length >= 2 && matches.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No family found. Ask a team lead to add a visitor.
                    </p>
                  )}
                  {query.trim().length < 2 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">Try &ldquo;Bekele&rdquo;, &ldquo;Alemu&rdquo; or &ldquo;0187&rdquo;.</p>
                  )}
                </div>
              </>
            )}

            {family && (
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{family.name} family</div>
                  <Button variant="ghost" size="sm" onClick={() => setFamily(null)}>
                    Back
                  </Button>
                </div>
                {family.children.map((c) => {
                  const already = presentIds.has(c.id)
                  return (
                    <Label
                      key={c.id}
                      className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 has-[:disabled]:opacity-60"
                    >
                      <Checkbox
                        className="size-5"
                        disabled={already}
                        checked={picked.includes(c.id)}
                        onCheckedChange={(v) =>
                          setPicked((s) => (v === true ? [...s, c.id] : s.filter((x) => x !== c.id)))
                        }
                      />
                      <div className="flex-1">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {c.className} · Age {c.age}
                        </div>
                      </div>
                      {c.allergies && (
                        <Badge variant="destructive">
                          <TriangleAlertIcon /> {c.allergies}
                        </Badge>
                      )}
                      {already && <Badge variant="secondary">Checked in</Badge>}
                    </Label>
                  )
                })}
                <Button size="lg" className="h-12 text-base" disabled={picked.length === 0} onClick={checkIn}>
                  <CheckIcon /> Check in {picked.length} {picked.length === 1 ? "child" : "children"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>In the building now</CardTitle>
            <CardDescription>{present.length} checked in</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {present.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No children checked in yet.</p>
            )}
            {present.map((p) => (
              <div key={p.child.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {p.child.name}
                    {p.child.allergies && <TriangleAlertIcon className="size-4 text-destructive" />}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.child.className} · in at {p.time}
                  </div>
                </div>
                <Badge variant="outline" className="font-mono">
                  {p.code}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPickup(p)
                    setPickupCode("")
                    setPickupPerson("")
                  }}
                >
                  <LogOutIcon /> Pick up
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Name tags preview after check-in */}
      <Dialog open={!!tags} onOpenChange={(o) => !o && setTags(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Printing name tags</DialogTitle>
            <DialogDescription>Child tags and the parent pickup tag share the same code.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {tags?.map((t) => (
              <div key={t.child.id} className="rounded-xl border-2 border-dashed p-4">
                <div className="flex items-start justify-between">
                  <div className="text-xl font-bold">{t.child.name.split(" ")[0]}</div>
                  <span className="font-mono text-lg font-bold">{t.code}</span>
                </div>
                <div className="text-sm text-muted-foreground">{t.child.className}</div>
                {t.child.allergies && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1 text-sm font-semibold text-destructive">
                    <ShieldAlertIcon className="size-4" /> ALLERGY: {t.child.allergies.toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            {tags && tags.length > 0 && (
              <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium tracking-wide text-primary uppercase">Parent pickup tag</div>
                    <div className="font-semibold">{tags[0].household.name} family</div>
                    <div className="text-sm text-muted-foreground">
                      {tags.map((t) => t.child.name.split(" ")[0]).join(", ")}
                    </div>
                  </div>
                  <span className="font-mono text-3xl font-bold">{tags[0].code}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setTags(null)}>
              <PrinterIcon /> Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pickup verification */}
      <Dialog open={!!pickup} onOpenChange={(o) => !o && setPickup(null)}>
        <DialogContent>
          {pickup && (
            <>
              <DialogHeader>
                <DialogTitle>Pick up {pickup.child.name}</DialogTitle>
                <DialogDescription>Match the parent&apos;s tag and confirm who is picking up.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Code on parent tag</Label>
                  <Input
                    id="code"
                    className="font-mono text-lg uppercase"
                    placeholder={`Hint for demo: ${pickup.code}`}
                    value={pickupCode}
                    onChange={(e) => setPickupCode(e.target.value)}
                  />
                  {pickupCode.length >= 4 && !codeOk && (
                    <p className="text-sm text-destructive">Code doesn&apos;t match. Call a team lead.</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Who is picking up?</Label>
                  <Select value={pickupPerson} onValueChange={setPickupPerson}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a person" />
                    </SelectTrigger>
                    <SelectContent>
                      {pickup.household.authorizedPickup.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                      <SelectItem value="__other">Someone not on the list</SelectItem>
                    </SelectContent>
                  </Select>
                  {pickupPerson === "__other" && (
                    <p className="flex items-center gap-1.5 text-sm text-destructive">
                      <ShieldAlertIcon className="size-4" /> Not authorized. Do not release; contact the parent and a
                      team lead.
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPickup(null)}>
                  Cancel
                </Button>
                <Button disabled={!codeOk || !personOk} onClick={checkOut}>
                  Release child
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
