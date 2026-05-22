"use client";

import { generateApplicationEmail } from "@/actions/user/ai-email";
import { useCallback, useEffect, useState } from "react";

interface EmailModalProps {
  jobId: string;
  applyEmail: string;
  onClose: () => void;
}

type Phase = "generating" | "done" | "error";

export function EmailModal({ jobId, applyEmail, onClose }: EmailModalProps) {
  const [phase, setPhase] = useState<Phase>("generating");
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<"email" | "subject" | "body" | null>(null);

  const generate = useCallback(async () => {
    const res = await generateApplicationEmail(jobId);
    if ("error" in res) {
      setError(res.error ?? "Generation failed");
      setPhase("error");
    } else {
      setResult({ subject: res.subject, body: res.body });
      setPhase("done");
    }
  }, [jobId]);

  useEffect(() => {
    generate();
  }, [generate]);

  async function copy(value: string, field: "email" | "subject" | "body") {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 py-4 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-electric"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -left-px -top-px size-4 border-l-2 border-t-2 border-primary" />
        <div className="absolute -bottom-px -right-px size-4 border-b-2 border-r-2 border-primary" />

        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-outline-variant/60 p-4 sm:items-center sm:p-6 md:p-8 md:pb-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low">
              <MailIcon className="size-4 text-primary" />
            </span>
            <div className="min-w-0">
              <h2 className="font-headline text-base font-bold uppercase tracking-[-0.04em] sm:text-lg">
                AI Application Email
              </h2>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-surface-variant">
                {phase === "generating" ? "GENERATING..." : phase === "done" ? "GENERATION COMPLETE" : "GENERATION FAILED"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-lg border border-outline-variant bg-white p-2 transition hover:bg-surface-container-low" aria-label="Close email generator">
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto p-4 sm:p-6 md:p-8 md:pt-6">
        {phase === "generating" && (
          <div className="flex min-h-[18rem] flex-col items-center justify-center gap-4 rounded-xl border border-outline-variant/60 bg-surface-container-low py-10 sm:py-16">
            <div className="flex items-center gap-1">
              <span className="size-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
              <span className="size-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
              <span className="size-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
            </div>
            <div className="space-y-1 text-center">
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-primary">
                Processing Request
              </p>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-surface-variant">
                Analyzing profile &amp; job details...
              </p>
            </div>
            <div className="mt-2 h-px w-48 animate-pulse bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        )}

        {phase === "error" && (
          <div className="rounded-xl border border-error/30 bg-error/5 p-6 text-center">
            <p className="font-headline text-lg font-semibold uppercase tracking-[-0.04em] text-error">
              Generation Failed
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant">
              {error}
            </p>
            <button onClick={generate} className="mt-4 rounded-lg bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-primary-container">
              Retry
            </button>
          </div>
        )}

        {phase === "done" && result && (
          <div className="space-y-4">
            <CopyRow label="Apply Email" value={applyEmail} field="email" copiedField={copiedField} onCopy={copy} />
            <CopyRow label="Subject" value={result.subject} field="subject" copiedField={copiedField} onCopy={copy} />
            <CopyRow label="Body" value={result.body} field="body" copiedField={copiedField} onCopy={copy} multiline />
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

function CopyRow({
  label,
  value,
  field,
  copiedField,
  onCopy,
  multiline,
}: {
  label: string;
  value: string;
  field: "email" | "subject" | "body";
  copiedField: string | null;
  onCopy: (value: string, field: "email" | "subject" | "body") => void;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-surface-variant">
          {label}
        </span>
        <button
          onClick={() => onCopy(value, field)}
          className="flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] transition hover:border-primary hover:text-primary"
        >
          {copiedField === field ? (
            <>
              <CheckIcon className="size-3" />
              Copied
            </>
          ) : (
            <>
              <CopyIcon className="size-3" />
              Copy
            </>
          )}
        </button>
      </div>
      {multiline ? (
        <p className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-on-surface">
          {value}
        </p>
      ) : (
        <p className="truncate font-mono text-sm text-on-surface">{value}</p>
      )}
    </div>
  );
}

function MailIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16v12H4zM4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CopyIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 8V4h12v12h-4M4 8h12v12H4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CheckIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
