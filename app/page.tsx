import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LocationSelect } from "@/components/location-select";
import { listPublicJobs } from "@/actions/public/jobs";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Job } from "@/types/jobs";

export default async function Home() {
  const jobsResult = await listPublicJobs({ page: 1, limit: 6 });
  const featuredJobs = "jobs" in jobsResult ? (jobsResult.jobs as Job[]) : [];
  const categories = [
    {
      title: "Frontend Eng",
      count: "4,203 Jobs",
      icon: "code",
      keyword: "frontend",
      skill_set: "react",
    },
    {
      title: "AI / ML",
      count: "2,150 Jobs",
      icon: "chip",
      keyword: "AI",
      skill_set: "machine learning",
    },
    {
      title: "Backend Eng",
      count: "5,892 Jobs",
      icon: "server",
      keyword: "backend",
      skill_set: "node",
    },
    {
      title: "Product Design",
      count: "1,840 Jobs",
      icon: "wand",
      keyword: "design",
      skill_set: "ui/ux",
    },
  ];
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader active="explore" />

      <section className="container-portal relative flex min-h-[42rem] items-center justify-center pb-24 pt-32 md:min-h-[48rem] md:pb-32 md:pt-44">
        <StatusChip className="left-0 top-24 hidden lg:flex" tone="muted">
          SYS.REQ // VALIDATED
        </StatusChip>
        <StatusChip className="bottom-28 right-0 hidden lg:flex" tone="primary">
          PORT 8080 : ACTIVE
        </StatusChip>

        <div className="pointer-events-none absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mx-auto mb-5 w-fit rounded-full border border-outline-variant bg-white/70 px-4 py-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.24em] text-primary shadow-ambient backdrop-blur md:hidden">
            SYS.REQ // VALIDATED
          </p>
          <h1 className="mb-6 font-headline text-[clamp(2.7rem,11vw,5.8rem)] font-bold leading-[0.98] tracking-[-0.08em] text-on-background md:tracking-[-0.075em]">
            SELECT YOUR FUTURE
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-balance text-base leading-7 text-on-surface-variant md:mb-12 md:text-body-lg">
            Initialize your career trajectory. AI-driven matching connects top talent with the world&apos;s most advanced technology protocols.
          </p>

          <form className="group mx-auto grid max-w-3xl gap-2 rounded-2xl border border-outline-variant bg-white/82 p-2 shadow-ambient backdrop-blur-xl transition duration-300 focus-within:border-primary/70 focus-within:shadow-electric md:grid-cols-[1fr_1fr_auto]">
            <label className="flex items-center gap-3 rounded-xl border border-transparent bg-surface-container-low px-4 py-3.5 transition duration-300 focus-within:border-primary focus-within:bg-white">
              <SearchIcon className="size-5 shrink-0 text-on-surface-variant transition-colors duration-300 group-focus-within:text-primary" />
              <input
                className="w-full border-0 bg-transparent p-0 font-mono text-xs uppercase tracking-[0.18em] outline-none placeholder:text-on-surface-variant focus:outline-none"
                placeholder="Job Title or Keyword"
                type="search"
              />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-transparent bg-surface-container-low px-4 py-3.5 transition duration-300 focus-within:border-primary focus-within:bg-white">
              <LocationSelect />
            </label>
            <button
              type="submit"
              className="group/execute flex items-center justify-center gap-3 rounded-xl bg-primary px-8 py-3.5 text-label-md font-semibold uppercase text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-electric active:translate-y-0"
            >
              <RocketIcon className="size-5 transition-transform duration-300 group-hover/execute:-translate-y-0.5 group-hover/execute:translate-x-0.5" />
              Execute
            </button>
          </form>
        </div>
      </section>

      {featuredJobs.length > 0 && (
        <section className="relative border-t border-outline-variant py-16 md:py-20">
          <div className="container-portal">
            <div className="mb-10 flex items-center gap-4 md:mb-12">
              <ListIcon className="size-6 shrink-0 text-primary" />
              <h2 className="font-headline text-2xl font-semibold uppercase tracking-[-0.05em] text-on-background md:text-[2rem]">
                Latest Protocols
              </h2>
              <div className="h-px flex-1 bg-outline-variant" />
              <Link
                href="/jobs"
                className="shrink-0 rounded-lg border border-outline-variant px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition hover:border-primary hover:text-primary"
              >
                View All
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.map((job) => (
                <Link
                  key={job.job_id}
                  href={`/jobs?jobid=${job.job_id}`}
                  className="group/card relative overflow-hidden rounded-2xl border border-outline-variant bg-white p-5 shadow-ambient transition duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-electric"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="font-headline text-lg font-bold uppercase leading-tight tracking-[-0.06em] text-on-background line-clamp-2">
                      {job.job_title}
                    </h3>
                    <span className="shrink-0 rounded border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-primary">
                      ID:{job.job_id}
                    </span>
                  </div>

                  <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-on-surface-variant">
                    ▦ {job.company_name}
                  </p>

                  {job.details?.small_description && (
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
                      {job.details.small_description}
                    </p>
                  )}

                  {job.details?.skill_set?.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {job.details.skill_set.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-outline-variant/60 bg-surface-container-low px-2.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-on-surface-variant"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-outline-variant/50 pt-3">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-outline">
                      Closes {formatDate(job.closing_date)}
                    </span>
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-primary opacity-0 transition-opacity group-hover/card:opacity-100">
                      View Protocol →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>
      )}

      <section className="border-t border-outline-variant py-16 md:py-20">
        <div className="container-portal">
          <div className="mb-10 flex items-center gap-4 md:mb-12">
            <GridIcon className="size-6 shrink-0 text-primary" />
            <h2 className="font-headline text-2xl font-semibold uppercase tracking-[-0.05em] text-on-background md:text-[2rem]">
              Select Your Domain
            </h2>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <a
                key={category.title}
                href={`/jobs?keyword=${encodeURIComponent(category.keyword)}&skill_set=${encodeURIComponent(category.skill_set)}`}
                className="group/card reveal-line relative overflow-hidden rounded-2xl border border-outline-variant bg-white p-6 shadow-ambient transition duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-electric focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="mb-7 flex size-12 items-center justify-center rounded-lg bg-surface-container-low text-on-surface transition duration-300 group-hover/card:rotate-3 group-hover/card:scale-110 group-hover/card:bg-primary/10 group-hover/card:text-primary">
                  <CategoryIcon name={category.icon} />
                </div>
                <h3 className="mb-2 font-headline text-2xl font-semibold tracking-[-0.06em] text-on-background">
                  {category.title}
                </h3>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
                  {category.count}
                </p>
                <ArrowIcon className="absolute right-5 top-5 size-5 translate-x-1 -translate-y-1 text-primary opacity-0 transition duration-300 group-hover/card:translate-x-0 group-hover/card:translate-y-0 group-hover/card:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function StatusChip({
  children,
  className,
  tone,
}: {
  children: ReactNode;
  className: string;
  tone: "muted" | "primary";
}) {
  return (
    <div
      className={`float-chip absolute items-center rounded-xl border border-outline-variant bg-white/72 px-5 py-4 shadow-ambient backdrop-blur ${
        tone === "primary" ? "text-primary" : "text-on-surface-variant"
      } ${className}`}
    >
      <span className="font-mono text-xs uppercase tracking-[0.16em]">{children}</span>
    </div>
  );
}

function CategoryIcon({ name }: { name: string }) {
  const className = "size-6";

  if (name === "code") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m9 7-5 5 5 5M15 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "chip") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4M10.5 10.5h3v3h-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "server") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 5h14v6H5zM5 13h14v6H5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 8h.01M8 16h.01M12 8h4M12 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m14 5 5 5M4 20l9.5-9.5M12 7l5 5M5 5l2 2M19 17l2 2M17 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function RocketIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 4c3.5.5 5.5 2.5 6 6l-6.5 6.5-4-4L14 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 13 5 14l-2 4 4-2 1-4M14 18l-1 3M6 10l-3 1M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GridIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "TBD";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function ListIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
