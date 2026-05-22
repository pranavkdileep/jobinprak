import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";

const profiles = [
  {
    name: "Pranav K Dileep",
    role: "Creator & Developer",
    description: "Computer Science And Cyber Security Engineering Student At UCE Thodupuzha",
    initials: "PD",
    linkedin: "pranavkdileep",
  },
];

export default function NetworkPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader active="network" />

      <section className="container-portal pb-24 pt-32">
        <div className="mb-10 flex items-center gap-4">
          <UsersIcon className="size-6 shrink-0 text-primary" />
          <h1 className="font-headline text-2xl font-semibold uppercase tracking-[-0.05em] text-on-background md:text-[2rem]">
            Network
          </h1>
          <div className="h-px flex-1 bg-outline-variant" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile.name}
              className="group/card relative overflow-hidden rounded-2xl border border-outline-variant bg-white p-6 shadow-ambient transition duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-electric"
            >
              <div className="mb-5 flex items-center gap-4">
                <img
                  src="/pranav.jpg"
                  alt={profile.name}
                  className="size-14 rounded-xl object-cover"
                />
                <div>
                  <h2 className="font-headline text-lg font-bold uppercase tracking-[-0.06em] text-on-background">
                    {profile.name}
                  </h2>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-primary">
                    {profile.role}
                  </p>
                </div>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
                {profile.description}
              </p>

              <Link
                href={`https://linkedin.com/in/${profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-surface-variant transition duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <LinkedinIcon className="size-4" />
                <span>/in/{profile.linkedin}</span>
                <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-0.5">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function UsersIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2ZM6 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
