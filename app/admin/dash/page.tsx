import { getAnalytics } from "@/actions/admin/analatics";
import { adminLogout } from "@/actions/admin/auth";
import Link from "next/link";
import type { ReactNode } from "react";

export default async function AdminDashboardPage() {
  const analytics = await getAnalytics();

  if ("error" in analytics) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-portal py-12">
          <div className="rounded-2xl border border-outline-variant bg-white p-6 shadow-ambient">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
              ADMIN / ACCESS_DENIED
            </p>
            <h1 className="mt-3 font-headline text-3xl font-bold uppercase tracking-[-0.06em]">
              Unauthorized
            </h1>
            <Link
              href="/admin/login"
              className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-white transition hover:bg-primary-container"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container-portal py-12">
        <div className="mb-10 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-primary">
              ADMIN / DASHBOARD
            </span>
            <form action={adminLogout}>
              <button
                type="submit"
                className="rounded-lg border border-outline-variant px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-surface-variant transition hover:border-primary hover:text-primary"
              >
                Logout
              </button>
            </form>
          </div>
          <h1 className="font-headline text-3xl font-bold uppercase tracking-[-0.06em]">
            Control Center
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
            Analytics, usage telemetry, and management shortcuts
          </p>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <StatCard label="Total Users" value={analytics.totalUsers.toLocaleString()} icon={<UsersIcon className="size-6" />} />
          <StatCard label="Email Generations" value={analytics.totalEmailGenerations.toLocaleString()} icon={<MailIcon className="size-6" />} />
          <StatCard label="Token Usage" value={analytics.overallTokens.toLocaleString()} icon={<ChipIcon className="size-6" />} />
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-2">
          <AdminLinkCard
            href="/admin/dash/manageusers"
            title="Manage Users"
            description="Browse, search, edit, and remove user accounts"
            icon={<UsersIcon className="size-6" />}
          />
          <AdminLinkCard
            href="/admin/dash/managejobs"
            title="Manage Jobs"
            description="Create, update, import, and clean job listings"
            icon={<BriefcaseIcon className="size-6" />}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Latest Users" tag="USER_STREAM">
            <div className="space-y-3">
              {analytics.latestUsers.length === 0 ? (
                <EmptyState label="No users found" />
              ) : (
                analytics.latestUsers.map((user) => (
                  <UserRow
                    key={user._id}
                    name={formatName(user.firstName, user.lastName)}
                    meta={user.email}
                    value={formatDate(user.createdAt)}
                  />
                ))
              )}
            </div>
          </Panel>

          <Panel title="Top Users" tag="AI_USAGE">
            <div className="space-y-3">
              {analytics.topUsers.length === 0 ? (
                <EmptyState label="No AI usage yet" />
              ) : (
                analytics.topUsers.map((user) => (
                  <UserRow
                    key={user.userId}
                    name={formatName(user.firstName, user.lastName) || user.userId}
                    meta={user.email || user.userId}
                    value={`${user.totalEmailGenerations.toLocaleString()} EMAILS / ${user.totalTokens.toLocaleString()} TOKENS`}
                  />
                ))
              )}
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-6 shadow-ambient">
      <div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 font-headline text-3xl font-bold uppercase tracking-[-0.06em] text-on-background">
        {value}
      </p>
    </div>
  );
}

function AdminLinkCard({ href, title, description, icon }: { href: string; title: string; description: string; icon: ReactNode }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-outline-variant bg-white p-6 shadow-ambient transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-electric"
    >
      <div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-surface-container-low text-on-surface transition group-hover:bg-primary/10 group-hover:text-primary">
        {icon}
      </div>
      <h2 className="font-headline text-xl font-bold uppercase tracking-[-0.06em] text-on-background">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-on-surface-variant">{description}</p>
      <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">
        Open Module -&gt;
      </p>
    </Link>
  );
}

function Panel({ title, tag, children }: { title: string; tag: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-outline-variant bg-white p-6 shadow-ambient">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <h2 className="font-headline text-xl font-bold uppercase tracking-[-0.06em] text-on-background">
          {title}
        </h2>
        <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-primary">
          {tag}
        </span>
      </div>
      {children}
    </section>
  );
}

function UserRow({ name, meta, value }: { name: string; meta: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-outline-variant/70 bg-surface-container-low p-4">
      <div className="min-w-0">
        <p className="truncate font-headline text-sm font-bold uppercase tracking-[-0.04em] text-on-background">
          {name || "Unknown User"}
        </p>
        <p className="truncate font-mono text-[0.58rem] uppercase tracking-[0.12em] text-on-surface-variant">
          {meta}
        </p>
      </div>
      <p className="shrink-0 text-right font-mono text-[0.58rem] uppercase tracking-[0.12em] text-primary">
        {value}
      </p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-outline-variant p-6 text-center font-mono text-[0.62rem] uppercase tracking-[0.14em] text-on-surface-variant">
      {label}
    </div>
  );
}

function formatName(firstName?: string, lastName?: string) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

function formatDate(value?: string) {
  if (!value) return "NO DATE";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "NO DATE";
  return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(date);
}

function UsersIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="m22 7-10 7L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChipIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M8 11v2M16 11v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
