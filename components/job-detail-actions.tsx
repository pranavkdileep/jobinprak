"use client";

import { EmailModal } from "@/components/email-modal";
import type { Job } from "@/types/jobs";
import Link from "next/link";
import { useState } from "react";

export function JobDetailActions({ job }: { job: Job }) {
  const [showModal, setShowModal] = useState(false);
  const applyValue = job.details?.apply_email ?? "";
  const externalApply = toExternalUrl(applyValue);
  const normalEmail = isEmail(applyValue) ? applyValue.trim() : "";
  const canGenerateEmail = !!job._id && isEmail(applyValue);

  return (
    <>
      <div className="flex flex-col gap-3">
        {externalApply ? (
          <a href={externalApply} target="_blank" rel="noreferrer" className="initialize-button w-full justify-center">
            Initialize
            <ExternalIcon className="size-4" />
          </a>
        ) : (
          <Link href={normalEmail ? `mailto:${normalEmail}` : `/dash/job?id=${job.job_id}`} className="initialize-button w-full justify-center">
            Initialize
            <LoginIcon className="size-4" />
          </Link>
        )}

        {canGenerateEmail && (
          <button onClick={() => setShowModal(true)} className="generate-email-button w-full justify-center">
            <MailIcon className="size-4" />
            Generate Apply Email
          </button>
        )}
      </div>

      {showModal && job._id && (
        <EmailModal jobId={job._id} applyEmail={applyValue} onClose={() => setShowModal(false)} />
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

function LoginIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ExternalIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8M17 14v5H5V7h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function MailIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16v12H4zM4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
