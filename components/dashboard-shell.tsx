import { logout } from "@/actions/user/logout";
import Link from "next/link";
import type { ReactNode } from "react";

const dashboardNavItems = [
  { key: "jobs", label: "Jobs", href: "/dash", icon: <TerminalIcon className="size-5" /> },
  { key: "profile", label: "Profile", href: "/dash/profile", icon: <UserIcon className="size-5" /> },
  { key: "resume", label: "Resume", href: "/dash/resume", icon: <DocumentIcon className="size-5" /> },
  { key: "settings", label: "Settings", href: "/dash/settings", icon: <GearIcon className="size-5" /> },
  { key: "coldemail", label: "Cold Email", href: "/dash/coldemail", icon: <MailIcon className="size-5" /> },
];

export function DashboardShell({
  children,
  active = "jobs",
  keyword = "",
}: {
  children: ReactNode;
  active?: string;
  keyword?: string;
}) {
  return (
    <main className="min-h-screen text-on-surface">
      <DashboardSidebar active={active} />

      <div className="min-h-screen md:ml-64">
        <DashboardTopbar active={active} keyword={keyword} />
        <div className="container-portal max-w-[90rem] pb-20 pt-40 md:pt-24">
          {children}
        </div>
      </div>
    </main>
  );
}

function DashboardSidebar({ active }: { active: string }) {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface px-4 py-8 shadow-sm md:flex">
      <div className="mb-12 px-2">
        <div className="mb-2 flex items-center gap-3">
          <TerminalIcon className="size-7 text-primary" />
          <Link href="/" className="font-headline text-2xl font-bold uppercase tracking-[-0.08em] text-on-surface">
            JobInPark
          </Link>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant">Terminal v2.4.1</p>
      </div>
      <nav className="flex-1 space-y-2">
        {dashboardNavItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`dash-nav-item ${item.key === active ? "dash-nav-item-active" : ""}`}
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

function DashboardTopbar({ active, keyword }: { active: string; keyword: string }) {
  return (
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
          <span className="font-headline text-xl font-bold tracking-[-0.08em]">JobInPark</span>
        </div>
        <div className="flex items-center gap-3">
          <IconButton label="Notifications">
            <BellIcon className="size-5" />
          </IconButton>
          <IconButton label="Terminal">
            <TerminalIcon className="size-5" />
          </IconButton>
          <div className="hidden h-6 w-px bg-outline-variant sm:block" />
          <form action={logout}>
            <IconButton label="Logout">
              <PowerIcon className="size-5" />
            </IconButton>
          </form>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-outline-variant/60 px-5 py-2 md:hidden" aria-label="Dashboard mobile navigation">
        {dashboardNavItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`shrink-0 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition duration-300 ${
              item.key === active
                ? "border-primary bg-primary/10 text-primary"
                : "border-outline-variant bg-white/70 text-on-surface-variant hover:border-primary hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
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

function MailIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16v12H4zM4 6l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
