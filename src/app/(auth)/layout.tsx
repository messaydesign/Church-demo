export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-muted/40">
      <div className="mx-auto flex min-h-svh max-w-md flex-col bg-background shadow-sm sm:border-x">{children}</div>
    </div>
  )
}
