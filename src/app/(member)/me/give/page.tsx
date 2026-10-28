"use client"

import { useState } from "react"
import { CreditCardIcon, DownloadIcon, LandmarkIcon, LockIcon, RepeatIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { formatCurrency, funds, me, myGifts, myRecurring } from "@/lib/demo-data"

const presets = [25, 50, 100, 200]

export default function MemberGivePage() {
  const [amount, setAmount] = useState("50")
  const [fund, setFund] = useState("general")
  const [frequency, setFrequency] = useState("once")
  const [method, setMethod] = useState("bank")
  const [coverFees, setCoverFees] = useState(false)

  const value = Number(amount) || 0
  // Bank (ACH) is 0.8% capped at $5; cards are 2.9% + 30¢. Covering the fee grosses up the gift.
  const fee =
    value <= 0
      ? 0
      : method === "bank"
        ? Math.min(5, Math.round((value / (1 - 0.008) - value) * 100) / 100)
        : Math.round(((value + 0.3) / (1 - 0.029) - value) * 100) / 100
  const total = value + (coverFees ? fee : 0)
  const fundName = funds.find((f) => f.id === fund)!.name
  const yearTotal = myGifts.reduce((s, g) => s + g.amount, 0)

  function give() {
    toast.success(`Thank you, ${me.firstName}!`, {
      description: `${formatCurrency(total)} to the ${fundName}${frequency !== "once" ? `, ${frequency}` : ""}. Receipt sent by email.`,
    })
  }

  return (
    <div className="grid gap-5">
      <h1 className="text-2xl font-semibold tracking-tight">Give</h1>

      <div className="grid gap-4">
        <div className="text-center">
          <label htmlFor="amount" className="sr-only">
            Amount
          </label>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-semibold text-muted-foreground">$</span>
            <input
              id="amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
              style={{ width: `${Math.max(1, amount.length) + 0.5}ch` }}
              className="max-w-56 bg-transparent text-5xl font-semibold tabular-nums outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((p) => (
            <Button
              key={p}
              variant={value === p ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setAmount(String(p))}
            >
              ${p}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Fund</Label>
        <div className="flex flex-wrap gap-2">
          {funds.map((f) => (
            <button
              key={f.id}
              onClick={() => setFund(f.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                fund === f.id ? "border-primary bg-primary/10 font-medium text-primary" : "hover:bg-muted",
              )}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label>How often</Label>
        <Tabs value={frequency} onValueChange={setFrequency}>
          <TabsList className="w-full">
            <TabsTrigger value="once">Once</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-2">
        <Label>Pay with</Label>
        <RadioGroup value={method} onValueChange={setMethod} className="gap-2">
          <Label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
            <RadioGroupItem value="bank" />
            <LandmarkIcon className="size-4 text-muted-foreground" />
            <span className="flex-1">{me.bank}</span>
            <Badge variant="secondary">Lowest fee</Badge>
          </Label>
          <Label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
            <RadioGroupItem value="card" />
            <CreditCardIcon className="size-4 text-muted-foreground" />
            <span className="flex-1">{me.card}</span>
          </Label>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="fees" className="font-normal text-muted-foreground">
          Add {formatCurrency(fee)} so the church gets the full gift
        </Label>
        <Switch id="fees" checked={coverFees} onCheckedChange={setCoverFees} />
      </div>

      <div className="grid gap-2">
        <Button size="lg" className="h-12 text-base" disabled={value <= 0} onClick={give}>
          Give {formatCurrency(total)}
          {frequency !== "once" && ` ${frequency}`}
        </Button>
        <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <LockIcon className="size-3" /> Secured by Stripe
        </p>
      </div>

      <Separator />

      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="text-base">Your recurring gift</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <RepeatIcon className="size-4 text-primary" />
          <div className="flex-1 text-sm">
            <div className="font-medium">
              {formatCurrency(myRecurring.amount)} {myRecurring.frequency.toLowerCase()} · {myRecurring.fund}
            </div>
            <div className="text-xs text-muted-foreground">Next gift {myRecurring.next}</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast("Recurring gift editor coming in Phase 2")}>
            Manage
          </Button>
        </CardContent>
      </Card>

      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="text-base">Your giving in 2026</CardTitle>
          <CardDescription className="text-2xl font-semibold text-foreground tabular-nums">
            {formatCurrency(yearTotal)}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <ul className="grid divide-y">
            {myGifts.map((g) => (
              <li key={g.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <div className="font-medium">{g.fund}</div>
                  <div className="text-xs text-muted-foreground">
                    {g.date} · {g.method}
                    {g.recurring && " · Recurring"}
                  </div>
                </div>
                <span className="tabular-nums">{formatCurrency(g.amount)}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            onClick={() => toast("Your 2026 statement will be ready in January", { description: "We'll email it to you." })}
          >
            <DownloadIcon /> Year-end tax statement
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
