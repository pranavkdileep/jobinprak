import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description: "There are currently no active job openings at JobInPark. Check back later for opportunities to join our team.",
  openGraph: {
    title: "Careers | JobInPark",
    description: "Currently no openings at JobInPark.",
  },
};

export default function CareersPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader active="careers" />

      <section className="container-portal flex min-h-[60vh] flex-col items-center justify-center pb-24 pt-32 text-center">
        <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low">
          <BriefcaseIcon className="size-10 text-on-surface-variant" />
        </div>

        <h1 className="mb-4 font-headline text-[clamp(2rem,6vw,3.5rem)] font-bold uppercase tracking-[-0.06em] text-on-background">
          Currently No Openings
        </h1>

        <p className="mx-auto mb-8 max-w-md text-balance text-base leading-7 text-on-surface-variant">
          There are no active job openings at this time. Please check back later or explore other opportunities.
        </p>

        <div className="rounded-xl border border-outline-variant bg-white/60 px-6 py-4 shadow-ambient backdrop-blur">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-on-surface-variant">
            SYS.STATUS // NO_VACANCIES
          </span>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function BriefcaseIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M8 11v2M16 11v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
