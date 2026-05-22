import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import ResetPasswordForm from "./reset-password-form";

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await props.searchParams;

  if (!token) {
    return <ErrorPage message="Missing reset token." />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SiteHeader />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgb(229_231_235/.42)_1px,transparent_1px),linear-gradient(rgb(229_231_235/.42)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px animate-[scan-line_7s_linear_infinite] bg-primary/20" />

      <div className="pointer-events-none fixed left-12 top-24 hidden items-center gap-4 font-mono text-xs uppercase tracking-[0.18em] text-outline/55 md:flex">
        <span className="h-px w-12 bg-outline/55" />
        AUTH_PROTOCOL_V4.2
      </div>
      <div className="pointer-events-none fixed bottom-24 right-12 hidden items-center gap-4 font-mono text-xs uppercase tracking-[0.18em] text-outline/55 md:flex">
        COORDINATES: 40.7128 N, 74.0060 W
        <span className="h-px w-12 bg-outline/55" />
      </div>

      <section className="container-portal relative z-10 flex min-h-screen items-center justify-center py-28 md:py-36">
        <div className="w-full max-w-[30rem]">
          <div className="mb-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-headline text-sm font-bold uppercase tracking-[-0.08em] text-primary">
                JOBGRID
              </span>
              <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-on-surface-variant">
                SYSTEM_SECURE
              </span>
            </div>
            <h1 className="font-headline text-[clamp(2.55rem,10vw,4rem)] font-bold uppercase leading-[0.95] tracking-[-0.08em] text-on-background">
              Reset Access Key
            </h1>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-primary">
              <KeyIcon className="size-4" />
              INITIALIZING_KEY_UPDATE...
            </div>
          </div>

          <ResetPasswordForm token={token} />
        </div>
      </section>

      <div className="float-chip pointer-events-none fixed bottom-1/4 left-20 hidden border-l-2 border-primary bg-surface-container/60 p-4 backdrop-blur-sm xl:block">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">
          STATUS: STANDBY
        </p>
        <p className="font-mono text-[0.52rem] uppercase tracking-[0.12em] text-outline-variant">
          ENCRYPTION: AES-256
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}

function ErrorPage({ message }: { message: string }) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <SiteHeader />
      <section className="container-portal relative z-10 flex min-h-screen items-center justify-center py-28 md:py-36">
        <div className="text-center space-y-6">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-error/10">
            <AlertIcon className="size-6 text-error" />
          </div>
          <h1 className="font-headline text-2xl font-bold uppercase tracking-[-0.04em] text-on-background">
            Invalid Reset Link
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant">
            {message}
          </p>
          <a
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-primary transition hover:tracking-[0.18em]"
            href="/login/forgot-password"
          >
            REQUEST NEW RESET LINK
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function KeyIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 10a4 4 0 1 0-2.5 3.7L14 16h3v-3h3v-3h-6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function AlertIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 9v4M12 17h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
