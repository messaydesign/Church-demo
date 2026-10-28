"use client"

import { useState } from "react"
import { GraduationCapIcon, PlusIcon, ShieldCheckIcon, TriangleAlertIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { academyTerm, formatCurrency, me, myCheckIns } from "@/lib/demo-data"

type Pickup = { name: string; pending?: boolean }

export default function MemberFamilyPage() {
  const household = me.household
  const [pickups, setPickups] = useState<Pickup[]>(household.authorizedPickup.map((name) => ({ name })))
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")

  const checkedIn = household.children.filter((c) => myCheckIns[c.id]?.status === "in")
  const pickupCode = checkedIn.map((c) => myCheckIns[c.id].code)[0]

  // Same rules as the admin enrollment screen: 15% off each sibling after the first, then 10% member discount.
  const kids = household.children.length
  const springTotal = (academyTerm.tuition * kids - academyTerm.tuition * academyTerm.siblingDiscount * (kids - 1)) * (1 - academyTerm.memberDiscount)

  function addPickup() {
    const label = relation.trim() ? `${name.trim()} (${relation.trim()})` : name.trim()
    setPickups((p) => [...p, { name: label, pending: true }])
    toast.success(`${name.trim()} added`, { description: "The academy office will confirm their ID before first pickup." })
    setAdding(false)
    setName("")
    setRelation("")
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{household.name} family</h1>
        <p className="text-sm text-muted-foreground">
          {household.members} people · member since {household.joined}
        </p>
      </div>

      {pickupCode && (
        <Card className="gap-2 border-primary bg-primary/5 text-center">
          <CardHeader>
            <CardDescription>Show this code at pickup</CardDescription>
            <CardTitle className="font-mono text-5xl tracking-widest">{pickupCode}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            For {checkedIn.map((c) => c.name.split(" ")[0]).join(" and ")} · matches the tag on your child
          </CardContent>
        </Card>
      )}

      <section className="grid gap-3">
        <h2 className="font-semibold">Children</h2>
        {household.children.map((c) => {
          const s = myCheckIns[c.id]
          return (
            <div key={c.id} className="grid gap-2 rounded-xl border p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Age {c.age} · {c.className}
                  </div>
                </div>
                {s?.status === "in" ? (
                  <Badge className="bg-emerald-600 text-white">Checked in {s.time}</Badge>
                ) : (
                  <Badge variant="outline">Not checked in</Badge>
                )}
              </div>
              {c.allergies && (
                <div className="flex items-center gap-1.5 text-sm text-destructive">
                  <TriangleAlertIcon className="size-4" /> Allergy: {c.allergies} · shown on name tags
                </div>
              )}
            </div>
          )
        })}
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Authorized pickup</h2>
          <Button variant="ghost" size="sm" onClick={() => setAdding(true)}>
            <PlusIcon /> Add
          </Button>
        </div>
        <ul className="grid divide-y rounded-xl border">
          {pickups.map((p) => (
            <li key={p.name} className="flex items-center gap-3 p-3 text-sm">
              <ShieldCheckIcon className={`size-4 ${p.pending ? "text-muted-foreground" : "text-primary"}`} />
              <span className="flex-1">{p.name}</span>
              {p.pending && <Badge variant="secondary">Pending ID check</Badge>}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Only people on this list can pick up your children, and they need the code on your parent tag.
        </p>
      </section>

      <Card className="gap-3">
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCapIcon className="size-4 text-primary" />
            <CardTitle className="text-base">{academyTerm.name} enrollment is open</CardTitle>
          </div>
          <CardDescription>
            {academyTerm.starts} – {academyTerm.ends}. Sibling and member discounts applied.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xl font-semibold tabular-nums">{formatCurrency(springTotal)}</div>
            <div className="text-xs text-muted-foreground">
              for {kids} children, or 3 payments of {formatCurrency(springTotal / 3)}
            </div>
          </div>
          <Button
            onClick={() =>
              toast.success(`${kids} children enrolled for ${academyTerm.name}`, {
                description: "Welcome packet sent by email.",
              })
            }
          >
            Re-enroll
          </Button>
        </CardContent>
      </Card>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add someone to pickup</DialogTitle>
            <DialogDescription>They&apos;ll show ID at the academy office before their first pickup.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="pname">Full name</Label>
              <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prel">Relationship</Label>
              <Input id="prel" placeholder="e.g. grandmother" value={relation} onChange={(e) => setRelation(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!name.trim()} onClick={addPickup}>
              Add person
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
