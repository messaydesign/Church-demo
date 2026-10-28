"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, ChurchIcon, Loader2Icon, MailIcon, SmartphoneIcon } from "lucide-react"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { church, me } from "@/lib/demo-data"

type Step = "start" | "code" | "create"

// Demo only: any 6-digit code signs you in as the demo member. Real sign-in would send the code by email or SMS.
export default function SignInPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("start")
  const [method, setMethod] = useState("email")
  const [contact, setContact] = useState(me.household.email)
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "" })

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  function changeMethod(m: string) {
    setMethod(m)
    setContact(m === "email" ? me.household.email : me.household.phone)
  }

  function sendCode(to: string) {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      setContact(to)
      setCode("")
      setResendIn(30)
      setStep("code")
    }, 600)
  }

  function verify(value: string) {
    setCode(value)
    if (value.length < 6) return
    setBusy(true)
    setTimeout(() => router.push("/me"), 700)
  }

  const validContact = method === "email" ? /\S+@\S+\.\S+/.test(contact) : contact.replace(/\D/g, "").length >= 10
  const validForm = form.first.trim() && form.last.trim() && /\S+@\S+\.\S+/.test(form.email)

  return (
    <div className="flex flex-1 flex-col px-6 pt-10 pb-8">
      {step !== "start" && (
        <button
          onClick={() => setStep("start")}
          className="-ml-1 mb-6 flex items-center gap-1 self-start text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" /> Back
        </button>
      )}

      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <ChurchIcon className="size-7" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {step === "start" && `Welcome to ${church.short}`}
            {step === "code" && "Check your " + (method === "email" ? "email" : "phone")}
            {step === "create" && "Join our church family"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === "start" && "Sign in to give, register for events and check on your kids."}
            {step === "code" && (
              <>
                We sent a 6-digit code to <span className="font-medium text-foreground">{contact}</span>
              </>
            )}
            {step === "create" && "Create your account. It takes less than a minute."}
          </p>
        </div>
      </div>

      {step === "start" && (
        <div className="grid gap-5">
          <Tabs value={method} onValueChange={changeMethod}>
            <TabsList className="w-full">
              <TabsTrigger value="email">
                <MailIcon /> Email
              </TabsTrigger>
              <TabsTrigger value="phone">
                <SmartphoneIcon /> Phone
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (validContact) sendCode(contact)
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="contact">{method === "email" ? "Email address" : "Mobile number"}</Label>
              <Input
                id="contact"
                className="h-11"
                type={method === "email" ? "email" : "tel"}
                inputMode={method === "email" ? "email" : "tel"}
                autoComplete={method === "email" ? "email" : "tel"}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-11" disabled={!validContact || busy}>
              {busy && <Loader2Icon className="animate-spin" />} Send me a code
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground">No password to remember. We&apos;ll send a one-time code.</p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Separator className="flex-1" /> or <Separator className="flex-1" />
          </div>
          <div className="grid gap-2">
            <Button variant="outline" size="lg" className="h-11" onClick={() => router.push("/me")}>
              Continue with Apple
            </Button>
            <Button variant="outline" size="lg" className="h-11" onClick={() => router.push("/me")}>
              Continue with Google
            </Button>
          </div>

          <div className="mt-2 grid gap-2 text-center text-sm">
            <p className="text-muted-foreground">
              New to {church.name}?{" "}
              <button className="font-medium text-primary hover:underline" onClick={() => setStep("create")}>
                Create an account
              </button>
            </p>
            <Link href="/me/events" className="text-muted-foreground underline-offset-2 hover:underline">
              Just here for an event? Continue as a guest
            </Link>
          </div>
        </div>
      )}

      {step === "code" && (
        <div className="grid justify-items-center gap-6">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={code}
            onChange={verify}
            autoFocus
            disabled={busy}
            aria-label="6-digit code"
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }, (_, i) => (
                <InputOTPSlot key={i} index={i} className="size-12 text-lg" />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {busy ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" /> Signing you in…
            </p>
          ) : (
            <p className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">Demo: enter any 6 digits</p>
          )}
          <Button variant="ghost" size="sm" disabled={resendIn > 0} onClick={() => sendCode(contact)}>
            {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
          </Button>
        </div>
      )}

      {step === "create" && (
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!validForm) return
            setMethod("email")
            sendCode(form.email)
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="first">First name</Label>
              <Input
                id="first"
                className="h-11"
                autoComplete="given-name"
                value={form.first}
                onChange={(e) => setForm({ ...form, first: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last">Last name</Label>
              <Input
                id="last"
                className="h-11"
                autoComplete="family-name"
                value={form.last}
                onChange={(e) => setForm({ ...form, last: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="h-11"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">
              Mobile number <span className="font-normal text-muted-foreground">(optional, for text reminders)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              className="h-11"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <Button size="lg" className="h-11" disabled={!validForm || busy}>
            {busy && <Loader2Icon className="animate-spin" />} Create account
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            You&apos;ll add your household and children after you sign in. A church admin links you to your family
            record.
          </p>
        </form>
      )}

      <p className="mt-auto pt-10 text-center text-xs text-muted-foreground">
        Demo app ·{" "}
        <Link href="/" className="underline-offset-2 hover:underline">
          Admin view
        </Link>
      </p>
    </div>
  )
}
