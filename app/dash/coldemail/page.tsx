"use client";

import { isGmailConnected, sendViaGmail } from "@/actions/user/gmail";
import { DashboardShell } from "@/components/dashboard-shell";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ColdEmailPage() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emails, setEmails] = useState("");
  const [delaySeconds, setDelaySeconds] = useState(3);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  useEffect(() => {
    isGmailConnected().then(setConnected);
  }, []);

  async function handleSend() {
    const recipients = parseEmails(emails);
    if (recipients.length === 0) {
      setSendStatus("Add at least one recipient email.");
      return;
    }

    if (!subject.trim() || !body.trim()) {
      setSendStatus("Subject and body are required.");
      return;
    }

    setSending(true);
    setSendStatus(`Sending 0/${recipients.length}...`);

    let sentCount = 0;
    let remaining = recipients;

    for (const [index, email] of recipients.entries()) {
      const formData = new FormData();
      formData.set("to", email);
      formData.set("subject", subject);
      formData.set("body", body);
      if (selectedFile) formData.set("resume", selectedFile);

      const result = await sendViaGmail(formData);

      if ("success" in result) {
        sentCount += 1;
        remaining = remaining.filter((item) => item !== email);
        setEmails(remaining.join("\n"));
        setSendStatus(`Sent ${sentCount}/${recipients.length}. Last: ${email}`);
      } else {
        setSendStatus(result.error || `Failed to send ${email}`);
      }

      if (index < recipients.length - 1 && delaySeconds > 0) {
        await wait(delaySeconds * 1000);
      }
    }

    setSending(false);
    setSendStatus(sentCount === recipients.length ? `All ${sentCount} emails sent.` : `Sent ${sentCount}/${recipients.length}. Failed emails remain in the list.`);
  }

  return (
    <DashboardShell active="coldemail">
      <section className="dash-hero relative mb-10 border-b border-outline-variant pb-8 md:mb-12">
        <div className="dash-crosshair absolute -bottom-1 left-0" />
        <div className="dash-crosshair absolute -bottom-1 right-0" />
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              Cold Email Terminal
            </p>
            <h1 className="font-headline text-[clamp(2.7rem,8vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.08em] text-on-surface">
              Cold_Outreach
              <span className="block font-light text-outline">{"//"} Draft & Send</span>
            </h1>
          </div>
        </div>
      </section>

      {connected === null ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : connected ? (
        <>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
            <section className="job-panel p-5 md:p-7">
            <div className="mb-6 border-b border-outline-variant pb-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">Composer</p>
              <h2 className="mt-2 font-headline text-3xl font-bold uppercase tracking-[-0.06em] text-on-surface">
                Message Payload
              </h2>
              <p className="mt-2 text-body-sm text-on-surface-variant">
                Prepare the subject, email body, and optional resume attachment.
              </p>
            </div>

            <form className="grid gap-5">
              <label className="grid gap-2">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-on-surface-variant">
                  Subject
                </span>
                <input
                  name="subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Application for Software Engineer role"
                  className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-on-surface-variant">
                  Body
                </span>
                <textarea
                  name="body"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={14}
                  placeholder="Hi,\n\nI came across your team and wanted to reach out..."
                  className="min-h-[22rem] resize-y rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm leading-6 text-on-surface transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
              </label>

              <label className="grid gap-2 rounded-xl border border-dashed border-outline-variant bg-surface-container-low/60 p-4 transition hover:border-primary/70">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-on-surface-variant">
                  Resume Attachment Optional
                </span>
                <input
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                  className="text-sm text-on-surface-variant file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-mono file:text-xs file:font-semibold file:uppercase file:tracking-[0.12em] file:text-white hover:file:bg-primary-container"
                />
              </label>
            </form>
          </section>

          <section className="job-panel p-5 md:p-7">
            <div className="mb-6 border-b border-outline-variant pb-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">Recipients</p>
              <h2 className="mt-2 font-headline text-3xl font-bold uppercase tracking-[-0.06em] text-on-surface">
                Email Targets
              </h2>
              <p className="mt-2 text-body-sm text-on-surface-variant">
                Paste recipient email addresses line by line.
              </p>
            </div>

            <label className="grid gap-2">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-on-surface-variant">
                Emails
              </span>
              <textarea
                name="emails"
                value={emails}
                onChange={(event) => setEmails(event.target.value)}
                rows={22}
                placeholder={"hr@company.com\nrecruiter@startup.io\nfounder@example.com"}
                className="min-h-[34rem] resize-y rounded-xl border border-outline-variant bg-black px-4 py-4 font-mono text-sm leading-6 text-white shadow-inner outline-none transition placeholder:text-white/35 focus:border-primary focus:ring-2 focus:ring-primary/25"
              />
            </label>
            </section>
          </div>

          <div className="job-panel mt-6 flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between md:p-6">
            <label className="grid gap-2 md:w-64">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-on-surface-variant">
                Delay Between Emails Seconds
              </span>
              <input
                type="number"
                min="0"
                value={delaySeconds}
                onChange={(event) => setDelaySeconds(Math.max(0, Number(event.target.value) || 0))}
                className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 font-mono text-sm text-on-surface transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </label>

            <div className="flex flex-col gap-3 md:items-end">
              {sendStatus && (
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant">
                  {sendStatus}
                </p>
              )}
              <button
                type="button"
                disabled={sending}
                onClick={handleSend}
                className="rounded-xl bg-primary px-8 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-electric disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {sending ? "Sending..." : "Send Emails"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="job-panel py-16 text-center">
          <p className="font-headline text-2xl font-bold uppercase tracking-[-0.05em]">Connect Gmail</p>
          <p className="mx-auto mt-3 max-w-md text-body-md text-on-surface-variant">
            Link your Gmail account to start sending cold emails directly from the terminal.
          </p>
          <button
            onClick={() => signIn("google")}
            className="mx-auto mt-8 flex items-center gap-2 rounded-xl border border-outline-variant/60 bg-surface-container-low/50 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary transition hover:border-primary hover:bg-primary/5"
          >
            <GmailIcon className="size-5" />
            Connect Gmail
          </button>
        </div>
      )}
    </DashboardShell>
  );
}

function parseEmails(value: string) {
  return Array.from(
    new Set(
      value
        .split(/\r?\n/)
        .map((email) => email.trim())
        .filter(Boolean)
    )
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function GmailIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 6.5v11a2 2 0 0 1-2 2h-2V8.5l-6 4.5-6-4.5v11H4a2 2 0 0 1-2-2v-11a2 2 0 0 1 .76-1.55L12 1l9.24 3.95A2 2 0 0 1 22 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
