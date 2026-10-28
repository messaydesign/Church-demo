"use client"

import { useState } from "react"
import { DownloadIcon, LockIcon, RepeatIcon } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, funds, recentGifts } from "@/lib/demo-data"

const presets = [25, 50, 100, 250]

export default function GivingPage() {
  const [amount, setAmount] = useState("100")
  const [fund, setFund] = useState("general")
  const [recurring, setRecurring] = useState(true)
  const [frequency, setFrequency] = useState("monthly")
  const [coverFees, setCoverFees] = useState(true)

  const value = Number(amount) || 0
  // Matches Stripe's standard card pricing so the church receives the full gift.
  const processingFee = value > 0 ? Math.round(((value + 0.3) / (1 - 0.029) - value) * 100) / 100 : 0
  const fee = coverFees ? processingFee : 0
  const total = value + fee
  const fundName = funds.find((f) => f.id === fund)?.name

  function give() {
    toast.success(`Thank you! ${formatCurrency(value)} to the ${fundName}`, {
      description: recurring
        ? `Recurring ${frequency}. A receipt is on its way by email.`
        : "A receipt is on its way by email.",
    })
  }

  return (
    <>
      <PageHeader
        title="Giving"
        description="Give online, manage recurring gifts and download statements."
        actions={
          <Button variant="outline" onClick={() => toast("2026 contribution statement is being prepared")}>
            <DownloadIcon /> Year-end statement
          </Button>
        }
      />
      <div className="grid gap-4 px-4 pb-8 md:px-8 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Give</CardTitle>
            <CardDescription>Goes directly to Grace Community Church</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid grid-cols-4 gap-2">
              {presets.map((p) => (
                <Button
                  key={p}
                  variant={value === p ? "default" : "outline"}
                  onClick={() => setAmount(String(p))}
                >
                  ${p}
                </Button>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  inputMode="decimal"
                  className="pl-6 text-lg"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Fund</Label>
              <Select value={fund} onValueChange={setFund}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {funds.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <RepeatIcon className="size-4 text-muted-foreground" />
                <Label htmlFor="recurring">Make this recurring</Label>
              </div>
              <Switch id="recurring" checked={recurring} onCheckedChange={setRecurring} />
            </div>
            {recurring && (
              <RadioGroup value={frequency} onValueChange={setFrequency} className="grid grid-cols-3 gap-2">
                {["weekly", "monthly", "yearly"].map((f) => (
                  <Label
                    key={f}
                    htmlFor={f}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 py-2.5 capitalize has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                  >
                    <RadioGroupItem id={f} value={f} /> {f}
                  </Label>
                ))}
              </RadioGroup>
            )}
            <div className="flex items-center justify-between">
              <Label htmlFor="fees" className="font-normal text-muted-foreground">
                Cover the {formatCurrency(processingFee)} processing fee
              </Label>
              <Switch id="fees" checked={coverFees} onCheckedChange={setCoverFees} />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button className="w-full" size="lg" disabled={value <= 0} onClick={give}>
              Give ${total.toFixed(2)}
              {recurring && ` ${frequency}`}
            </Button>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <LockIcon className="size-3" /> Secured by Stripe. Card details never touch Church Hub.
            </p>
          </CardFooter>
        </Card>

        <div className="grid gap-4 xl:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            {funds.map((f) => (
              <Card key={f.id} className="gap-3">
                <CardHeader>
                  <CardDescription>{f.name}</CardDescription>
                  <CardTitle className="text-xl tabular-nums">{formatCurrency(f.raised)}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Progress value={(f.raised / f.goal) * 100} />
                  <span className="text-xs text-muted-foreground">
                    {Math.round((f.raised / f.goal) * 100)}% of {formatCurrency(f.goal)} goal
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent gifts</CardTitle>
              <CardDescription>Visible to treasurers and admins only</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead className="hidden sm:table-cell">Fund</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentGifts.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell className="text-muted-foreground">{g.date}</TableCell>
                      <TableCell className="font-medium">
                        {g.donor}
                        {g.recurring && (
                          <Badge variant="secondary" className="ml-2">
                            Recurring
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">{g.fund}</TableCell>
                      <TableCell className="text-muted-foreground">{g.method}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(g.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
