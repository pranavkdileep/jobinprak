import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about JobInPark — an AI-driven job discovery platform built by Pranav K Dileep. Our mission, how it works, and the tech behind it.",
  openGraph: {
    title: "About Us | JobInPark",
    description: "AI-driven job discovery platform connecting talent with opportunity.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="container-portal pb-24 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 flex items-center gap-4">
            <InfoIcon className="size-6 shrink-0 text-primary" />
            <h1 className="font-headline text-2xl font-semibold uppercase tracking-[-0.05em] text-on-background md:text-[2rem]">
              About Us
            </h1>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-on-surface-variant">
            <p>
              JobInPark is an AI-driven job discovery platform built to connect talent with the right opportunities. We use intelligent matching algorithms to surface relevant positions based on your skills, experience, and preferences.
            </p>

            <Section title="Our Mission">
              <p>
                To simplify the job search process by delivering personalized, relevant opportunities directly to candidates — reducing noise and maximizing impact.
              </p>
            </Section>

            <Section title="How It Works">
              <ul className="ml-6 list-disc space-y-1">
                <li>Create a profile with your skills, experience, and preferences.</li>
                <li>Our system matches you with relevant job openings in real time.</li>
                <li>Receive notifications via email, Telegram, or WhatsApp.</li>
                <li>Apply with AI-generated cover letters tailored to each role.</li>
              </ul>
            </Section>

            <Section title="The Creator">
              <p>
                Built by Pranav K Dileep, a Computer Science and Cyber Security Engineering student at UCE Thodupuzha. This platform reflects a commitment to combining modern web technologies with practical solutions for real-world problems.
              </p>
            </Section>

            <Section title="Tech Stack">
              <p>Powered by Next.js, MongoDB, and the Workflow SDK — deployed on a modern cloud infrastructure with AI integration for intelligent job matching and communication.</p>
            </Section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="font-headline text-base font-semibold uppercase tracking-[-0.04em] text-on-background">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
