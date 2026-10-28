"use client"

import { useState } from "react"
import { CalendarRangeIcon } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { academyClasses, academyTerm, formatCurrency, households } from "@/lib/demo-data"

const families = households.filter((h) => h.children.length > 0)

function classForAge(age: number) {
  if (age <= 7) return "Little Learners"
  if (age <= 11) return "Junior Readers"
  return "Language & Culture"
}

export default function AcademyPage() {
  const [householdId, setHouseholdId] = useState(families[0].id)
  const household = families.find((h) => h.id === householdId)!
  const [selected, setSelected] = useState<string[]>(household.children.map((c) => c.id))
  const [plan, setPlan] = useState("full")

  function changeHousehold(id: string) {
    setHouseholdId(id)
    setSelected(families.find((h) => h.id === id)!.children.map((c) => c.id))
  }

  const kids = household.children.filter((c) => selected.includes(c.id))
  const isMember = household.status === "Member"
  // Discounts: 15% off each sibling after the first, then 10% member discount on the total.
  const lines = kids.map((c, i) => {
    const sibling = i > 0 ? academyTerm.tuition * academyTerm.siblingDiscount : 0
    return { child: c, base: academyTerm.tuition, sibling }
  })
  const subtotal = lines.reduce((s, l) => s + l.base, 0)
  const siblingTotal = lines.reduce((s, l) => s + l.sibling, 0)
  const memberTotal = isMember ? (subtotal - siblingTotal) * academyTerm.memberDiscount : 0
  const total = subtotal - siblingTotal - memberTotal
  const dueToday = plan === "full" ? total : total / 3

  return (
    <>
      <PageHeader
        title="Classes & enrollment"
        description={`${academyTerm.name} term · ${academyTerm.starts} – ${academyTerm.ends}`}
        actions={
          <Button variant="outline">
            <CalendarRangeIcon /> Manage terms
          </Button>
        }
      />
      <div className="grid gap-4 px-4 pb-8 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {academyClasses.map((c) => {
            const left = c.capacity - c.enrolled
            return (
              <Card key={c.id}>
                <CardHeader>
                  <CardDescription>Ages {c.ages}</CardDescription>
                  <CardTitle>{c.name}</CardTitle>
                  <CardAction>
                    <Badge variant={left <= 2 ? "destructive" : "secondary"}>{left} seats left</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <div className="text-muted-foreground">
                    {c.teacher} · {c.day}
                  </div>
                  <Progress value={(c.enrolled / c.capacity) * 100} />
                  <div className="text-xs text-muted-foreground">
                    {c.enrolled} of {c.capacity} enrolled
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Enroll a family</CardTitle>
              <CardDescription>Classes are assigned by age as of the term start date.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label>Household</Label>
                <Select value={householdId} onValueChange={changeHousehold}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {families.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name} household · {h.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Children</Label>
                {household.children.map((c) => (
                  <Label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                  >
                    <Checkbox
                      checked={selected.includes(c.id)}
                      onCheckedChange={(v) =>
                        setSelected((s) => (v === true ? [...s, c.id] : s.filter((x) => x !== c.id)))
                      }
                    />
                    <div className="flex-1">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">Age {c.age}</div>
                    </div>
                    <Badge variant="outline">{classForAge(c.age)}</Badge>
                  </Label>
                ))}
              </div>
              <div className="grid gap-2">
                <Label>Payment plan</Label>
                <RadioGroup value={plan} onValueChange={setPlan} className="grid gap-2 sm:grid-cols-2">
                  <Label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal has-[[data-state=checked]]:border-primary">
                    <RadioGroupItem value="full" />
                    <div>
                      <div className="font-medium">Pay in full</div>
                      <div className="text-xs text-muted-foreground">One payment today</div>
                    </div>
                  </Label>
                  <Label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal has-[[data-state=checked]]:border-primary">
                    <RadioGroupItem value="installments" />
                    <div>
                      <div className="font-medium">3 monthly payments</div>
                      <div className="text-xs text-muted-foreground">Jan, Feb and Mar</div>
                    </div>
                  </Label>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Fee summary</CardTitle>
              <CardDescription>
                {academyTerm.name} · {formatCurrency(academyTerm.tuition)} per child
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              {lines.length === 0 && <p className="text-muted-foreground">Select at least one child.</p>}
              {lines.map((l) => (
                <div key={l.child.id} className="flex justify-between">
                  <span>{l.child.name}</span>
                  <span className="tabular-nums">{formatCurrency(l.base)}</span>
                </div>
              ))}
              {siblingTotal > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Sibling discount (15%)</span>
                  <span className="tabular-nums">−{formatCurrency(siblingTotal)}</span>
                </div>
              )}
              {memberTotal > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Member discount (10%)</span>
                  <span className="tabular-nums">−{formatCurrency(memberTotal)}</span>
                </div>
              )}
              {!isMember && lines.length > 0 && (
                <p className="text-xs text-muted-foreground">Member discount applies to member households only.</p>
              )}
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Term total</span>
                <span className="tabular-nums">{formatCurrency(total)}</span>
              </div>
              {plan === "installments" && lines.length > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>3 payments of</span>
                  <span className="tabular-nums">{formatCurrency(total / 3)}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={lines.length === 0}
                onClick={() =>
                  toast.success(`${lines.length} ${lines.length === 1 ? "child" : "children"} enrolled for ${academyTerm.name}`, {
                    description: `${formatCurrency(dueToday)} charged today. Welcome packet sent to ${household.email}.`,
                  })
                }
              >
                Enroll and pay {formatCurrency(dueToday)}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
