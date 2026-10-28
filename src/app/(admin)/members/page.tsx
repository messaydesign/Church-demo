"use client"

import { useMemo, useState } from "react"
import { MailIcon, PhoneIcon, SearchIcon, ShieldCheckIcon, TriangleAlertIcon, UserPlusIcon } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, households, initials, type Household } from "@/lib/demo-data"

const statusVariant = {
  Member: "default",
  Visitor: "secondary",
  Inactive: "outline",
} as const

export default function MembersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [selected, setSelected] = useState<Household | null>(null)

  const filtered = useMemo(
    () =>
      households.filter((h) => {
        const q = query.toLowerCase()
        const matches =
          !q ||
          h.name.toLowerCase().includes(q) ||
          h.primary.toLowerCase().includes(q) ||
          h.children.some((c) => c.name.toLowerCase().includes(q))
        return matches && (status === "all" || h.status === status)
      }),
    [query, status],
  )

  return (
    <>
      <PageHeader
        title="Members"
        description="Households, contact details, children and authorized pickup."
        actions={
          <Button>
            <UserPlusIcon /> Add household
          </Button>
        }
      />
      <div className="grid gap-4 px-4 pb-8 md:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-80">
            <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search households or children"
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Tabs value={status} onValueChange={setStatus}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Member">Members</TabsTrigger>
              <TabsTrigger value="Visitor">Visitors</TabsTrigger>
              <TabsTrigger value="Inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card className="py-0">
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Household</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead>People</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden pr-4 text-right sm:table-cell">Giving YTD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((h) => (
                  <TableRow key={h.id} className="cursor-pointer" onClick={() => setSelected(h)}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{initials(h.primary)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{h.name} household</div>
                          <div className="text-xs text-muted-foreground">{h.primary}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      <div>{h.email}</div>
                      <div className="text-xs">{h.phone}</div>
                    </TableCell>
                    <TableCell>
                      {h.members}
                      {h.children.length > 0 && (
                        <span className="hidden text-xs text-muted-foreground sm:inline">
                          {" "}
                          · {h.children.length} in academy
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[h.status]}>{h.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden pr-4 text-right tabular-nums sm:table-cell">
                      {formatCurrency(h.givingYtd)}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No households match &ldquo;{query}&rdquo;.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name} household</SheetTitle>
                <SheetDescription>
                  {selected.status} since {selected.joined} · {selected.members} people
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 px-4 pb-6">
                <div className="grid gap-2 text-sm">
                  <div className="font-medium">{selected.primary}</div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MailIcon className="size-4" /> {selected.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <PhoneIcon className="size-4" /> {selected.phone}
                  </div>
                </div>
                <Separator />
                <div className="grid gap-3">
                  <h3 className="text-sm font-medium">Children</h3>
                  {selected.children.length === 0 && <p className="text-sm text-muted-foreground">No children on file.</p>}
                  {selected.children.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Age {c.age} · {c.className}
                        </div>
                      </div>
                      {c.allergies && (
                        <Badge variant="destructive">
                          <TriangleAlertIcon /> {c.allergies}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                {selected.authorizedPickup.length > 0 && (
                  <>
                    <Separator />
                    <div className="grid gap-2">
                      <h3 className="text-sm font-medium">Authorized pickup</h3>
                      {selected.authorizedPickup.map((p) => (
                        <div key={p} className="flex items-center gap-2 text-sm">
                          <ShieldCheckIcon className="size-4 text-primary" /> {p}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Giving this year</span>
                  <span className="font-medium tabular-nums">{formatCurrency(selected.givingYtd)}</span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
