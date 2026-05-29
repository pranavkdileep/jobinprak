import { getUserJobByJobId } from "@/actions/user/jobs";
import { DashboardShell } from "@/components/dashboard-shell";
import { JobDetailActions } from "@/components/job-detail-actions";
import type { Job } from "@/types/jobs";
import Link from "next/link";

type JobSearchParams = Promise<{
  id?: string | string[];
}>;

export default async function DashJobPage({
  searchParams,
}: {
  searchParams: JobSearchParams;
}) {
  const params = await searchParams;
  const id = toPositiveNumber(first(params.id));
  const result = id ? await getUserJobByJobId(id) : { error: "Missing job id" };
  const hasError = "error" in result;
  const job = hasError ? null : (result.job as Job);

  return (
    <DashboardShell active="jobs">
      <section className="dash-hero relative mb-10 border-b border-outline-variant pb-8 md:mb-12">
        <div className="dash-crosshair absolute -bottom-1 left-0" />
        <div className="dash-crosshair absolute -bottom-1 right-0" />
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              Protocol Detail
            </p>
            <h1 className="font-headline text-[clamp(2.7rem,8vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.08em] text-on-surface">
              Job_Profile
              <span className="block font-light text-outline">{"//"} Full_Scan</span>
            </h1>
          </div>

          <Link href="/dash" className="rounded-lg border border-outline-variant/70 px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.14em] transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary">
            Back to Jobs
          </Link>
        </div>
      </section>

      {hasError || !job ? (
        <AccessPanel message={result.error ?? "Unable to fetch job details"} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <article className="job-panel overflow-hidden">
            <div className="border-b border-outline-variant p-5 md:p-7">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">
                  Job_ID: {job.job_id}
                </span>
                <span className="rounded border border-outline-variant bg-surface-container-low px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-on-surface-variant">
                  Source: {job.source || "Unknown"}
                </span>
              </div>
              <h2 className="font-headline text-4xl font-bold uppercase leading-none tracking-[-0.07em] text-on-surface md:text-5xl">
                {job.job_title}
              </h2>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant">
                {job.company_name}
              </p>
            </div>

            <div className="grid gap-6 p-5 md:p-7">
              {job.details?.small_description && (
                <section>
                  <SectionTitle>Overview</SectionTitle>
                  <p className="mt-3 text-body-md leading-7 text-on-surface-variant">
                    {job.details.small_description}
                  </p>
                </section>
              )}

              {job.details?.skill_set?.length > 0 && (
                <section>
                  <SectionTitle>Skill Set</SectionTitle>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.details.skill_set.map((skill) => (
                      <span key={skill} className="rounded-full border border-outline-variant/60 bg-surface-container-low px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-on-surface-variant">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {job.details?.responsibilities?.length > 0 && (
                <section>
                  <SectionTitle>Responsibilities</SectionTitle>
                  <ul className="mt-3 grid gap-3">
                    {job.details.responsibilities.map((responsibility) => (
                      <li key={responsibility} className="rounded-xl border border-outline-variant/60 bg-surface-container-low/60 p-4 text-body-sm leading-6 text-on-surface-variant">
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </article>

          <aside className="grid content-start gap-4">
            <div className="job-panel p-5">
              <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">Actions</p>
              <JobDetailActions job={job} />
            </div>

            <DetailCard label="Experience" value={experienceLabel(job.details?.min_experience, job.details?.max_experience)} />
            <DetailCard label="Posted Date" value={formatDate(job.posted_date)} />
            <DetailCard label="Closing Date" value={formatDate(job.closing_date)} />
            <DetailCard label="Company ID" value={String(job.company_id)} />
            <DetailCard label="Apply Contact" value={job.details?.apply_email || "Not provided"} />
          </aside>
        </div>
      )}
    </DashboardShell>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-on-surface">{children}</h3>;
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="dash-metric rounded-2xl border border-outline-variant/70 bg-white/78 p-5 shadow-ambient backdrop-blur">
      <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
      <p className="break-words font-headline text-2xl font-bold uppercase tracking-[-0.06em] text-on-surface">{value}</p>
    </div>
  );
}

function AccessPanel({ message }: { message: string }) {
  return (
    <div className="job-panel py-16 text-center">
      <p className="font-headline text-2xl font-bold uppercase tracking-[-0.05em]">Job Unavailable</p>
      <p className="mx-auto mt-3 max-w-md text-body-md text-on-surface-variant">{message}</p>
      <Link href="/dash" className="initialize-button mt-6">
        Back to Jobs
        <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function toPositiveNumber(value: string) {
  const next = Number(value);
  return Number.isFinite(next) && next > 0 ? Math.floor(next) : undefined;
}

function experienceLabel(min?: number, max?: number) {
  if (min !== undefined && max !== undefined) return `${min} - ${max} years`;
  if (min !== undefined) return `${min}+ years`;
  if (max !== undefined) return `Up to ${max} years`;
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

function ArrowRightIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
