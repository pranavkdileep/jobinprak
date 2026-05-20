import { listUserJobs, type UserJobsParams } from "@/actions/user/jobs";
import { JobCard } from "@/components/job-card";
import type { Job } from "@/types/jobs";
import Link from "next/link";
import type { ReactNode } from "react";

type DashSearchParams = Promise<{
  page?: string | string[];
  keyword?: string | string[];
  source?: string | string[];
  skill_set?: string | string[];
  min_experience?: string | string[];
  max_experience?: string | string[];
  sort?: string | string[];
  showAll?: string | string[];
}>;

export default async function DashPage({
  searchParams,
}: {
  searchParams: DashSearchParams;
}) {
  const params = await searchParams;
  const page = toPositiveNumber(first(params.page), 1);
  const keyword = first(params.keyword);
  const source = first(params.source);
  const skillSet = first(params.skill_set);
  const minExperience = optionalNumber(first(params.min_experience));
  const maxExperience = optionalNumber(first(params.max_experience));
  const sort = normalizeSort(first(params.sort));
  const showAll = first(params.showAll) === "1";

  const query: UserJobsParams = {
    page,
    limit: 8,
    keyword: keyword || undefined,
    source: source || undefined,
    skill_set: skillSet || undefined,
    min_experience: minExperience,
    max_experience: maxExperience,
    sort,
    showAll,
  };

  const result = await listUserJobs(query);
  const hasError = "error" in result;
  const jobs = hasError ? [] : (result.jobs as Job[]);
  const total = hasError ? 0 : result.total;
  const totalPages = hasError ? 1 : Math.max(result.totalPages, 1);

  return (
    <main className="min-h-screen text-on-surface">
      <DashSidebar />

      <div className="min-h-screen md:ml-64">
        <header className="dash-topbar fixed left-0 right-0 top-0 z-40 border-b border-outline-variant bg-surface/80 backdrop-blur-lg md:left-64">
          <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-16">
            <form action="/dash" className="hidden flex-1 md:block">
              <label className="relative block max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                <input
                  name="keyword"
                  defaultValue={keyword}
                  placeholder="Search Protocols..."
                  className="w-full rounded border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 font-mono text-xs uppercase tracking-[0.18em] transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
              </label>
            </form>
            <div className="flex items-center gap-2 md:hidden">
              <TerminalIcon className="size-5 text-primary" />
              <span className="font-headline text-xl font-bold tracking-[-0.08em]">JOBGRID</span>
            </div>
            <div className="flex items-center gap-3">
              <IconButton label="Notifications">
                <BellIcon className="size-5" />
              </IconButton>
              <IconButton label="Terminal">
                <TerminalIcon className="size-5" />
              </IconButton>
              <div className="hidden h-6 w-px bg-outline-variant sm:block" />
              <IconButton label="Logout">
                <PowerIcon className="size-5" />
              </IconButton>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-outline-variant/60 px-5 py-2 md:hidden" aria-label="Dashboard mobile navigation">
            {dashboardNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`shrink-0 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition duration-300 ${
                  item.active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-outline-variant bg-white/70 text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="container-portal max-w-[90rem] pb-20 pt-40 md:pt-24">
          <section className="dash-hero relative mb-10 border-b border-outline-variant pb-8 md:mb-12">
            <div className="dash-crosshair absolute -bottom-1 left-0" />
            <div className="dash-crosshair absolute -bottom-1 right-0" />
            <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
              <div>
                <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                  <span className="size-2 animate-pulse rounded-full bg-primary" />
                  Status: Online
                </p>
                <h1 className="font-headline text-[clamp(2.7rem,8vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.08em] text-on-surface">
                  Command_Center
                  <span className="block font-light text-outline">{"//"} Active_Protocols</span>
                </h1>
              </div>

              <form action="/dash" className="dash-filter-panel grid gap-3 rounded-xl border border-outline-variant bg-white/70 p-3 shadow-ambient backdrop-blur-xl sm:grid-cols-2 xl:w-[34rem]">
                <FilterInput name="keyword" defaultValue={keyword} placeholder="Keywords..." icon={<SearchIcon className="size-4" />} />
                <select name="source" defaultValue={source} className="dash-control">
                  <option value="">Source: All</option>
                  <option value="infopark">Infopark</option>
                  <option value="technopark">Technopark</option>
                </select>
                <FilterInput name="skill_set" defaultValue={skillSet} placeholder="Skill Set..." />
                <div className="grid grid-cols-[auto_1fr_auto_1fr] items-center gap-2 rounded border border-outline-variant bg-surface-container-low px-3 py-2">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-outline">EXP:</span>
                  <input name="min_experience" defaultValue={first(params.min_experience)} placeholder="Min" className="w-full border-0 bg-transparent p-0 font-mono text-xs focus:outline-none" />
                  <span className="text-outline">-</span>
                  <input name="max_experience" defaultValue={first(params.max_experience)} placeholder="Max" className="w-full border-0 bg-transparent p-0 font-mono text-xs focus:outline-none" />
                </div>
                <select name="sort" defaultValue={sort} className="dash-control">
                  <option value="posted_date">Posted Date</option>
                  <option value="closing_date">Closing Date</option>
                  <option value="experience_asc">Exp Asc</option>
                  <option value="experience_desc">Exp Desc</option>
                </select>
                <label className="group flex cursor-pointer items-center gap-3 rounded border border-outline-variant bg-surface-container-low px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant transition hover:border-primary hover:text-primary">
                  <input type="checkbox" name="showAll" value="1" defaultChecked={showAll} className="accent-primary" />
                  Show All
                </label>
                <button className="group flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-electric sm:col-span-2">
                  <FilterIcon className="size-4 transition-transform group-hover:rotate-12" />
                  Apply
                </button>
              </form>
            </div>
          </section>

          <section className="mb-8 grid gap-4 md:grid-cols-3">
            <MetricCard label="Matched Protocols" value={total.toLocaleString()} tone="primary" />
            <MetricCard label="Mode" value={showAll ? "Full Scan" : "Skill Match"} />
            <MetricCard label="Current Page" value={`${page}/${totalPages}`} />
          </section>

          {hasError ? (
            <AccessPanel message={result.error ?? "Unable to fetch your command center"} />
          ) : jobs.length === 0 ? (
            <div className="job-panel py-16 text-center">
              <p className="font-headline text-2xl font-bold uppercase tracking-[-0.05em]">No active protocols</p>
              <p className="mx-auto mt-3 max-w-md text-body-md text-on-surface-variant">
                Toggle Show All or adjust filters to widen the scan radius.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {jobs.map((job) => (
                <JobCard key={job.job_id} job={job} showGenerateEmail compact />
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-8 sm:flex-row">
            <PaginationLink disabled={page <= 1} label="Previous" href={buildDashHref(params, page - 1)} />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-on-surface-variant">
              Protocol page {page} of {totalPages}
            </span>
            <PaginationLink disabled={page >= totalPages} label="Next" href={buildDashHref(params, page + 1)} next />
          </div>
        </div>
      </div>
    </main>
  );
}

function DashSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface px-4 py-8 shadow-sm md:flex">
      <div className="mb-12 px-2">
        <div className="mb-2 flex items-center gap-3">
          <TerminalIcon className="size-7 text-primary" />
          <Link href="/" className="font-headline text-2xl font-bold uppercase tracking-[-0.08em] text-on-surface">
            JOBGRID
          </Link>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant">Terminal v2.4.1</p>
      </div>
      <nav className="flex-1 space-y-2">
        {dashboardNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`dash-nav-item ${item.active ? "dash-nav-item-active" : ""}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <Link href="/jobs" className="group flex w-full items-center justify-center gap-2 rounded bg-black px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-electric">
        <PowerIcon className="size-4 transition-transform group-hover:rotate-12" />
        Initiate Protocol
      </Link>
    </aside>
  );
}

const dashboardNavItems = [
  { label: "Jobs", href: "/dash", icon: <TerminalIcon className="size-5" />, active: true },
  { label: "Profile", href: "#", icon: <UserIcon className="size-5" /> },
  { label: "Resume Editor", href: "#", icon: <DocumentIcon className="size-5" /> },
  { label: "Settings", href: "#", icon: <GearIcon className="size-5" /> },
];

function FilterInput({
  name,
  defaultValue,
  placeholder,
  icon,
}: {
  name: string;
  defaultValue: string;
  placeholder: string;
  icon?: ReactNode;
}) {
  return (
    <label className="relative block">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">{icon}</span>}
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`dash-control w-full ${icon ? "pl-9" : "pl-3"}`}
      />
    </label>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone?: "primary" }) {
  return (
    <div className="dash-metric group rounded-2xl border border-outline-variant/70 bg-white/78 p-5 shadow-ambient backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-electric">
      <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
      <p className={`font-headline text-2xl font-bold uppercase tracking-[-0.06em] ${tone === "primary" ? "text-primary" : "text-on-surface"}`}>{value}</p>
    </div>
  );
}

function AccessPanel({ message }: { message: string }) {
  return (
    <div className="job-panel py-16 text-center">
      <p className="font-headline text-2xl font-bold uppercase tracking-[-0.05em]">Access Required</p>
      <p className="mx-auto mt-3 max-w-md text-body-md text-on-surface-variant">{message}</p>
      <Link href="/login" className="initialize-button mt-6">
        Login
        <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}

function PaginationLink({ disabled, label, href, next }: { disabled: boolean; label: string; href: string; next?: boolean }) {
  if (disabled) {
    return <span className="rounded-lg border border-outline-variant/50 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant/40">{label}</span>;
  }

  return (
    <Link href={href} className="group flex items-center gap-2 rounded-lg border border-outline-variant/70 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary">
      {!next && <ArrowRightIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />}
      {label}
      {next && <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />}
    </Link>
  );
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function toPositiveNumber(value: string, fallback: number) {
  const next = Number(value);
  return Number.isFinite(next) && next > 0 ? Math.floor(next) : fallback;
}

function optionalNumber(value: string) {
  const next = Number(value);
  return Number.isFinite(next) && value !== "" ? next : undefined;
}

function normalizeSort(value: string): UserJobsParams["sort"] {
  if (value === "closing_date" || value === "experience_asc" || value === "experience_desc") return value;
  return "posted_date";
}

function buildDashHref(params: Awaited<DashSearchParams>, page: number) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const next = first(value);
    if (next && key !== "page") query.set(key, next);
  }
  query.set("page", String(page));
  return `/dash?${query.toString()}`;
}

function IconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button aria-label={label} className="rounded-full p-2 text-on-surface-variant transition duration-300 hover:-translate-y-0.5 hover:bg-surface-container-high hover:text-primary">
      {children}
    </button>
  );
}

function SearchIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function TerminalIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16v14H4zM7 9l3 3-3 3M12 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function BellIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function PowerIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v10M6.2 6.2a8 8 0 1 0 11.6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function UserIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function DocumentIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h7l4 4v14H7zM14 3v5h5M10 13h6M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function GearIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a8 8 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L15 6h-4l-.4 3a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8 8 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 3h4l.4-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2.2-1.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function FilterIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16l-6 7v5l-4 2v-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ArrowRightIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
