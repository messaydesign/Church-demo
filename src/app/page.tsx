import Link from "next/link"
import { ArrowRightIcon, CalendarHeartIcon, GraduationCapIcon, HandCoinsIcon, UsersIcon } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  academyClasses,
  events,
  formatCurrency,
  funds,
  givingByMonth,
  households,
  recentGifts,
} from "@/lib/demo-data"

export default function DashboardPage() {
  const thisMonth = givingByMonth.at(-1)!.amount
  const lastMonth = givingByMonth.at(-2)!.amount
  const change = Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
  const maxMonth = Math.max(...givingByMonth.map((m) => m.amount))
  const people = households.reduce((sum, h) => sum + h.members, 0)
  const registrations = events.reduce((sum, e) => sum + e.registered, 0)
  const enrolled = academyClasses.reduce((sum, c) => sum + c.enrolled, 0)
  const seats = academyClasses.reduce((sum, c) => sum + c.capacity, 0)

  const stats = [
    { label: "Giving in October", value: formatCurrency(thisMonth), note: `+${change}% from September`, icon: HandCoinsIcon },
    { label: "Households", value: households.length.toString(), note: `${people} people`, icon: UsersIcon },
    { label: "Event registrations", value: registrations.toString(), note: `${events.length} upcoming events`, icon: CalendarHeartIcon },
    { label: "Academy enrollment", value: `${enrolled}/${seats}`, note: "Spring 2027 term", icon: GraduationCapIcon },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Good morning, Ruth. Here's what's happening at Grace this week."
        actions={
          <Button asChild>
            <Link href="/check-in">Open check-in</Link>
          </Button>
        }
      />
      <div className="grid gap-4 px-4 pb-8 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader>
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-2xl tabular-nums">{s.value}</CardTitle>
                <CardAction>
                  <s.icon className="size-4 text-muted-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">{s.note}</CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Giving, last 6 months</CardTitle>
              <CardDescription>All funds, card, bank and cash</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-end gap-3">
                {givingByMonth.map((m, i) => (
                  <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      ${(m.amount / 1000).toFixed(1)}k
                    </span>
                    <div
                      className={`w-full rounded-t-md ${i === givingByMonth.length - 1 ? "bg-primary" : "bg-primary/25"}`}
                      style={{ height: `${(m.amount / maxMonth) * 140}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{m.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Funds</CardTitle>
              <CardDescription>Progress toward 2026 goals</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              {funds.map((f) => (
                <div key={f.id} className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{f.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatCurrency(f.raised)} of {formatCurrency(f.goal)}
                    </span>
                  </div>
                  <Progress value={(f.raised / f.goal) * 100} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent gifts</CardTitle>
              <CardDescription>Settled to the church&apos;s Stripe account</CardDescription>
              <CardAction>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/giving">
                    View all <ArrowRightIcon />
                  </Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Fund</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentGifts.slice(0, 5).map((g) => (
                    <TableRow key={g.id}>
                      <TableCell>
                        <div className="font-medium">{g.donor}</div>
                        <div className="text-xs text-muted-foreground">
                          {g.date} · {g.method}
                          {g.recurring && " · Recurring"}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{g.fund}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(g.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Upcoming events</CardTitle>
              <CardDescription>Registrations to date</CardDescription>
              <CardAction>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/events">
                    Manage <ArrowRightIcon />
                  </Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-4">
              {events.map((e) => {
                const pct = Math.round((e.registered / e.capacity) * 100)
                return (
                  <div key={e.id} className="grid gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium">{e.title}</div>
                        <div className="text-xs text-muted-foreground">{e.date}</div>
                      </div>
                      {pct >= 90 ? <Badge variant="destructive">Almost full</Badge> : <Badge variant="outline">{pct}%</Badge>}
                    </div>
                    <Progress value={pct} />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
