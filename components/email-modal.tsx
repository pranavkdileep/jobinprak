"use client";

import { generateApplicationEmail } from "@/actions/user/ai-email";
import { isGmailConnected, sendViaGmail } from "@/actions/user/gmail";
import { signIn } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface EmailModalProps {
  jobId: string;
  applyEmail: string;
  onClose: () => void;
}

type Phase = "generating" | "done" | "error";

export function EmailModal({ jobId, applyEmail, onClose }: EmailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("generating");
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<"email" | "subject" | "body" | null>(null);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailSending, setGmailSending] = useState(false);
  const [gmailResult, setGmailResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const generate = useCallback(async () => {
    const res = await generateApplicationEmail(jobId);
    if ("error" in res) {
      setError(res.error ?? "Generation failed");
      setPhase("error");
    } else {
      setSubject(res.subject);
      setBody(res.body);
      setResult({ subject: res.subject, body: res.body });
      setPhase("done");
    }
  }, [jobId]);

  useEffect(() => {
    generate();
  }, [generate]);

  useEffect(() => {
    if (phase !== "done") return;
    isGmailConnected().then(setGmailConnected);
  }, [phase]);

  async function handleSendViaGmail() {
    setGmailSending(true);
    setGmailResult(null);

    const fd = new FormData();
    fd.set("to", applyEmail);
    fd.set("subject", subject);
    fd.set("body", body);
    if (selectedFile) fd.set("resume", selectedFile);

    const res = await sendViaGmail(fd);
    setGmailResult({ success: "success" in res, message: res.error || res.message || "Sent" });
    setGmailSending(false);
  }

  async function copy(value: string, field: "email" | "subject" | "body") {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  if (!mounted) return null;

  return createPortal(
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

            <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-surface-variant">
                  Subject
                </span>
                <button
                  onClick={() => copy(subject, "subject")}
                  className="flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] transition hover:border-primary hover:text-primary"
                >
                  {copiedField === "subject" ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
                  {copiedField === "subject" ? "Copied" : "Copy"}
                </button>
              </div>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-sm text-on-surface outline-none transition focus:border-primary"
              />
            </div>

            <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-surface-variant">
                  Body
                </span>
                <button
                  onClick={() => copy(body, "body")}
                  className="flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] transition hover:border-primary hover:text-primary"
                >
                  {copiedField === "body" ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
                  {copiedField === "body" ? "Copied" : "Copy"}
                </button>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full resize-y rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs leading-relaxed text-on-surface outline-none transition focus:border-primary"
              />
            </div>

            {gmailConnected ? (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <GmailIcon className="size-4 text-primary" />
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-primary">
                    Send via Gmail
                  </span>
                </div>

                <label className="mb-3 flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant bg-white px-3 py-2 transition hover:border-primary">
                  <UploadIcon className="size-4 shrink-0 text-on-surface-variant" />
                  <span className="font-mono text-xs text-on-surface-variant">
                    {selectedFile ? selectedFile.name : "Attach resume (optional)"}
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                <button
                  onClick={handleSendViaGmail}
                  disabled={gmailSending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-primary-container disabled:opacity-50"
                >
                  {gmailSending ? (
                    <>
                      <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <GmailIcon className="size-4" />
                      Send via Gmail
                    </>
                  )}
                </button>

                {gmailResult && (
                  <div
                    className={`mt-3 rounded-lg border p-3 font-mono text-xs ${
                      gmailResult.success
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-red-300 bg-red-50 text-red-700"
                    }`}
                  >
                    {gmailResult.message}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-surface-container-low/50 p-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary transition hover:border-primary hover:bg-primary/5"
              >
                <GmailIcon className="size-4" />
                Connect Gmail to send directly
              </button>
            )}
          </div>
        )}
        </div>
      </div>
    </div>,
    document.body
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

function GmailIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
