import { listPublicJobs, type PublicJobsParams } from "@/actions/public/jobs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Job } from "@/types/jobs";
import Link from "next/link";
import type { ReactNode } from "react";

type JobsPageSearchParams = Promise<{
  page?: string | string[];
  keyword?: string | string[];
  location?: string | string[];
  source?: string | string[];
  skill_set?: string | string[];
  experience?: string | string[];
  sort?: string | string[];
}>;

const domainFilters = [
  "Artificial Intelligence",
  "Core Infrastructure",
  "Data Pipeline",
  "Frontend",
  "Product Design",
];

const sourceFilters = ["technopark", "infopark"];

export default async function JobsPage({
  searchParams,
}: {
  searchParams: JobsPageSearchParams;
}) {
  const params = await searchParams;
  const page = toPositiveNumber(first(params.page), 1);
  const keyword = first(params.keyword);
  const source = first(params.source);
  const skillSet = first(params.skill_set);
  const experience = first(params.experience);
  const sort = normalizeSort(first(params.sort));
  const bounds = experienceBounds(experience);

  const query: PublicJobsParams = {
    page,
    limit: 8,
    keyword: keyword || undefined,
    source: source || undefined,
    skill_set: skillSet || undefined,
    min_experience: bounds.min,
    max_experience: bounds.max,
    sort,
  };

  const result = await listPublicJobs(query);
  const hasError = "error" in result;
  const jobs = hasError ? [] : (result.jobs as Job[]);
  const total = hasError ? 0 : result.total;
  const totalPages = hasError ? 1 : Math.max(result.totalPages, 1);

  return (
    <main className="min-h-screen overflow-hidden pt-28 text-on-background md:pt-32">
      <SiteHeader active="jobs" />

      <section className="container-portal pb-8 pt-8 md:pt-12">
        <div className="border-b border-outline-variant/40 pb-8">
          <div className="flex items-center gap-4">
            <TerminalIcon className="size-8 text-primary" />
            <h1 className="font-headline text-[clamp(2.5rem,7vw,4.5rem)] font-bold uppercase leading-none tracking-[-0.08em]">
              ACTIVE_PROTOCOLS
            </h1>
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-on-surface-variant md:pl-12">
            Current hiring cycles in the network. {total.toLocaleString()} live signals indexed.
          </p>
        </div>
      </section>

      <section className="container-portal grid gap-6 pb-20 lg:grid-cols-12 lg:items-start">
        <aside className="job-panel lg:sticky lg:top-32 lg:col-span-3">
          <div className="mb-6 flex items-center gap-3 border-b border-outline-variant/40 pb-4">
            <TuneIcon className="size-4 text-on-surface-variant" />
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-on-surface-variant">
              Filter Parameters
            </h2>
          </div>
          <form className="space-y-8" action="/jobs">
            <input type="hidden" name="keyword" value={keyword} />
            <div className="space-y-3">
              <label className="font-mono text-xs uppercase tracking-[0.16em] text-on-background">
                Domain Cluster
              </label>
              <div className="space-y-2.5">
                <label className="group flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="skill_set"
                    value=""
                    defaultChecked={!skillSet}
                    className="peer sr-only"
                  />
                  <span className="flex size-4 items-center justify-center rounded border border-outline-variant bg-surface-container-low transition duration-300 group-hover:border-primary peer-checked:border-primary peer-checked:bg-primary/10">
                    <span className="size-2 rounded-sm bg-primary opacity-0 transition-opacity group-has-[:checked]:opacity-100" />
                  </span>
                  <span className="text-body-md text-on-surface-variant transition-colors group-hover:text-primary peer-checked:font-medium peer-checked:text-on-background">
                    Any Domain
                  </span>
                </label>
                {domainFilters.map((domain) => (
                  <label key={domain} className="group flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="skill_set"
                      value={domain}
                      defaultChecked={skillSet === domain}
                      className="peer sr-only"
                    />
                    <span className="flex size-4 items-center justify-center rounded border border-outline-variant bg-surface-container-low transition duration-300 group-hover:border-primary peer-checked:border-primary peer-checked:bg-primary/10">
                      <span className="size-2 rounded-sm bg-primary opacity-0 transition-opacity group-has-[:checked]:opacity-100" />
                    </span>
                    <span className="text-body-md text-on-surface-variant transition-colors group-hover:text-primary peer-checked:font-medium peer-checked:text-on-background">
                      {domain}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-mono text-xs uppercase tracking-[0.16em] text-on-background">
                Source Node
              </label>
              <select
                name="source"
                defaultValue={source}
                className="w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-surface-container-low px-3 py-2.5 font-mono text-xs uppercase tracking-[0.12em] transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                <option value="">Any Source</option>
                {sourceFilters.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="font-mono text-xs uppercase tracking-[0.16em] text-on-background">
                Experience Bound
              </label>
              <select
                name="experience"
                defaultValue={experience}
                className="w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-surface-container-low px-3 py-2.5 font-mono text-xs uppercase tracking-[0.12em] transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                <option value="">Any Duration</option>
                <option value="0-2">0 - 2 Years</option>
                <option value="3-7">3 - 7 Years</option>
                <option value="8+">8+ Years</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="font-mono text-xs uppercase tracking-[0.16em] text-on-background">
                Sort Vector
              </label>
              <select
                name="sort"
                defaultValue={sort}
                className="w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-surface-container-low px-3 py-2.5 font-mono text-xs uppercase tracking-[0.12em] transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                <option value="posted_date">Latest Posted</option>
                <option value="closing_date">Closing Soon</option>
                <option value="experience_asc">Experience Asc</option>
                <option value="experience_desc">Experience Desc</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 rounded-lg bg-black px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-electric">
                Sync
              </button>
              <Link
                href="/jobs"
                className="rounded-lg border border-outline-variant px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant transition hover:border-primary hover:text-primary"
              >
                Reset
              </Link>
            </div>
          </form>
        </aside>

        <div className="space-y-6 lg:col-span-9">
          <form
            action="/jobs"
            className="job-panel grid gap-4 overflow-hidden md:grid-cols-[1fr_1fr_auto] md:items-center"
          >
            <ProtocolInput
              name="keyword"
              defaultValue={keyword}
              placeholder="Protocol Keyword..."
              icon={<CodeIcon className="size-4" />}
            />
            <ProtocolInput
              name="location"
              defaultValue={first(params.location)}
              placeholder="Network Node (Location)"
              icon={<PinIcon className="size-4" />}
            />
            <input type="hidden" name="source" value={source} />
            <input type="hidden" name="skill_set" value={skillSet} />
            <input type="hidden" name="experience" value={experience} />
            <input type="hidden" name="sort" value={sort} />
            <button className="group flex justify-center gap-3 rounded-lg bg-black px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-electric active:translate-y-0">
              Execute
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>

          {hasError ? (
            <EmptyState title="Signal interrupted" body={result.error ?? "Failed to fetch jobs"} />
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No protocols matched"
              body="Adjust filters or reset parameters to scan the whole job network."
            />
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.job_id} job={job} />
              ))}
            </div>
          )}

          <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant/40 pt-8 sm:flex-row">
            <PaginationLink
              disabled={page <= 1}
              label="Previous Cycle"
              href={buildJobsHref(params, page - 1)}
            />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-on-surface-variant">
              Page {page} / {totalPages}
            </span>
            <PaginationLink
              disabled={page >= totalPages}
              label="Load More Protocols"
              href={buildJobsHref(params, page + 1)}
              next
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function JobCard({ job }: { job: Job }) {
  const details = job.details;
  const applyValue = details?.apply_email ?? "";
  const externalApply = toExternalUrl(applyValue);
  const internalApplyHref = `/dash/apply?jobid=${encodeURIComponent(String(job.job_id))}`;

  return (
    <article className="job-card scan-card group relative overflow-hidden rounded-2xl border border-outline-variant/50 bg-white p-5 shadow-ambient transition duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-electric md:p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface text-primary transition duration-300 group-hover:rotate-3 group-hover:scale-105 group-hover:bg-primary/10">
            <JobGlyph source={job.source} />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-headline text-2xl font-bold uppercase leading-tight tracking-[-0.06em] md:text-[1.7rem]">
                {job.job_title}
              </h2>
              <span className="rounded border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">
                Job_ID: {job.job_id}
              </span>
            </div>

            <div className="grid gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-on-surface-variant sm:grid-cols-[auto_auto_auto] sm:items-center sm:gap-4">
              <span className="font-bold text-on-background">▦ {job.company_name}</span>
              <span className="hidden text-outline-variant sm:inline">{"//"}</span>
              <span>⌘ Source: {job.source || "Unknown"}</span>
              <span className="hidden text-outline-variant sm:inline">{"//"}</span>
              <span>⌁ {experienceLabel(details?.min_experience, details?.max_experience)}</span>
            </div>

            {details?.small_description && (
              <p className="max-w-3xl text-body-md text-on-surface-variant">
                {details.small_description}
              </p>
            )}

            {details?.skill_set?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {details.skill_set.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-outline-variant/60 bg-surface-container-low px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-on-surface-variant transition group-hover:border-primary/30 group-hover:text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:flex-col md:items-end">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-on-surface-variant">
            Closes {formatDate(job.closing_date)}
          </span>
          {externalApply ? (
            <a
              href={externalApply}
              target="_blank"
              rel="noreferrer"
              className="initialize-button"
            >
              Initialize
              <ExternalIcon className="size-4" />
            </a>
          ) : (
            <Link href={internalApplyHref} className="initialize-button">
              Initialize
              <LoginIcon className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function ProtocolInput({
  name,
  defaultValue,
  placeholder,
  icon,
}: {
  name: string;
  defaultValue: string;
  placeholder: string;
  icon: ReactNode;
}) {
  return (
    <label className="group/input relative block">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within/input:text-primary">
        {icon}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-3.5 pl-11 pr-4 font-mono text-xs uppercase tracking-[0.16em] transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
        placeholder={placeholder}
      />
    </label>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="job-panel py-16 text-center">
      <p className="font-headline text-2xl font-bold uppercase tracking-[-0.05em]">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-body-md text-on-surface-variant">{body}</p>
    </div>
  );
}

function PaginationLink({
  disabled,
  label,
  href,
  next,
}: {
  disabled: boolean;
  label: string;
  href: string;
  next?: boolean;
}) {
  if (disabled) {
    return (
      <span className="rounded-lg border border-outline-variant/50 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant/40">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-lg border border-outline-variant/70 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
    >
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

function normalizeSort(value: string): PublicJobsParams["sort"] {
  if (
    value === "closing_date" ||
    value === "experience_asc" ||
    value === "experience_desc"
  ) {
    return value;
  }

  return "posted_date";
}

function experienceBounds(value: string) {
  if (value === "0-2") return { min: 0, max: 2 };
  if (value === "3-7") return { min: 3, max: 7 };
  if (value === "8+") return { min: 8, max: undefined };
  return { min: undefined, max: undefined };
}

function buildJobsHref(
  params: Awaited<JobsPageSearchParams>,
  page: number,
) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const next = first(value);
    if (next && key !== "page") query.set(key, next);
  }
  query.set("page", String(page));
  return `/jobs?${query.toString()}`;
}

function toExternalUrl(value: string) {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return "";
}

function experienceLabel(min?: number, max?: number) {
  if (min !== undefined && max !== undefined) return `${min} - ${max} years exp`;
  if (min !== undefined) return `${min}+ years exp`;
  if (max !== undefined) return `Up to ${max} years exp`;
  return "Experience open";
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

function JobGlyph({ source }: { source: string }) {
  if (source?.toLowerCase().includes("techno")) {
    return <ShieldIcon className="size-7" />;
  }

  if (source?.toLowerCase().includes("info")) {
    return <CodeBoxIcon className="size-7" />;
  }

  return <CubeIcon className="size-7" />;
}

function TerminalIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5h16v14H4zM7 9l3 3-3 3M12 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TuneIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h10M18 7h2M4 12h3M11 12h9M4 17h12M6 5v4M9 10v4M18 15v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CodeIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-5.1 7-12A7 7 0 1 0 5 9c0 6.9 7 12 7 12Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoginIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8M17 14v5H5V7h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CubeIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3ZM4 7.5l8 4.5 8-4.5M12 12v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CodeBoxIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4zM8 10l-2 2 2 2M16 10l2 2-2 2M10 16l4-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
