import { getUserProfile } from "@/actions/user/profile";
import { DashboardShell } from "@/components/dashboard-shell";
import { renderResume } from "@/lib/resume-templates";
import type { User } from "@/types/user";
import { redirect } from "next/navigation";

type ResumeSearchParams = Promise<{
  theme?: string | string[];
  error?: string | string[];
}>;

type ResumeUser = Omit<User, "password" | "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

const THEMES = [
  { id: "minimalist", label: "Minimalist", desc: "Clean & professional", color: "#111", bg: "#fff", accent: "#e5e5e5" },
  { id: "executive", label: "Executive", desc: "Sidebar layout, serif", color: "#1a2332", bg: "#faf9f6", accent: "#c4a35a" },
  { id: "creative", label: "Creative", desc: "Gradient accents, cards", color: "#6366f1", bg: "#fff", accent: "#a855f7" },
  { id: "tech", label: "Terminal", desc: "Monospace, code editor", color: "#569cd6", bg: "#1e1e1e", accent: "#dcdcaa" },
];

export default async function ResumePage({
  searchParams,
}: {
  searchParams: ResumeSearchParams;
}) {
  const params = await searchParams;
  const result = await getUserProfile();
  const user = "user" in result ? (result.user as ResumeUser) : null;
  const error = first(params.error);

  if (!user) {
    redirect(`/dash/resume?error=${encodeURIComponent("Unable to load profile data")}`);
  }

  const themeId = first(params.theme) || "minimalist";
  const activeTheme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const html = renderResume(user as unknown as User, themeId);

  return (
    <DashboardShell active="resume">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 border-b-2 border-on-surface pb-6 md:mb-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                {"//"} Document_Generator
              </p>
              <h1 className="font-headline text-[clamp(2.8rem,8vw,4.5rem)] font-bold leading-none tracking-[-0.08em] text-on-surface">
                Resume Forge
              </h1>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded border border-outline-variant bg-surface-container-low px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-on-surface shadow-ambient">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              Render_Mode: Live Preview
            </div>
          </div>
        </header>

        {error && <StatusMessage tone="error" message={error} />}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {THEMES.map((theme) => (
              <ThemeSelector key={theme.id} theme={theme} active={theme.id === themeId} />
            ))}
          </div>
          <div className="flex gap-3">
            <a href={`/api/resume?theme=${themeId}`} className="resume-download-button" download={`${user.firstName}_${user.lastName}_resume.pdf`}>
              <DownloadIcon className="size-4 transition-transform group-hover:rotate-12" />
              Download PDF
            </a>
          </div>
        </div>

        <div className="resume-preview-wrapper">
          <div className="resume-preview-header">
            <div className="flex items-center gap-3">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-on-surface-variant">
              preview — {activeTheme.label}.html
            </span>
            <div className="flex items-center gap-2">
              <span
                className="size-4 rounded-sm border border-outline-variant"
                style={{ backgroundColor: activeTheme.bg }}
              />
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-on-surface-variant">
                {activeTheme.desc}
              </span>
            </div>
          </div>
          <div className="resume-iframe-container">
            <iframe
              className="resume-iframe"
              srcDoc={html}
              title="Resume Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-outline-variant bg-surface-container-low/60 p-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-on-surface-variant">
            {"//"} Tip: Use browser print (Ctrl+P / Cmd+P) for best PDF results. Select "Save as PDF" and set margins to "None" for optimal output.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

function ThemeSelector({
  theme,
  active,
}: {
  theme: (typeof THEMES)[number];
  active: boolean;
}) {
  return (
    <a
      href={`?theme=${theme.id}`}
      className={`resume-theme-card group relative overflow-hidden rounded-xl border p-3 transition duration-300 ${
        active
          ? "border-primary/60 bg-primary/5 shadow-electric"
          : "border-outline-variant/70 bg-white/70 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-ambient"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <span className="size-3 rounded-full" style={{ backgroundColor: theme.color }} />
          <span className="size-3 rounded-full" style={{ backgroundColor: theme.accent }} />
          <span className="size-3 rounded-full" style={{ backgroundColor: theme.bg, border: "1px solid var(--color-outline-variant)" }} />
        </div>
        <div>
          <span className={`block font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${active ? "text-primary" : "text-on-surface"}`}>
            {theme.label}
          </span>
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-on-surface-variant">
            {theme.desc}
          </span>
        </div>
      </div>
      {active && (
        <div className="absolute right-2 top-2">
          <span className="flex size-4 items-center justify-center rounded-full bg-primary">
            <CheckIcon className="size-3 text-white" />
          </span>
        </div>
      )}
    </a>
  );
}

function StatusMessage({ tone, message }: { tone: "success" | "error"; message: string }) {
  return (
    <div className={`mb-6 rounded-xl border px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] shadow-ambient ${tone === "success" ? "border-primary/30 bg-primary/10 text-primary" : "border-error/30 bg-error/10 text-error"}`}>
      {tone === "success" ? "SYNC_OK" : "SYNC_ERROR"}: {message}
    </div>
  );
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function DownloadIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v12M12 15l-5-5M12 15l5-5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
