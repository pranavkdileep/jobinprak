"use client";

import { EmailModal } from "@/components/email-modal";
import type { Job } from "@/types/jobs";
import Link from "next/link";
import { useState } from "react";

export function JobCard({
  job,
  showGenerateEmail = false,
  compact = false,
  isUserDashboard = false,
}: {
  job: Job;
  showGenerateEmail?: boolean;
  compact?: boolean;
  isUserDashboard?: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const details = job.details;
  const applyValue = details?.apply_email ?? "";
  const normalEmail = isEmail(applyValue) ? applyValue.trim() : "";
  const externalApply = toExternalUrl(applyValue);
  const internalApplyHref = `/dash?jobid=${encodeURIComponent(String(job.job_id))}`;
  const hasValidEmail = showGenerateEmail && isEmail(applyValue);

  return (
    <>
      <article className="job-card scan-card group relative overflow-hidden rounded-2xl border border-outline-variant/50 bg-white p-5 shadow-ambient transition duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-electric md:p-6">
        <div className={compact ? "absolute right-4 top-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-outline-variant" : "hidden"}>
          ID:{job.job_id}
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-1 gap-4 md:gap-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface text-primary transition duration-300 group-hover:rotate-3 group-hover:scale-105 group-hover:bg-primary/10">
              <JobGlyph source={job.source} />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className={`font-headline font-bold uppercase leading-tight tracking-[-0.06em] ${compact ? "text-2xl" : "text-2xl md:text-[1.7rem]"}`}>
                  {job.job_title}
                </h2>
                {!compact && (
                  <span className="rounded border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">
                    Job_ID: {job.job_id}
                  </span>
                )}
              </div>

              <div className="grid gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-on-surface-variant sm:grid-cols-[auto_auto_auto] sm:items-center sm:gap-4">
                <span className="font-bold text-on-background">▦ {job.company_name}</span>
                <span className="hidden text-outline-variant sm:inline">{"//"}</span>
                <span>⌘ Source: {job.source || "Unknown"}</span>
                <span className="hidden text-outline-variant sm:inline">{"//"}</span>
                <span>⌁ {experienceLabel(details?.min_experience, details?.max_experience)}</span>
              </div>

              {!compact && details?.small_description && (
                <p className="max-w-3xl text-body-md text-on-surface-variant">
                  {details.small_description}
                </p>
              )}

              {details?.skill_set?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {details.skill_set.slice(0, compact ? 3 : 5).map((skill) => (
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

          <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-on-surface-variant">
              Closes {formatDate(job.closing_date)}
            </span>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
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
                <Link href={isUserDashboard ? `mailto:${normalEmail}` : internalApplyHref} className="initialize-button">
                  Initialize
                  <LoginIcon className="size-4" />
                </Link>
              )}
              {hasValidEmail && (
                <button onClick={() => setShowModal(true)} className="generate-email-button">
                  <MailIcon className="size-4" />
                  Generate Apply Email
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {showModal && job._id && (
        <EmailModal
          jobId={job._id}
          applyEmail={applyValue}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function isEmail(value?: string) {
  return !!value?.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
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

function MailIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4zM4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
