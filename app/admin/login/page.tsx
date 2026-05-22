import AdminLoginForm from "./admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgb(229_231_235/.42)_1px,transparent_1px),linear-gradient(rgb(229_231_235/.42)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px animate-[scan-line_7s_linear_infinite] bg-primary/20" />

      <div className="pointer-events-none fixed left-12 top-24 hidden items-center gap-4 font-mono text-xs uppercase tracking-[0.18em] text-outline/55 md:flex">
        <span className="h-px w-12 bg-outline/55" />
        ADMIN_PROTOCOL_V4.2
      </div>
      <div className="pointer-events-none fixed bottom-24 right-12 hidden items-center gap-4 font-mono text-xs uppercase tracking-[0.18em] text-outline/55 md:flex">
        ACCESS_LEVEL: ROOT
        <span className="h-px w-12 bg-outline/55" />
      </div>

      <section className="container-portal relative z-10 flex min-h-screen items-center justify-center py-28 md:py-36">
        <div className="w-full max-w-[30rem]">
          <div className="mb-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-headline text-sm font-bold uppercase tracking-[-0.08em] text-primary">
                JobInPark
              </span>
              <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-on-surface-variant">
                ADMIN_PANEL
              </span>
            </div>
            <h1 className="font-headline text-[clamp(2.55rem,10vw,4rem)] font-bold uppercase leading-[0.95] tracking-[-0.08em] text-on-background">
              Admin Authorization
            </h1>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-primary">
              <ShieldIcon className="size-4" />
              VERIFYING_CREDENTIALS...
            </div>
          </div>

          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}

function ShieldIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 4 6v6c0 5.3 3.3 10.4 8 11 4.7-.6 8-5.7 8-11V6l-8-3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
