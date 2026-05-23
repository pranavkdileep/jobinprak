import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with JobInPark. Reach out via LinkedIn, Telegram, GitHub, or email for support, feedback, or questions.",
  openGraph: {
    title: "Contact Us | JobInPark",
    description: "Get in touch with the JobInPark team.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="container-portal pb-24 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 flex items-center gap-4">
            <MailIcon className="size-6 shrink-0 text-primary" />
            <h1 className="font-headline text-2xl font-semibold uppercase tracking-[-0.05em] text-on-background md:text-[2rem]">
              Contact Us
            </h1>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-on-surface-variant">
            <p>
              Have a question, feedback, or need support? Reach out through any of the channels below.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <ContactCard
                icon={<LinkedinIcon className="size-5" />}
                label="LinkedIn"
                value="/in/pranavkdileep"
                href="https://linkedin.com/in/pranavkdileep"
              />
              <ContactCard
                icon={<TelegramIcon className="size-5" />}
                label="Telegram"
                value="@jobinparkbot"
                href="https://t.me/jobinparkbot"
              />
              <ContactCard
                icon={<GithubIcon className="size-5" />}
                label="GitHub"
                value="jobinprak"
                href="https://github.com/pranavkdileep/jobinprak"
              />
              <ContactCard
                icon={<MailIcon className="size-5" />}
                label="Email"
                value="pranavdileep10@gmail.com"
                href="mailto:pranavdileep10@gmail.com"
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card rounded-2xl border border-outline-variant bg-white p-5 shadow-ambient transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-electric"
    >
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-surface-container-low text-on-surface transition-colors duration-300 group-hover/card:bg-primary/10 group-hover/card:text-primary">
        {icon}
      </div>
      <p className="mb-1 font-headline text-sm font-bold uppercase tracking-[-0.04em] text-on-background">
        {label}
      </p>
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-primary">
        {value}
      </p>
    </Link>
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

function LinkedinIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2ZM6 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TelegramIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m21 3-9 9M21 3l-4 16-6-6M12 12l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GithubIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
